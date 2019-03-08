function getArtistEvents(artist) {
    $('#loadingGif').show()
    server({
        url: `/events/look-for-events/${artist}`,
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