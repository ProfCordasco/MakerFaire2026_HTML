let mappa;
let marker;

document.addEventListener("DOMContentLoaded", function () {

  inizializzaMappa();

  const form = document.getElementById("form-cuccia");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    salvaNuovaCuccia();
  });

});

function salvaNuovaCuccia() {
  const URL = "https://scuolaapi.altervista.org/api/add_cuccia.php";
  //const URL = "https://scuolaapi.altervista.org/api/add_cuccia.php";
  
  const sessionId = localStorage.getItem("session_id");

  const dati = {
    nome: document.getElementById("nome").value,
    zona: document.getElementById("zona").value,
    latitudine: parseFloat(document.getElementById("latitudine").value),
    longitudine: parseFloat(document.getElementById("longitudine").value)
  };

  fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Session-Id": sessionId
    },
    body: JSON.stringify(dati)
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(risposta) {

      console.log(risposta);

      if (risposta.success === true) {

        mostraMessaggio("Cuccia inserita correttamente", "success");

        setTimeout(function () {
          window.location.href = "dashboard.html";
        }, 1000);

      } else {

        mostraMessaggio(risposta.errore, "danger");

      }

    })
    .catch(function(errore) {

      console.log("Errore:", errore);
      mostraMessaggio("Errore durante il salvataggio", "danger");

    });

}

function inizializzaMappa() {

  const latitudineIniziale = 41.0847420;
  const longitudineIniziale = 16.7826930;

  mappa = L.map("mappa-selezione").setView(
    [latitudineIniziale, longitudineIniziale],
    13
  );

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution: "© OpenStreetMap"
    }
  ).addTo(mappa);

  mappa.on("click", function(evento) {

    const latitudine = evento.latlng.lat.toFixed(7);
    const longitudine = evento.latlng.lng.toFixed(7);

    impostaCoordinate(latitudine, longitudine);

  });

  setTimeout(function () {
    mappa.invalidateSize();
  }, 100);

}

function impostaCoordinate(latitudine, longitudine) {

  document.getElementById("latitudine").value = latitudine;
  document.getElementById("longitudine").value = longitudine;

  if (marker) {
    mappa.removeLayer(marker);
  }

  marker = L.marker(
    [latitudine, longitudine],
    {
      draggable: true
    }
  ).addTo(mappa);

  marker.on("dragend", function(evento) {

    const posizione = evento.target.getLatLng();

    document.getElementById("latitudine").value = posizione.lat.toFixed(7);
    document.getElementById("longitudine").value = posizione.lng.toFixed(7);

  });

}

function mostraMessaggio(testo, tipo) {

  document.getElementById("messaggio").innerHTML = `
    <div class="alert alert-${tipo}">
      ${testo}
    </div>
  `;

}
