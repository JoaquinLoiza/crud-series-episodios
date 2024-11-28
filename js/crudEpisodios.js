'use strict'

let url = "https://6733aeb0a042ab85d117a8d6.mockapi.io/api/v1/series";

//recuperar el idSerie desde la url actual
window.addEventListener('DOMContentLoaded', () => {
    setUrlByIdSerie();
    getAllSerie();
});

const formCreate = document.getElementById('formCreate');
//const formEdit = document.getElementById('formEdit');

formCreate.addEventListener('submit', createEpisode);
//formEdit.addEventListener('submit', editEpisode);

function setUrlByIdSerie() {
    // Busca todos los parametros y los devuelve como una cadena de texto
    const queryString = window.location.search;

    // Crea un objeto URLSearchParams y le pasa la cadena de parametros
    const urlParams = new URLSearchParams(queryString);
    
    // Obtiene el valor del parametro idSerie
    const idSerie = urlParams.get('idSerie');

    url += `/${idSerie}`;
}

function getAllSerie() {

    //Traer la informacion de la serie
    showSerieInfo();

    //Traer el listado de episodios

}

function createEpisode(evento) {
    
    evento.preventDefault();

    const formData = new FormData(formCreate);

    //Esquema de 'episodio'
    const episodio = {
        titulo: formData.get('titulo'),
        caratula: formData.get('picture'),
        numeroEpisodio: formData.get('numberEpisode'),
        duracion: formData.get('duration'),
        sinopsis: formData.get('sinopsis')
    }

    formCreate.reset();

    postWithFetch(episodio);

    // Cerrar modal
    let modalCreateEpisode = document.getElementById('modalCreateEpisode');
    let instaciaModalCreate= bootstrap.Modal.getInstance(modalCreateEpisode);
    instaciaModalCreate.hide();
}

async function showSerieInfo(){

    let data;

    try {
        data = await getSerieWithFetch();
    } catch (err) {
        console.error(err);
    }

    const containerSerie = document.getElementById('containerInfoSerie');

    containerSerie.innerHTML = 
    `
    <h1>${data.titulo}</h1>
    <p>Author: ${data.creador}  |  Fecha estreno: ${data.fechaLanzamiento}</p>
    <p>Cantidad de temporadas: ${data.cantidadTemporadas}</p>
    <p class="fs-5">Edad recomendada <span class="badge text-bg-warning">+${data.edadRecomendada}</span></p>
    <p> <span class="badge text-bg-light">${data.generos}</span> </p>
    <p>${data.sinopsis}</p>
    `
}

//----- operaciones fetch ------

async function getSerieWithFetch() {
    return fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
    })
    .then(data => {
        return data;
    })
    .catch(err => {
        console.error(err);
    });
}

function postWithFetch(episode) {

    fetch(url + "/episodios", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(episode)
    }).then(response => {
        if (response.ok) {
            console.log("Episodio creado con exito");
            //showSerieInTables();
        }
    })
    .catch(err => {
        console.error(err);
    });
}