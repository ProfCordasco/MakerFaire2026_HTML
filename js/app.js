const API_URL = "";

const utenteLoggato = localStorage.getItem("utenteLoggato");
const session_Id = localStorage.getItem("session_id");
const nome_utente = localStorage.getItem("nome_utente");

if(!utenteLoggato || !session_Id){
    window.location.href = "../MakerFaire2026_HTML/login.html";
}
else {
    document.getElementById("nome_utente").innerHTML = nome_utente;
}

function getJSON(file) {
    return fetch(API_URL+ file)
    .then(function(response){

        if(!response.ok) {
            console.log(response);
        }

        return response.json();
    });
}


function logout() {
  
    const sessionId = localStorage.getItem("session_id");
  
    const URL = "https://scuolaapi.altervista.org/api/logout.php";
    //const URL = "https://scuolaapi.altervista.org/api/logout.php";
  
  
    fetch(URL, {
      method: "POST",
      headers: {
        "X-Session-Id": sessionId
      }
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(risposta) {
  
        console.log(risposta);
  
        // Pulizia localStorage
        localStorage.removeItem("utenteLoggato");
        localStorage.removeItem("session_id");
        localStorage.removeItem("nome_utente");
  
        // Redirect login
        window.location.href = "login.html";
  
      })
      .catch(function(errore) {
  
        console.log("Errore logout:", errore);
  
        // Anche in caso di errore:
        // eliminiamo comunque i dati locali
  
        localStorage.removeItem("utenteLoggato");
        localStorage.removeItem("session_id");
        localStorage.removeItem("nome_utente");
  
        window.location.href = "login.html";
  
      });
  
  }
  
