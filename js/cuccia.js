let mappa = null;
let marker = null;
let timerAggiornamento = null;

document.addEventListener("DOMContentLoaded", function () {

    const parametri = new URLSearchParams(window.location.search);
    const idCuccia = parametri.get("id");

    document.getElementById("linkModifica").href =
        "modifica_cuccia.html?id=" + idCuccia;

    caricaCuccia(idCuccia, true);

    timerAggiornamento = setInterval(function () {
        caricaCuccia(idCuccia, false);
    }, 3000);

});

function caricaCuccia(id, primaVolta) {

    const URL =
        "https://scuolaapi.altervista.org/api/get_cuccia.php?id=" + id;

    const sessionId = localStorage.getItem("session_id");

    fetch(URL, {
        method: "GET",
        headers: {
            "X-Session-Id": sessionId
        }
    })
        .then(function (risposta) {
            return risposta.json();
        })
        .then(function (risposta) {

            console.log(risposta);

            if (risposta.success == true) {

                if (primaVolta == true) {
                    mostraCuccia(risposta.data);
                } else {
                    aggiornaDatiCuccia(risposta.data);
                }

            } else {

                document.getElementById("dettaglio-cuccia").innerHTML = `
                    <div class="alert alert-danger">
                        Cuccia non trovata
                    </div>
                `;

            }

        })
        .catch(function (errore) {
            console.log("Errore:", errore);
        });

}

function mostraCuccia(cuccia) {

    const contenitore = document.getElementById("dettaglio-cuccia");

    let testoAnimale = "LIBERA";
    let classeBadge = "badge-libera";

    if (cuccia.stato_animale == 1) {
        testoAnimale = "OCCUPATA";
        classeBadge = "badge-occupata";
    }

    let statoPorta = "APERTA";

    if (cuccia.stato_porta == 1) {
        statoPorta = "CHIUSA";
    }

    const umidita = cuccia.umidita ?? "-";
    const temperatura = cuccia.temperatura ?? "-";
    const ultimoAggiornamento = cuccia.ultimo_aggiornamento ?? "-";
    const iconaPorta = cuccia.stato_porta == 0 ? "open" : "closed";

    contenitore.innerHTML = `

        <div class="mb-3">

            <a href="dashboard.html" class="btn btn-outline-secondary">
                ← Torna alla dashboard
            </a>

        </div>

        <div class="card card-custom">

            <div class="card-body">

                <div class="d-flex justify-content-between align-items-start mb-4">

                    <div>

                        <h2 class="card-title">
                            ${cuccia.nome}
                        </h2>

                        <p class="text-muted">
                            ${cuccia.zona}
                        </p>

                    </div>

                    <span
                        id="badgeAnimale"
                        class="cuccia-badge badge ${classeBadge}">

                        ${testoAnimale}

                    </span>

                </div>

                <div class="row g-3 align-items-stretch">

                    <div class="col-md-6">

                        <div class="border rounded p-3 h-100">

                            <h6>
                                <i class="fa-solid fa-temperature-empty"></i>
                                Temperatura
                            </h6>

                            <h3 id="temperatura">
                                ${temperatura} °C
                            </h3>

                        </div>

                    </div>

                    <div class="col-md-6">

                        <div class="border rounded p-3 h-100">

                            <h6>
                                <i class="fa-solid fa-droplet"></i>
                                Umidità
                            </h6>

                            <h3 id="umidita">
                                ${umidita} %
                            </h3>

                        </div>

                    </div>

                    <div class="col-md-6">

                        <div class="border rounded p-3 h-100">

                            <h6>
                                <i id="iconaPorta" class="fa-solid fa-door-${iconaPorta}"></i>
                                Stato porta
                            </h6>

                            <h3 id="statoPorta">
                                ${statoPorta}
                            </h3>

                        </div>

                    </div>

                    <div class="col-md-6">

                        <div class="border rounded p-3 h-100">

                            <h6>
                                <i class="fa-regular fa-clock"></i>
                                Ultimo aggiornamento
                            </h6>

                            <p id="ultimoAggiornamento" class="mb-0">
                                ${ultimoAggiornamento}
                            </p>

                        </div>

                    </div>

                </div>

                <div class="mt-4">

                    <h5>Posizione cuccia</h5>

                    <div id="mappa-cuccia"></div>

                </div>

                <div class="mt-4 d-flex gap-2">

                    <button
                        class="btn btn-success"
                        onclick="apriPorta(${cuccia.id})">

                        Apri porta

                    </button>

                    <button
                        class="btn btn-danger"
                        onclick="chiudiPorta(${cuccia.id})">

                        Chiudi porta

                    </button>

                </div>

            </div>

        </div>

    `;

    creaMappaCuccia(cuccia);

}

