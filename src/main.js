const server = axios.create({
    baseURL: 'http://localhost:3000'
})

function defaultHome(){
    server.get('/api/spotify/')
    .then(({data})=>{
      let htmls = ''
      if (!data.artists) return ''
      for (let i = 0;i<data.artists.length;i++){
        let item = data.artists[i]
        let id = item.id.replace(/\s+/gi, '')
        let image = ''
        if (item.images && item.images.length && item.images[0]) {
          image = `<img src="${item.images[0].url}" alt="${item.name}" className="card-img-top img-thumbnail" style="border: none;width: 100%;"/>`
        }
        htmls+=`
          <div class='col-3 mb-3 card pt-2' onclick="pageArtist('${id}')">
            ${image}
             <div class="card-body">
                <h5 class="card-title">${item.name}</h5>
                <p class="card-text">
                Follower: ${item.followers.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                Genre: ${item.genres.join(', ')}
                </p>
            </div>
          </div>
        `
      }
      $('#spotifyList').html(htmls)
      $('#spotifyReadByArtist').empty()
    })
}

$(function () {
    defaultHome();

  $('#form-query')
    .keypress(function (event) {
      var keycode = (event.keyCode ? event.keyCode : event.which)
      if(this.value.length < 1){ defaultHome()}
      if (keycode == '13') {
        server.get('/api/spotify/search/artists/'+this.value.replace(/[^\w\s]/g, ''))
          .then(({data})=>{
            let htmls = ''
            for (let i = 0;i<data.artists.length;i++){
              let item = data.artists[i]
              let image = ''
              if (item.images && item.images.length && item.images[0]) {
                image = `<img src="${item.images[0].url}" alt="${item.name}" class="card-img-top img-thumbnail" style="border: none;width: 100%;"/>`
              }
              let id = item.id.replace(/\s+/gi, '')
              htmls+=`
          <div class='col-3 mb-3 card pt-2' onclick="pageArtist('${id}')">
            ${image}
             <div class="card-body">
                <h5 class="card-title">${item.name}</h5>
                <p class="card-text">
                Follower: ${item.followers.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                Genre: ${item.genres.join(', ')}
                </p>
            </div>
          </div>
        `
            }
            $('#spotifyList').html(htmls).show()
            $('#spotifyReadByArtist').empty()
          })

      }
    })
})

let query = ''

if (!localStorage.getItem('token')) {
    noLogin()
} else {
    login()
}

$('#form-query').on('keyup', function() {
    let value = $(this).val().toLowerCase();
    // console.log(value)
    query = value
    //tembak ke server spotify
})

function login() {
    $('.usersLogin').show()
    $('.noLogin').hide()
    $('#isLogin').show()
}

function noLogin() {
    $('.usersLogin').hide()
    $('.noLogin').show()
    $('#isLogin').hide()
}

function onSignIn(googleUser) {
    const profile = googleUser.getBasicProfile()
    const id_token = googleUser.getAuthResponse().id_token
    let user = {
        token: id_token
    }

    server({
        url: `/users/login`,
        method: 'post',
        data: user
    })
    .then(({data}) => {
        // swal(`Welcome! ${profile.getName()}`, ``, "success");
        localStorage.setItem('token', data)
        login()
    })
    .catch(err => {
        console.log(err)
    })
}

function signOut() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut()
    .then(function () {
        localStorage.removeItem('token')
        noLogin()
        swal("Signing Out!", "", "success");
    });
}

function btnBack() {
  $('#spotifyList').show(); $('#spotifyReadByArtist').hide();
}

//spotify
function pageArtist(id){
  id = id.replace(/\s+/,'')
  $('#spotifyList').hide();
  $('#spotifyReadByArtist').empty().show();
  server.get('/api/spotify/read/artist/'+id)
    .then(({data})=>{
      let artist = data.artist;
      let image = ''
      if (artist.images && artist.images.length && artist.images[0]) {
        image = `<img src="${artist.images[0].url}" alt="${artist.name}" className="card-img-top img-thumbnail" style="width: 100%;"/>`
      }
      var html= `<div class="row"><a onclick="btnBack()" style="color: white;font-size: 18px">Back</a></div>`
      html += `<div class='pt-2 row mt-5'>
              <div class="col-4">
                  ${image}
              </div>
              <div class="card-body col-6">
                  <h3 class="card-title">${artist.name}</h3>
                  <p class="card-text">Follower: ${artist.followers.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</p>
                  <p class="card-text">Genre: ${artist.genres.join(', ')}</p>
              </div>
              <div>
                <a href="#" onclick="getArtistEvents('${artist.name}')">Events</a>
                <div id="loadingGif1" style="display: none;">
                    <img src="https://media.tenor.com/images/1200075e7ad907ee57e6b70f500bce57/tenor.gif" alt="">
                </div>
              </div> 
              <div class="ml-3">
                <a href="#" onclick="getNews('${artist.name}')">News</a>
                <div id="loadingGif2" style="display: none;">
                    <img src="https://media.tenor.com/images/1200075e7ad907ee57e6b70f500bce57/tenor.gif" alt="">
                </div>
              </div>
              <div>
                <ul id="artist-event-list"></ul>
              </div>
              <div>
                <ul id="artist-news"></ul>
              </div>
          </div>
        <ul id="spotifyListAlbum" class="list-group mt-2" style="width: 100%"></ul>`;
      $('#spotifyReadByArtist').html(html)
      html = '<h5>Albums</h5>'
      let albums = data.albums
      for (let i=0;i<albums.length;i++){
        let album = albums[i]
        let image = ''
        if (album.images && album.images.length && album.images[0]) {
          image = `<img src="${album.images[0].url}" alt="${album.name}" style="width: 50px;height: 50px;border-radius: 50%;margin-top: -50px;">`
        }
        html+=`
        <li class="list-group-item" style="width: 100%;border:none;margin-top: -30px">
            ${image}
            <div class="pl-4 pt-4" style="display: inline-block">
                <h6 >${album.name}</h6>
                <p>Total tracks : ${album.total_tracks} <br>Release : ${album.release_date}</p>
            </div>
            <ul class="list-group">
        `;
        let tracks = album.tracks.items
        let limitTrack = (tracks.length < 5 ? tracks.length : 5)
        for(let j = 0 ;j<limitTrack;j++){
          let track = tracks[j]
          html+=`
            <li class="list-group-item" style="border: none">
                <p>${j+1}. ${track.name}</p>
            </li>

`
        }
        html+=`</ul></li>`
      }
      $('#spotifyListAlbum').html(html)
    })
    .catch((err)=>{
      console.log(err)
      $('#spotifyList').hide()
    })
}