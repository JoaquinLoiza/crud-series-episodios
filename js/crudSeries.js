'use strict'

const url = "https://6733aeb0a042ab85d117a8d6.mockapi.io/api/v1/series";

window.addEventListener('DOMContentLoaded', async () => {

    try {
        const data = await getWithFetch();
        showSerieInTables(data);
    } catch (err) {
        console.error(err);
    }

    /*
    data.then( response => {
        showSerieInTables(response);
    }).catch(err => {
        console.error(err);
    })
    */

});

const formCreate = document.getElementById('formCreate');

formCreate.addEventListener('submit', createSerie);


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
}

function showSerieInTables(data) {

    const tbobySeries = document.getElementById('tbodySeries');

    tbobySeries.innerHTML = '';

    for (const serie of data) {

        tbobySeries.innerHTML +=
         `<tr>
            <th scope="row">${ serie.idSeries }</th>
            <td>${ serie.titulo }</td>
            <td>${ serie.creador }</td>
            <td>${ serie.generos }</td>
            <td>${ serie.cantidadTemporadas }</td>
            <td>${ serie.edadRecomendada }</td>
            <td>${ serie.fechaLanzamiento }</td>
            <td class="truncate-column">${ serie.sinopsis }</td>
            <td>
                <button  id="${serie.idSeries}" class="btn btn-edit btn-warning"> 
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
}

function addButtonEvents() {

    const editButtons = document.querySelectorAll('#tbodySeries .btn-edit');
    const deleteButtons = document.querySelectorAll('#tbodySeries .btn-delete');

    for (const button of editButtons) {
        button.addEventListener('click', () => {
            const idSerie = button.id;
            //TODO editar serie.
        });
    }

    for (const button of deleteButtons) {
        button.addEventListener('click', () => {
            const idSerie = button.id;
            deleteWithFetch(idSerie);
        }, { once: true });
    }

}

//----- operaciones fetch ------

function postWithFetch(serie) {

    const opciones = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(serie)
    }

    fetch(url, opciones)
        .then(response => {
            if (response.ok) {
                console.log("Serie creada con exito");
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
        }
    })
    .catch( err => {
        console.error(err);
    });
}
