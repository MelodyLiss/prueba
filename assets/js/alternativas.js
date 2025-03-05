import { siguientePregunta, mostrarPuntaje } from './main.js';

let preguntaActual = null;

export const inicializarAlternativas = (pregunta) => {
    if (!pregunta) {
        console.error('La pregunta es undefined');
        return;
    }

    const contenedorPregunta = document.getElementById('question-container');
    preguntaActual = pregunta;

    const preguntaHTML = `
        <div class="alternativas-container">
            <h2 class="tema-titulo">Alternativas</h2>
            <div class="pregunta-texto">${pregunta.pregunta}</div>
            <div class="opciones-container">
                ${pregunta.opciones.map((opcion, index) => `
                    <button class="opcion-btn" onclick="verificarRespuestaAlternativas(${index})">
                        ${opcion}
                    </button>
                `).join('')}
            </div>
            <div id="resultado" class="resultado"></div>
            <div id="informacion" class="informacion-complementaria"></div>
        </div>
    `;
    contenedorPregunta.innerHTML = preguntaHTML;
}

window.verificarRespuestaAlternativas = (indexSeleccionado) => {
    if (!preguntaActual) return;

    const resultadoDiv = document.getElementById('resultado');
    const informacionDiv = document.getElementById('informacion');
    const botones = document.querySelectorAll('.opcion-btn');

    botones.forEach(boton => boton.disabled = true);

    const respuestaSeleccionada = preguntaActual.opciones[indexSeleccionado];
    const esCorrecta = respuestaSeleccionada === preguntaActual.respuesta_correcta;

    resultadoDiv.innerHTML = `
        <div class="resultado ${esCorrecta ? 'correcto' : 'incorrecto'}">
            ${esCorrecta ? '¡Correcto!' : 'Incorrecto'}
        </div>
    `;

    informacionDiv.innerHTML = `
        <div class="informacion-complementaria">
            ${preguntaActual.informacion_complementaria}
        </div>
    `;

    if (esCorrecta) {
        mostrarPuntaje();
    }

    document.getElementById('next-button').style.display = 'block';
    document.getElementById('next-button').onclick = siguientePregunta;
} 