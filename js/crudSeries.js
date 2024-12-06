'use strict'

const url = "https://6733aeb0a042ab85d117a8d6.mockapi.io/api/v1/series";

window.addEventListener('DOMContentLoaded', () => showSerieInTables());

const formCreate = document.getElementById('formCreate');
const formEdit = document.getElementById('formEdit');

formCreate.addEventListener('submit', createSerie);
formEdit.addEventListener('submit', editSerie);

function createSerie(evento) {

    evento.preventDefault();

    const formData = new FormData(formCreate);

    //separa por ',' y devuelve un array
    const generos = formData.get('genero').split(',')
        .map(genero => genero.trim()); //elimina los espacios vacios

    //Esquema de 'serie'
    const serie = {
        titulo: formData.get('titulo'),
        creador: formData.get('creador'),
        generos: generos,
        cantidadTemporadas: formData.get('temporadas'),
        edadRecomendada: formData.get('edadRecomendada'),
        fechaLanzamiento: formData.get('fechaLanzamiento'),
        sinopsis: formData.get('sinopsis')
    }

    formCreate.reset();

    postWithFetch(serie);

    // Cerrar modal
    let modalCreateSerie = document.getElementById('modalCreateSerie');
    let instaciaModalCreate= bootstrap.Modal.getInstance(modalCreateSerie);
    instaciaModalCreate.hide();
}

function editSerie(evento) {

    evento.preventDefault();

    const formData = new FormData(formEdit);

    //separa por ',' y devuelve un array
    const generos = formData.get('genero').split(',')
        .map(genero => genero.trim()); //elimina los espacios vacios

    const idSerie = formData.get('idSerie');

    //Esquema de 'serie'
    const serie = {
        titulo: formData.get('titulo'),
        creador: formData.get('creador'),
        generos: generos,
        cantidadTemporadas: formData.get('temporadas'),
        edadRecomendada: formData.get('edadRecomendada'),
        fechaLanzamiento: formData.get('fechaLanzamiento'),
        sinopsis: formData.get('sinopsis')
    }

    formEdit.reset();

    console.log(idSerie);

    editWithFetch( idSerie, serie );

    //Cerrar el modal
    let modalEditSerie = document.getElementById('modalEditSerie');

    let instaciaModalEdit = bootstrap.Modal.getInstance(modalEditSerie);

    instaciaModalEdit.hide();

}

async function showSerieInTables() {

    let data;

    try {
        data = await getWithFetch();
    } catch (err) {
        console.error(err);
    }

    const tbobySeries = document.getElementById('tbodySeries');

    tbobySeries.innerHTML = '';

    if(!data) {
        return;
    }

    for (const serie of data) {

        tbobySeries.innerHTML +=
         `<tr class="align-baseline">
            <th scope="row">${ serie.idSeries }</th>
            <td>${ serie.titulo }</td>
            <td>${ serie.creador }</td>
            <td class="truncate-column">${ serie.generos }</td>
            <td class="text-center">${ serie.cantidadTemporadas }</td>
            <td class="text-center">${ serie.edadRecomendada }</td>
            <td class="text-center">${ serie.fechaLanzamiento }</td>
            <td class="truncate-column">${ serie.sinopsis }</td>
            <td>
                <button  id="${serie.idSeries}" class="btn btn-edit btn-warning" data-bs-toggle="modal" data-bs-target="#modalEditSerie"> 
                    <i class="bi bi-pencil"></i>
                </button>
            </td>
            <td>
                <button id="${serie.idSeries}" class="btn btn-delete btn-danger"> 
                    <i class="bi bi-trash"></i> 
                </button>
            </td>
        </tr>`;
    }

    addButtonEvents();
    addRowEvents();
}

async function loadInputsFormEdit(idSerie) {

    let serie;

    try {
        serie = await getByIdWithFetch(idSerie);
    } catch(err) {
        console.error(err);
    }

    formEdit.elements['idSerie'].value = serie.idSeries;
    formEdit.elements['titulo'].value = serie.titulo;
    formEdit.elements['creador'].value = serie.creador;
    formEdit.elements['genero'].value = serie.generos;
    formEdit.elements['temporadas'].value = serie.cantidadTemporadas;
    formEdit.elements['edadRecomendada'].value = serie.edadRecomendada;
    formEdit.elements['fechaLanzamiento'].value = serie.fechaLanzamiento;
    formEdit.elements['sinopsis'].value = serie.sinopsis;

}

function addButtonEvents() {

    const editButtons = document.querySelectorAll('#tbodySeries .btn-edit');
    const deleteButtons = document.querySelectorAll('#tbodySeries .btn-delete');

    for (const button of editButtons) {
        button.addEventListener('click', () => {
            const idSerie = button.id;
            loadInputsFormEdit(idSerie);
        });
    }

    for (const button of deleteButtons) {
        button.addEventListener('click', () => {
            const idSerie = button.id;
            deleteWithFetch(idSerie);
        }, { once: true });
    }

}

function addRowEvents() {

    const rowsTable = document.querySelectorAll('#tbodySeries tr');

    for (const row of rowsTable) {
        
        row.addEventListener('click',(evento) => {

            const idSerie = row.firstElementChild.textContent;

            //Si el click no es en un botton, redirecciona.
            if( !evento.target.closest('button')) {
                window.location.href = `episodiosSerie.html?idSerie=${idSerie}`;
            }
        });
    }
}

//----- operaciones fetch ------

function postWithFetch(serie) {

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(serie)
    }).then(response => {
        if (response.ok) {
            console.log("Serie creada con exito");
            showSerieInTables();
        }
    })
    .catch(err => {
        console.error(err);
    });
}

async function getWithFetch() {
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

function deleteWithFetch( idSerie ) {

    const opciones = {
        method: "DELETE"
    }

    fetch(url + "/" + idSerie, opciones)
    .then( response => {
        if(response.ok) {
            console.log("Eliminado con exito");
            showSerieInTables();
        }
    })
    .catch( err => {
        console.error(err);
    });
}

async function getByIdWithFetch( idSerie ) {

    return fetch(url + "/" + idSerie)
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

function editWithFetch(idSerie, serie) {

    fetch(url + "/" + idSerie, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(serie)
    }).then(response => {
        if (response.ok) {
            console.log("Serie editada con exito");
            showSerieInTables();
        }
    })
    .catch(err => {
        console.error(err);
    });

}