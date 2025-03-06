import { siguientePregunta, mostrarPuntaje, registrarPreguntaFallada } from './main.js';

let paresCorrectos = 0;
let tipoPreguntaActual = '';
let preguntaActual = null;

// Función para desordenar un array
const desordenarArray = (array) => {
    const nuevoArray = [...array];
    for (let i = nuevoArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nuevoArray[i], nuevoArray[j]] = [nuevoArray[j], nuevoArray[i]];
    }
    return nuevoArray;
};

export const inicializarEmparejamiento = (pregunta, tipo) => {
    tipoPreguntaActual = tipo;
    paresCorrectos = 0;
    preguntaActual = pregunta;  // Guardamos la pregunta actual
    
    if (!pregunta || !pregunta.pares) {
        console.error('Pregunta de emparejamiento inválida');
        return;
    }

    const container = document.getElementById('question-container');
    container.innerHTML = `
        <div class="emparejamiento-container">
            <h2 class="tema-titulo">Emparejamiento</h2>
            <div class="pregunta-texto">${pregunta.tema}</div>
            <div class="conceptos-container">
                ${pregunta.pares.map((par, index) => `
                    <div class="concepto-item">
                        <div class="concepto-texto">${par.concepto}</div>
                        <div class="respuesta-slot" draggable="false" data-index="${index}"></div>
                    </div>
                `).join('')}
            </div>
            <div class="respuestas-container">
                ${desordenarArray(pregunta.pares).map((par, index) => `
                    <div class="respuesta-item" draggable="true" data-index="${pregunta.pares.indexOf(par)}">
                        ${par.respuesta}
                    </div>
                `).join('')}
            </div>
            <button class="confirmar-btn" onclick="verificarEmparejamiento()">Confirmar</button>
            <div id="resultado" class="resultado"></div>
            <div id="informacion" class="informacion-complementaria"></div>
        </div>
    `;

    // Configurar eventos de drag and drop
    const respuestas = document.querySelectorAll('.respuesta-item');
    const slots = document.querySelectorAll('.respuesta-slot');

    respuestas.forEach(respuesta => {
        respuesta.addEventListener('dragstart', () => {
            respuesta.classList.add('dragging');
        });

        respuesta.addEventListener('dragend', () => {
            respuesta.classList.remove('dragging');
        });
    });

    slots.forEach(slot => {
        slot.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (!slot.hasChildNodes()) {
                slot.classList.add('drag-over');
            }
        });

        slot.addEventListener('dragleave', () => {
            slot.classList.remove('drag-over');
        });

        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            slot.classList.remove('drag-over');
            const respuesta = document.querySelector('.dragging');
            
            if (respuesta) {
                // Si el slot ya tiene una respuesta, devolverla al contenedor de respuestas
                if (slot.hasChildNodes()) {
                    const respuestaExistente = slot.firstChild;
                    document.querySelector('.respuestas-container').appendChild(respuestaExistente);
                }
                
                slot.appendChild(respuesta);
                respuesta.style.display = 'block';
            }
        });
    });
};

window.verificarEmparejamiento = () => {
    const slots = document.querySelectorAll('.respuesta-slot');
    let emparejamientosCorrectos = 0;
    let emparejamientosIncorrectos = [];

    slots.forEach((slot, index) => {
        const respuesta = slot.firstChild;
        if (respuesta) {
            const respuestaIndex = parseInt(respuesta.dataset.index);
            const esCorrecto = respuestaIndex === parseInt(slot.dataset.index);
            
            slot.classList.add(esCorrecto ? 'correcto' : 'incorrecto');
            if (esCorrecto) {
                emparejamientosCorrectos++;
            } else {
                emparejamientosIncorrectos.push(index);
            }
        }
    });

    const resultadoDiv = document.getElementById('resultado');
    const informacionDiv = document.getElementById('informacion');

    resultadoDiv.innerHTML = `
        <div class="resultado">
            ${emparejamientosCorrectos} de ${slots.length} pares correctos
        </div>
    `;

    informacionDiv.innerHTML = `
        <div class="informacion-complementaria">
            ${preguntaActual.informacion_complementaria}
        </div>
    `;

    if (emparejamientosCorrectos > 0) {
        // Cada par correcto otorga 0.5 puntos
        mostrarPuntaje(tipoPreguntaActual, emparejamientosCorrectos);
    }

    if (emparejamientosIncorrectos.length > 0) {
        // Registrar las preguntas falladas
        emparejamientosIncorrectos.forEach(index => {
            registrarPreguntaFallada(tipoPreguntaActual, index);
        });
    }

    document.querySelector('.confirmar-btn').disabled = true;
    document.getElementById('next-button').style.display = 'block';
    document.getElementById('next-button').onclick = siguientePregunta;
};