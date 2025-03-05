import { siguientePregunta, mostrarPuntaje } from './main.js';

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

export const inicializarEmparejamiento = (pregunta) => {
    const contenedorPregunta = document.getElementById('question-container');
    preguntaActual = pregunta;

    // Desordenar los pares para los conceptos
    const paresDesordenados = desordenarArray(pregunta.pares);

    const preguntaHTML = `
        <div class="emparejamiento-container">
            <h2 class="tema-titulo">Emparejamiento</h2>
            <div class="pregunta-texto">${pregunta.tema}</div>
            <div class="conceptos-container">
                ${paresDesordenados.map((par, index) => `
                    <div class="concepto-item">
                        <div class="concepto-texto">${par.concepto}</div>
                        <div class="respuesta-slot" draggable="false" data-index="${pregunta.pares.indexOf(par)}"></div>
                    </div>
                `).join('')}
            </div>
            <div class="respuestas-container">
                ${pregunta.pares.map((par, index) => `
                    <div class="respuesta-item" draggable="true" data-index="${index}">
                        ${par.respuesta}
                    </div>
                `).join('')}
            </div>
            <button class="confirmar-btn" onclick="verificarEmparejamiento()">Confirmar</button>
            <div id="resultado" class="resultado"></div>
        </div>
    `;
    contenedorPregunta.innerHTML = preguntaHTML;

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
            if (respuesta && !slot.hasChildNodes()) {
                slot.appendChild(respuesta);
                respuesta.style.display = 'block';
            }
        });
    });
}

window.verificarEmparejamiento = () => {
    if (!preguntaActual) return;

    const slots = document.querySelectorAll('.respuesta-slot');
    let emparejamientosCorrectos = 0;

    slots.forEach((slot, index) => {
        const respuesta = slot.firstChild;
        if (respuesta) {
            const respuestaIndex = parseInt(respuesta.dataset.index);
            const esCorrecto = respuestaIndex === parseInt(slot.dataset.index);
            
            slot.classList.add(esCorrecto ? 'correcto' : 'incorrecto');
            if (esCorrecto) emparejamientosCorrectos++;
        }
    });

    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `
        <div class="resultado">
            ${emparejamientosCorrectos} de ${preguntaActual.pares.length} pares correctos
        </div>
    `;

    if (emparejamientosCorrectos > 0) {
        // Cada par correcto otorga 0.5 puntos
        const puntosGanados = emparejamientosCorrectos * 0.5;
        mostrarPuntaje(puntosGanados);
    }

    document.querySelector('.confirmar-btn').disabled = true;
    document.getElementById('next-button').style.display = 'block';
    document.getElementById('next-button').onclick = siguientePregunta;
}