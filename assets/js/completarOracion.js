import { siguientePregunta, mostrarPuntaje, registrarPreguntaFallada } from './main.js';

let preguntaActual = null;
let tipoPreguntaActual = null;

// Función para normalizar texto (eliminar acentos y convertir a minúsculas)
const normalizarTexto = (texto) => {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
};

export const inicializarCompletarOracion = (pregunta, tipo) => {
    if (!pregunta) {
        console.error('La pregunta es undefined');
        return;
    }

    const contenedorPregunta = document.getElementById('question-container');
    preguntaActual = pregunta;
    tipoPreguntaActual = tipo;

    const preguntaHTML = `
        <div class="completar-oracion-container">
            <h2 class="tema-titulo">Completar Oración</h2>
            <div class="pregunta-texto">${pregunta.oracion}</div>
            <div class="input-container">
                <input type="text" id="respuesta-input" class="respuesta-input" placeholder="Escribe tu respuesta">
                <button class="confirmar-btn" onclick="verificarRespuestaCompletarOracion()">Confirmar</button>
            </div>
            <div id="resultado" class="resultado"></div>
            <div id="informacion" class="informacion-complementaria"></div>
        </div>
    `;
    contenedorPregunta.innerHTML = preguntaHTML;
}

window.verificarRespuestaCompletarOracion = () => {
    if (!preguntaActual) return;

    const respuestaInput = document.getElementById('respuesta-input');
    const respuestaUsuario = respuestaInput.value;
    const respuestaNormalizada = normalizarTexto(respuestaUsuario);
    const respuestaCorrectaNormalizada = normalizarTexto(preguntaActual.respuestaCorrecta);
    const esCorrecta = respuestaNormalizada === respuestaCorrectaNormalizada;

    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `
        <div class="resultado ${esCorrecta ? 'correcto' : 'incorrecto'}">
            ${esCorrecta ? '¡Correcto!' : `Incorrecto. La respuesta correcta era: "${preguntaActual.respuestaCorrecta}"`}
        </div>
    `;

    const informacionDiv = document.getElementById('informacion');
    informacionDiv.innerHTML = `
        <div class="informacion-complementaria">
            ${preguntaActual.informacionComplementaria}
        </div>
    `;

    if (esCorrecta) {
        mostrarPuntaje(tipoPreguntaActual);
    } else {
        // Registrar la pregunta fallada
        registrarPreguntaFallada(tipoPreguntaActual, preguntaActual.index);
    }

    respuestaInput.disabled = true;
    document.querySelector('.confirmar-btn').disabled = true;
    document.getElementById('next-button').style.display = 'block';
    document.getElementById('next-button').onclick = siguientePregunta;
} 