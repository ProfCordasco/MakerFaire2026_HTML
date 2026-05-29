document.addEventListener("DOMContentLoaded", function (){
    const formLogin = document.getElementById("form-login");

    formLogin.addEventListener("submit", function(event){
        event.preventDefault();
        effettuaLogin();
    });
});


function effettuaLogin(){
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const URL = "https://scuolaapi.altervista.org/api/login.php";
    //const URL = "https://scuolaapi.altervista.org/api/login.php";


    fetch(URL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: CryptoJS.MD5(password).toString()
        })
    })
    .then(function(response){
        return response.json();
    })
    .then(function(risposta){
        console.log(risposta);

        if(risposta.success === true) {
            localStorage.setItem("utenteLoggato", true);
            localStorage.setItem("session_id", risposta.data.session_id);
            localStorage.setItem("nome_utente", risposta.data.nome);

            window.location.href = "dashboard.html";
        }
        else{
            mostraErrore(risposta.message);
        }
    });

}

function mostraErrore(messaggio) {
    const contenitore = document.getElementById("messaggio-login");
    contenitore.innerHTML = `
        <div class="alert alert-danger">
            ${messaggio}
        </div>
    `;
}

