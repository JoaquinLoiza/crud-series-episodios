'use strict'

const formCreate = document.getElementById('formCreate');

formCreate.addEventListener('submit', createSerie);

function createSerie(evento) {

    evento.preventDefault();

    const formData = new FormData( formCreate );

    //separa por ',' y devuelve un array
    const generos = formData.get('genero').split(',')
    .map( genero => genero.trim() ); //elimina los espacios vacios

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

    console.log(serie);

    formCreate.reset();

    const url = "https://6733aeb0a042ab85d117a8d6.mockapi.io/api/v1/series"
}