function aggiornaDatiCuccia(cuccia) {

    const temperatura = cuccia.temperatura ?? "-";
    const umidita = cuccia.umidita ?? "-";
    const ultimoAggiornamento = cuccia.ultimo_aggiornamento ?? "-";

    document.getElementById("temperatura").innerHTML =
        temperatura + " °C";

    document.getElementById("umidita").innerHTML =
        umidita + " %";

    document.getElementById("ultimoAggiornamento").innerHTML =
        ultimoAggiornamento;

    let statoPorta = "APERTA";

    if (cuccia.stato_porta == 1) {
        statoPorta = "CHIUSA";
    }

    document.getElementById("statoPorta").innerHTML =
        statoPorta;

    const iconaPorta = document.getElementById("iconaPorta");

    if (iconaPorta) {

        iconaPorta.classList.remove("fa-door-open");
        iconaPorta.classList.remove("fa-door-closed");

        if (cuccia.stato_porta == 1) {
            iconaPorta.classList.add("fa-door-closed");
        } else {
            iconaPorta.classList.add("fa-door-open");
        }

    }

    const badge = document.getElementById("badgeAnimale");

    if (cuccia.stato_animale == 1) {

        badge.innerHTML = "OCCUPATA";

        badge.classList.remove("badge-libera");
        badge.classList.add("badge-occupata");

    } else {

        badge.innerHTML = "LIBERA";

        badge.classList.remove("badge-occupata");
        badge.classList.add("badge-libera");

    }

    aggiornaMappaCuccia(cuccia);

}

function creaMappaCuccia(cuccia) {

    if (!cuccia.latitudine || !cuccia.longitudine) {
        return;
    }

    const latitudine = parseFloat(cuccia.latitudine);
    const longitudine = parseFloat(cuccia.longitudine);

    mappa = L.map("mappa-cuccia").setView(
        [latitudine, longitudine],
        15
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap"
    }).addTo(mappa);

    marker = L.marker([latitudine, longitudine])
        .addTo(mappa)
        .bindPopup(cuccia.nome)
        .openPopup();

    setTimeout(function () {
        mappa.invalidateSize();
    }, 300);

}

function aggiornaMappaCuccia(cuccia) {

    if (!mappa || !marker) {
        return;
    }

    if (!cuccia.latitudine || !cuccia.longitudine) {
        return;
    }

    const latitudine = parseFloat(cuccia.latitudine);
    const longitudine = parseFloat(cuccia.longitudine);

    marker.setLatLng([latitudine, longitudine]);

}

function apriPorta(id) {
    chiamaComandoPorta(id, 0);
}

function chiudiPorta(id) {
    chiamaComandoPorta(id, 1);
}

function chiamaComandoPorta(id, statoPorta) {

    const URL = "https://scuolaapi.altervista.org/BCK/comando_porta.php";
    const sessionId = localStorage.getItem("session_id");

    fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Session-Id": sessionId
        },
        body: JSON.stringify({
            id_cuccia: id,
            stato_porta: statoPorta
        })
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (risposta) {

            console.log(risposta);

            if (risposta.success === true) {

                alert("Comando eseguito correttamente");

                caricaCuccia(id, false);

            } else {

                alert(risposta.message || risposta.errore);

            }

        })
        .catch(function (errore) {

            console.log("Errore: " + errore);
            alert("Errore durante l'invio del comando");

        });

}