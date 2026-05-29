document.addEventListener("DOMContentLoaded", function (){

    caricaCuccePerAllarmi();
});

function caricaCuccePerAllarmi(){
    const URL = "https://scuolaapi.altervista.org/api/get_cucce.php";
    

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
            generaAllarmi(risposta.data);
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

function generaAllarmi(cucce){
    const contenitore = document.getElementById("lista-allarmi");

    contenitore.innerHTML = "";
    let allarmi = [];

    cucce.forEach(cuccia => {
        if(cuccia.temperatura !== null && cuccia.temperatura >= 30) {
            allarmi.push({
                id_cuccia: cuccia.id,
                nome: cuccia.nome,
                zona: cuccia.zona,
                tipo: "Temperatura alta",
                descrizione: "Temperatura rilevata: "+ cuccia.temperatura+" °C",
                classe: "warning",
                icona: "<i class='fa-solid fa-temperature-high'></i>"
            });
        }


        if(cuccia.stato_animale == 1) {
            allarmi.push({
                id_cuccia: cuccia.id,
                nome: cuccia.nome,
                zona: cuccia.zona,
                tipo: "Animale presente",
                descrizione: "La cuccia risulta occupata",
                classe: "danger",
                icona: "<i class='fa-solid fa-paw'></i>"
            });
        }

        if(cuccia.attiva == 0) {
            allarmi.push({
                id_cuccia: cuccia.id,
                nome: cuccia.nome,
                zona: cuccia.zona,
                tipo: "Cuccia disattivata",
                descrizione: "La cuccia non è attiva",
                classe: "dark",
                icona: "<i class='fa-solid fa-ban'></i>"
            });
        }

        if(aggiornamentoVecchio(cuccia.ultimo_aggiornamento)) {
            allarmi.push({
                id_cuccia: cuccia.id,
                nome: cuccia.nome,
                zona: cuccia.zona,
                tipo: "Mancato aggiornamento",
                descrizione: "La cuccia non invia dati da troppo tempo",
                classe: "danger-subtle",
                icona: "<i class='fa-solid fa-stopwatch'></i>"
            });
        }
    });

    mostraAllarmi(allarmi);   

}

function aggiornamentoVecchio(dataAggiornamento) {
    if(!dataAggiornamento) {
        return true;
    }

    const data = new Date(dataAggiornamento.replace(" ", "T"));
    const adesso = new Date();

    const differenzaMillisecondi = adesso-data;
    const differenzaMinuti = differenzaMillisecondi/1000/60;

    if(differenzaMinuti > 30){
        return true;
    }
    
    return false;
}

function mostraAllarmi(allarmi) {

    const contenitore = document.getElementById("lista-allarmi");
    
    if (allarmi.length === 0) {
    contenitore.innerHTML = `
    <div class="col-12">
    <div class="alert alert-success">
    Nessun allarme attivo
    </div>
    </div>
    `;
    return;
    }
    
    allarmi.forEach(function(allarme) {
    
    contenitore.innerHTML += `
    <div class="col-md-6 col-xl-4">
    
    <div class="card card-custom border-${allarme.classe} border-5 h-100">
    
    <div class="card-body">
    
    <div class="d-flex justify-content-between align-items-start mb-3">
    
    <div>
    <h5 class="card-title">
    ${allarme.icona} ${allarme.tipo}
    </h5>
    
    <p class="text-muted mb-0">
    ${allarme.nome}
    </p>
    
    <small class="text-muted">
    ${allarme.zona}
    </small>
    </div>
    
    <span class="badge bg-${allarme.classe}">
    ALLARME
    </span>
    
    </div>
    
    <p>
    ${allarme.descrizione}
    </p>
    
    <a
    href="cuccia.html?id=${allarme.id_cuccia}"
    class="btn btn-outline-secondary btn-sm w-100">
    
    Vai al dettaglio
    
    </a>
    
    </div>
    
    </div>
    
    </div>
    `;
    
    });
    
    }
    
    function mostraErrore(messaggio) {
    
    const contenitore = document.getElementById("messaggio-allarmi");
    
    contenitore.innerHTML = `
    <div class="alert alert-danger">
    ${messaggio}
    </div>
    `;
    
    } 
    

