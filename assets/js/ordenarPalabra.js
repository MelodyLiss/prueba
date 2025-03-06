import { siguientePregunta, registrarPreguntaFallada, mostrarPuntaje } from './main.js';

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

export const inicializarOrdenarPalabra = (pregunta, tipo) => {
    tipoPreguntaActual = tipo;
    preguntaActual = pregunta;

    // Validar que la pregunta tenga las propiedades necesarias
    if (!pregunta || !pregunta.palabras_desordenadas || !Array.isArray(pregunta.palabras_desordenadas) || 
        !pregunta.orden_correcto || !Array.isArray(pregunta.orden_correcto) || 
        pregunta.palabras_desordenadas.length === 0) {
        console.error('Pregunta de ordenar palabra inválida:', pregunta);
        return;
    }

    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = `
        <div class="ordenar-palabra-container">
            <h2 class="tema-titulo">Ordenar Palabra</h2>
            <div class="pregunta-texto">${pregunta.tema}</div>
            <div class="palabras-container">
                ${desordenarArray(pregunta.palabras_desordenadas).map((palabra, index) => `
                    <div class="palabra-item" draggable="true" data-index="${pregunta.orden_correcto.indexOf(palabra)}">
                        ${palabra}
                    </div>
                `).join('')}
            </div>
            <button class="confirmar-btn" onclick="verificarOrdenarPalabra()">Confirmar</button>
            <div id="resultado" class="resultado"></div>
            <div id="informacion" class="informacion-complementaria"></div>
        </div>
    `;

    // Configurar eventos de drag and drop
    const palabras = document.querySelectorAll('.palabra-item');
    const palabrasContainer = document.querySelector('.palabras-container');

    palabras.forEach(palabra => {
        palabra.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', palabra.dataset.index);
            palabra.classList.add('dragging');
        });

        palabra.addEventListener('dragend', () => {
            palabra.classList.remove('dragging');
        });
    });

    palabrasContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        const dragging = document.querySelector('.dragging');
        if (!dragging) return;

        const afterElement = getDragAfterElement(palabrasContainer, e.clientY);
        if (afterElement) {
            palabrasContainer.insertBefore(dragging, afterElement);
        } else {
            palabrasContainer.appendChild(dragging);
        }
    });

    palabrasContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        const dragging = document.querySelector('.dragging');
        if (!dragging) return;

        const afterElement = getDragAfterElement(palabrasContainer, e.clientY);
        if (afterElement) {
            palabrasContainer.insertBefore(dragging, afterElement);
        } else {
            palabrasContainer.appendChild(dragging);
        }
    });
};

const getDragAfterElement = (container, y) => {
    const draggableElements = [...container.querySelectorAll('.palabra-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
};

window.verificarOrdenarPalabra = () => {
    const palabras = document.querySelectorAll('.palabra-item');
    let palabrasCorrectas = 0;
    let palabrasIncorrectas = [];

    palabras.forEach((palabra, index) => {
        const indiceCorrecto = parseInt(palabra.dataset.index);
        const esCorrecto = indiceCorrecto === index;
        
        palabra.classList.add(esCorrecto ? 'correcto' : 'incorrecto');
        if (esCorrecto) {
            palabrasCorrectas++;
        } else {
            palabrasIncorrectas.push(index);
        }
    });

    const resultadoDiv = document.getElementById('resultado');
    const informacionDiv = document.getElementById('informacion');

    resultadoDiv.innerHTML = `
        <div class="resultado">
            ${palabrasCorrectas} de ${palabras.length} palabras en orden correcto
        </div>
    `;

    if (preguntaActual && preguntaActual.informacion_complementaria) {
        informacionDiv.innerHTML = `
            <div class="informacion-complementaria">
                ${preguntaActual.informacion_complementaria}
            </div>
        `;
    }

    if (palabrasCorrectas > 0) {
        mostrarPuntaje(tipoPreguntaActual, palabrasCorrectas);
    }

    if (palabrasIncorrectas.length > 0) {
        registrarPreguntaFallada(tipoPreguntaActual, preguntaActual.index);
    }

    document.querySelector('.confirmar-btn').disabled = true;
    document.getElementById('next-button').style.display = 'block';
    document.getElementById('next-button').onclick = siguientePregunta;
}; 