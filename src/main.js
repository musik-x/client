const server = axios.create({
    baseURL: 'http://localhost:3000'
})

$(function () {
  server.get('/api/spotify/')
    .then(({data})=>{
      let htmls = ''
      for (let i = 0;i<data.artists.length;i++){
        let item = data.artists[i]
        let id = item.id.replace(/\s+/gi, '')
        htmls+=`
          <div class='col-3 mb-3 card pt-2' onclick="pageArtist('${id}')">
            <img src="${item.images[0].url}" alt="${item.name}" class="card-img-top img-thumbnail" style="border: none;"/>
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
    })
})

if (!localStorage.getItem('token')) {
    noLogin()
} else {
    login()
}

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
      var html= `<div class="row"><a onclick="btnBack()" style="color: white;font-size: 18px">Back</a></div>`
      html += `<div class='pt-2 row mt-5'>
              <div class="col-4">
                  <img src="${artist.images[0].url}" alt="${artist.name}" class="card-img-top img-thumbnail"/>
              </div>
              <div class="card-body col-6">
                  <h3 class="card-title">${artist.name}</h3>
                  <p class="card-text">Follower: ${artist.followers.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</p>
                  <p class="card-text">Genre: ${artist.genres.join(', ')}</p>
              </div>
            
          </div>
        <ul id="spotifyListAlbum" class="list-group" style="width: 100%"></ul>`;
      $('#spotifyReadByArtist').html(html)
      html = '<h5>Albums</h5>'
      let albums = data.albums
      for (let i=0;i<albums.length;i++){
        let item = albums[i]
        html+=`
        <li class="list-group-item" style="width: 100%;border:none;">
            <img src="${item.images[0].url}" alt="${item.name}" style="width: 50px;height: 50px;border-radius: 50%;margin-top: -25px;">
            <div class="pl-4 pt-4" style="display: inline-block">
                <h6 >${item.name}</h6>
                <p>Total tracks : ${item.total_tracks}</p>
            </div>
        </li>
        `
      }
      $('#spotifyListAlbum').html(html)

      html = '<h5>Albums</h5>'

    })
    .catch((err)=>{
      console.log(err)
      $('#spotifyList').hide()
    })
}