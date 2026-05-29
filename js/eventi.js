document.addEventListener("DOMContentLoaded", function (){
    caricaEventi();
});

function caricaEventi(){
    const URL = "https://scuolaapi.altervista.org/api/get_eventi.php";
    //const URL = "https://scuolaapi.altervista.org/api/get_eventi.php";

    const sessionId = localStorage.getItem("session_id");

    fetch(URL, {
        method: "GET",
        headers: {
            "X-Session-Id": sessionId
        }
    })
    .then(function(risposta) {
        return risposta.json();
        console.log(cucce);
      mostraCucce(cucce);
    })
    .then(function(risposta){
        if(risposta.success == true) {
            mostraEventi(risposta.data);
        }
        else {
            mostraErrore(risposta.message);
        }
    })
    .catch(function (errore){
        console.log("errore", errore);
        mostraErrore(risposta.message);
    })
}

function mostraEventi(eventi){
    const tabella = document.getElementById("tabella-eventi");

    tabella.innerHTML="";

    if(eventi.length === 0){
        tabella.innerHTML=`
        <tr>
            <td colspan="4" class="text-center text-muted">
                Nessun evento registrato
            </td>
        </tr>
        `;

        return;
    }


    eventi.forEach(evento => {
        const badge = creaBadgeEvento(evento.tipo_evento);

        tabella.innerHTML += `
            <tr>
                <td>${evento.id}</td>
                <td>${evento.nome_cuccia}</td>
                <td>${badge}</td>
                <td>${evento.data_evento}</td>
            </tr>
        `;

    });
}

function creaBadgeEvento(tipo_evento){
    if(tipo_evento === "Animale rilevato"){
        return `<span class="badge bg-info">${tipo_evento}</span>`;
    }

    if(tipo_evento === "Porta aperta"){
        return `<span class="badge bg-success">${tipo_evento}</span>`;
    }

    if(tipo_evento === "Porta chiusa"){
        return `<span class="badge bg-danger">${tipo_evento}</span>`;
    }

    if(tipo_evento === "Temperatura alta"){
        return `<span class="badge bg-warning">${tipo_evento}</span>`;
    }

    if(tipo_evento === "Batteria bassa"){
        return `<span class="badge bg-secondary">${tipo_evento}</span>`;
    }

    if(tipo_evento === "Errore"){
        return `<span class="badge bg-dark">${tipo_evento}</span>`;
    }

    return`<span class="badge bg-light text-dark">${tipo_evento}</span>`;
}

function mostraErrore(messaggio) {
    const contenitore = document.getElementById("messaggio-eventi");
    contenitore.innerHTML = `
        <div class="alert alert-danger">
            ${messaggio}
        </div>
    `;
}