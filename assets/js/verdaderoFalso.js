// main.js

import { siguientePregunta, mostrarPuntaje } from './main.js';

let preguntaActual = null;

export const inicializarVerdaderoFalso = (pregunta) => {
    const contenedorPregunta = document.getElementById('question-container');
    preguntaActual = pregunta;

    const preguntaHTML = `
        <div class="verdadero-falso-container">
            <h2 class="tema-titulo">Verdadero o Falso</h2>
            <div class="pregunta-texto">${pregunta.pregunta}</div>
            <div class="opciones-container">
                <button class="opcion-btn verdadero" onclick="verificarRespuestaVerdaderoFalso(true)">Verdadero</button>
                <button class="opcion-btn falso" onclick="verificarRespuestaVerdaderoFalso(false)">Falso</button>
            </div>
            <div id="resultado" class="resultado"></div>
            <div id="informacion" class="informacion-complementaria"></div>
        </div>
    `;
    contenedorPregunta.innerHTML = preguntaHTML;
}

window.verificarRespuestaVerdaderoFalso = (respuestaSeleccionada) => {
    if (!preguntaActual) return;

    const resultadoDiv = document.getElementById('resultado');
    const informacionDiv = document.getElementById('informacion');
    const botones = document.querySelectorAll('.opcion-btn');

    botones.forEach(boton => boton.disabled = true);

    const esCorrecta = respuestaSeleccionada === preguntaActual.respuestaCorrecta;

    resultadoDiv.innerHTML = `
        <div class="resultado ${esCorrecta ? 'correcto' : 'incorrecto'}">
            ${esCorrecta ? '¡Correcto!' : 'Incorrecto'}
        </div>
    `;

    informacionDiv.innerHTML = `
        <div class="informacion-complementaria">
            ${preguntaActual.informacionComplementaria}
        </div>
    `;

    if (esCorrecta) {
        mostrarPuntaje();
    }

    document.getElementById('next-button').style.display = 'block';
    document.getElementById('next-button').onclick = siguientePregunta;
}
