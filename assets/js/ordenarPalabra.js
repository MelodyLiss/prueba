import { siguientePregunta, mostrarPuntaje } from './main.js';

let preguntaActual = null;

export const inicializarOrdenarPalabra = (pregunta) => {
    const contenedorPregunta = document.getElementById('question-container');
    preguntaActual = pregunta;

    const preguntaHTML = `
        <div class="ordenar-palabra-container">
            <h2 class="tema-titulo">Ordenar Palabras</h2>
            <div class="pregunta-texto">${pregunta.pregunta}</div>
            <div class="palabras-ordenadas">
                ${pregunta.palabras.map((_, index) => `
                    <div class="palabra-slot" draggable="false" data-index="${index}"></div>
                `).join('')}
            </div>
            <div class="palabras-desordenadas">
                ${pregunta.palabras.map((palabra, index) => `
                    <div class="palabra-item" draggable="true" data-index="${index}">
                        ${palabra}
                    </div>
                `).join('')}
            </div>
            <button class="confirmar-btn" onclick="verificarOrdenarPalabra()">Confirmar</button>
            <div id="resultado" class="resultado"></div>
        </div>
    `;
    contenedorPregunta.innerHTML = preguntaHTML;

    // Configurar eventos de drag and drop
    const palabras = document.querySelectorAll('.palabra-item');
    const slots = document.querySelectorAll('.palabra-slot');

    palabras.forEach(palabra => {
        palabra.addEventListener('dragstart', () => {
            palabra.classList.add('dragging');
        });

        palabra.addEventListener('dragend', () => {
            palabra.classList.remove('dragging');
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
            const palabra = document.querySelector('.dragging');
            
            if (palabra) {
                // Si el slot ya tiene una palabra, devolverla al contenedor de palabras desordenadas
                if (slot.hasChildNodes()) {
                    const palabraExistente = slot.firstChild;
                    document.querySelector('.palabras-desordenadas').appendChild(palabraExistente);
                }
                
                slot.appendChild(palabra);
                palabra.style.display = 'block';
            }
        });
    });
}

window.verificarOrdenarPalabra = () => {
    if (!preguntaActual) return;

    const slots = document.querySelectorAll('.palabra-slot');
    let palabrasCorrectas = 0;

    slots.forEach((slot, index) => {
        const palabra = slot.firstChild;
        if (palabra) {
            const palabraIndex = parseInt(palabra.dataset.index);
            const esCorrecto = palabraIndex === index;
            
            slot.classList.add(esCorrecto ? 'correcto' : 'incorrecto');
            if (esCorrecto) palabrasCorrectas++;
        }
    });

    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `
        <div class="resultado">
            ${palabrasCorrectas} de ${preguntaActual.palabras.length} palabras correctas
        </div>
    `;

    if (palabrasCorrectas > 0) {
        // Cada palabra correcta otorga 0.5 puntos
        const puntosGanados = palabrasCorrectas * 0.5;
        mostrarPuntaje(puntosGanados);
    }

    document.querySelector('.confirmar-btn').disabled = true;
    document.getElementById('next-button').style.display = 'block';
    document.getElementById('next-button').onclick = siguientePregunta;
} 