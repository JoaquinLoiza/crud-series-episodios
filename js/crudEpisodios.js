'use strict'

let url = "https://6733aeb0a042ab85d117a8d6.mockapi.io/api/v1/series";

//recuperar el idSerie desde la url actual
window.addEventListener('DOMContentLoaded', () => {
    setUrlByIdSerie();
    getAllSerie();
});

const formCreate = document.getElementById('formCreate');
const formEdit = document.getElementById('formEdit');

formCreate.addEventListener('submit', createEpisode);
formEdit.addEventListener('submit', editEpisode);

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
    showEpisodesInTables();
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

function editEpisode(evento) {

    evento.preventDefault();

    const formData = new FormData(formEdit);

    const idEpisode = formData.get('idEpisode');

    //Esquema de 'episodio'
    const episode = {
        titulo: formData.get('titulo'),
        caratula: formData.get('picture'),
        numeroEpisodio: formData.get('numeroEpisodio'),
        duracion: formData.get('duracion'),
        sinopsis: formData.get('sinopsis')
    }

    formEdit.reset();

    editWithFetch( idEpisode, episode);

    //Cerrar el modal
    let modalEditEpisode = document.getElementById('modalEditEpisode');

    let instaciaModalEdit = bootstrap.Modal.getInstance(modalEditEpisode);

    instaciaModalEdit.hide();

}

async function showSerieInfo(){

    let data;

    try {
        data = await getSerieWithFetch();
    } catch (err) {
        console.error(err);
    }

    const containerSerie = document.getElementById('containerInfoSerie');

    const releaseDate = new Date(data.fechaLanzamiento).toLocaleDateString('es-AR');

    containerSerie.innerHTML = 
    `
    <h1>
        <strong>${data.titulo}</strong>
    </h1>
    <h2 class="fs-3 d-flex align-items-center column-gap-3">
        <strong>${data.creador}</strong> 
        <span class="badge text-bg-warning fs-6">+${data.edadRecomendada}</span>
    </h2>
    <p class="fs-6">
        Temporadas: ${data.cantidadTemporadas} <i class="bi bi-dot"></i> 
        Estreno: ${releaseDate}
    </p>
    <p> <span class="badge text-bg-primary">${data.generos}</span> </p>
    <p>${data.sinopsis}</p>
    `
}

async function showEpisodesInTables() {

    let data;

    try {
        data = await getWithFetch();
    } catch (err) {
        console.error(err);
    }
    
    const tbobyEpisodes = document.getElementById('tbodyEpisodes');
    
    tbobyEpisodes.innerHTML = '';
    
    if(!data) {
        return;
    }

    for (const episode of data) {

        tbobyEpisodes.innerHTML +=
         `<tr class="align-baseline">
            <th scope="row">${ episode.id }</th>
            <td>${ episode.titulo }</td>
            <td>${ episode.numeroEpisodio }</td>
            <td>${ episode.duracion }</td>
            <td class="truncate-column">${ episode.sinopsis }</td>
            <td>
                <button  id="${episode.id}" class="btn btn-edit btn-warning" data-bs-toggle="modal" data-bs-target="#modalEditEpisode"> 
                    <i class="bi bi-pencil"></i>
                </button>
            </td>
            <td>
                <button id="${episode.id}" class="btn btn-delete btn-danger"> 
                    <i class="bi bi-trash"></i> 
                </button>
            </td>
        </tr>`;
    }

    addButtonEvents();
    //addRowEvents();
}

async function loadInputsFormEdit(idEpisode) {

    let episode;

    try {
        episode = await getByIdWithFetch(idEpisode);
    } catch(err) {
        console.error(err);
    }

    formEdit.elements['idEpisode'].value = episode.id;
    formEdit.elements['titulo'].value = episode.titulo;
    formEdit.elements['picture'].value = episode.caratula;
    formEdit.elements['numeroEpisodio'].value = episode.numeroEpisodio;
    formEdit.elements['duracion'].value = episode.duracion;
    formEdit.elements['sinopsis'].value = episode.sinopsis;

}

function addButtonEvents() {

    const editButtons = document.querySelectorAll('#tbodyEpisodes .btn-edit');
    const deleteButtons = document.querySelectorAll('#tbodyEpisodes .btn-delete');

    for (const button of editButtons) {
        button.addEventListener('click', () => {
            const idEpisode = button.id;
            loadInputsFormEdit(idEpisode);
        });
    }

    for (const button of deleteButtons) {
        button.addEventListener('click', () => {
            const idEpisode = button.id;
            deleteWithFetch(idEpisode);
        }, { once: true });
    }

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

async function getWithFetch() {
    return fetch(url + "/episodios")
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
            showEpisodesInTables();
        }
    })
    .catch(err => {
        console.error(err);
    });
}

function deleteWithFetch( idEpisode ) {

    const opciones = {
        method: "DELETE"
    }

    fetch(url + "/episodios/" + idEpisode, opciones)
    .then( response => {
        if(response.ok) {
            console.log("Eliminado con exito");
            showEpisodesInTables();
        }
    })
    .catch( err => {
        console.error(err);
    });
}

async function getByIdWithFetch( idEpisode ) {

    return fetch(url + "/episodios/" + idEpisode)
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

function editWithFetch(idEpisode, episode) {

    fetch(url + "/episodios/" + idEpisode, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(episode)
    }).then(response => {
        if (response.ok) {
            console.log("Episodio editado con exito");
            showEpisodesInTables();
        }
    })
    .catch(err => {
        console.error(err);
    });

}