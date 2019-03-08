const server = axios.create({
    baseURL: 'http://localhost:3000'
})

if (!localStorage.getItem('token')) {
    noLogin()
} else {
    login()
}

function login() {
    $('.usersLogin').show()
    $('.noLogin').hide()
}

function noLogin() {
    $('.usersLogin').hide()
    $('.noLogin').show()
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
        swal(`Welcome! ${profile.getName()}`, ``, "success");
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