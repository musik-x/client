function getArtistEvents(artist) {
    $('#loadingGif1').show()
    server({
        url: `/events/look-for-events/${artist}`,
        method: 'get',
        headers: {
            access_token: localStorage.getItem('token')
        }
    })
    .then(({data}) => {
        $('#artist-news').empty()
        $('#artist-event-list').empty()
        $('#artist-news').hide()
        $('#artist-event-list').show()
        console.log(data[0])
        $(data).ready($('#loadingGif1').hide())
        data.forEach(e => {        
            $('#artist-event-list').append(`
                <li>${e.displayName}</li>
            `)
        });
        console.log(data)
    })
    .catch(err => {
        console.log(err)
    })
}

function getEventDetail(id) {
    $('#loadingGif').show()
    server({
        url: `/events/details/${id}`,
        method: 'get',
        headers: {
            access_token: localStorage.getItem('token')
        }
    })
    .then(({data}) => {
        $(data).ready($('#loadingGif').hide())
        console.log(data)
    })
    .catch(err => {
        console.log(err)
    })
}

function getUpcomingEvents(artist) {
    $('#loadingGif').show()
    server({
        url: `/events/upcoming-events/${artist}`,
        method: 'get',
        headers: {
            access_token: localStorage.getItem('token')
        }
    })
    .then(({data}) => {
        $(data).ready($('#loadingGif').hide())
        console.log(data)
    })
    .catch(err => {
        console.log(err)
    })
}

function getNews(artist) {
    $('#loadingGif2').show()
    server({
        url: `/news/${artist}`,
        method: 'get'
    })
    .then(({data}) => {
        console.log(data)
        $('#artist-event-list').empty()
        $('#artist-news').empty()
        $('#artist-news').show()
        $('#artist-event-list').hide()
        $(data).ready($('#loadingGif2').hide())
        data.forEach(e => {        
            $('#artist-news').append(`
              <ul>
                <li>${e.webTitle} || <a href=${e.webUrl}>${e.webTitle}</a></li>
              </ul>
            `)
        });
    })
    .catch(err => {
        console.log(err)
    })
}