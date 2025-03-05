let palabrasOrdenadas = [];
let palabrasCorrectas = 0;

const mostrarPreguntaOrdenarPalabra = () => {
    const pregunta = datosPreguntas.ordenarPalabra[preguntaActual];
    const contenedorPregunta = document.getElementById('question-container');

    const preguntaHTML = `
        <div class="ordenar-palabra-container">
            <h2 class="pregunta-titulo">${pregunta.pregunta}</h2>
            <div class="palabras-ordenadas">
                ${pregunta.palabras.map((_, index) => `
                    <div class="palabra-slot" draggable="false"></div>
                `).join('')}
            </div>
            <div class="palabras-desordenadas">
                ${pregunta.palabras.map((palabra, index) => `
                    <div class="palabra-item" draggable="true">${palabra}</div>
                `).join('')}
            </div>
            <button class="confirmar-btn" onclick="verificarOrdenarPalabra()">Confirmar</button>
            <div id="resultado" class="resultado"></div>
            <div id="explicacion" class="explicacion"></div>
        </div>
    `;
    contenedorPregunta.innerHTML = preguntaHTML;

    // Configurar eventos de drag and drop
    const slots = document.querySelectorAll('.palabra-slot');
    const palabras = document.querySelectorAll('.palabra-item');

    slots.forEach(slot => {
        slot.addEventListener('dragover', e => {
            e.preventDefault();
            slot.classList.add('drag-over');
        });

        slot.addEventListener('dragleave', () => {
            slot.classList.remove('drag-over');
        });

        slot.addEventListener('drop', e => {
            e.preventDefault();
            slot.classList.remove('drag-over');
            
            const palabra = document.querySelector('.palabra-item.dragging');
            if (palabra) {
                // Si el slot ya tiene una palabra, devolverla a la sección desordenada
                if (slot.children.length > 0) {
                    const palabraExistente = slot.children[0];
                    document.querySelector('.palabras-desordenadas').appendChild(palabraExistente);
                }
                
                // Mover la nueva palabra al slot
                slot.appendChild(palabra);
            }
        });
    });

    palabras.forEach(palabra => {
        palabra.addEventListener('dragstart', () => {
            palabra.classList.add('dragging');
        });

        palabra.addEventListener('dragend', () => {
            palabra.classList.remove('dragging');
        });

        palabra.addEventListener('click', () => {
            // Si la palabra está en un slot, devolverla a la sección desordenada
            if (palabra.parentElement.classList.contains('palabra-slot')) {
                document.querySelector('.palabras-desordenadas').appendChild(palabra);
            }
        });
    });
}

const verificarOrdenarPalabra = () => {
    const pregunta = datosPreguntas.ordenarPalabra[preguntaActual];
    const slots = document.querySelectorAll('.palabra-slot');
    let palabrasCorrectas = 0;

    slots.forEach((slot, index) => {
        const palabra = slot.children[0];
        if (palabra) {
            const palabraCorrecta = pregunta.palabras[index];
            const esCorrecta = palabra.textContent === palabraCorrecta;
            
            slot.classList.add(esCorrecta ? 'correcto' : 'incorrecto');
            if (esCorrecta) palabrasCorrectas++;
        }
    });

    // Mostrar resultado
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `
        <div class="resultado ${palabrasCorrectas === pregunta.palabras.length ? 'correcto' : 'incorrecto'}">
            ${palabrasCorrectas === pregunta.palabras.length ? '¡Correcto!' : 'Incorrecto'}
        </div>
    `;

    // Mostrar información complementaria
    const explicacionDiv = document.getElementById('explicacion');
    explicacionDiv.innerHTML = `
        <p class="informacion-complementaria">${pregunta.informacionComplementaria}</p>
    `;

    // Actualizar puntaje (1 punto si todas las palabras están correctas)
    if (palabrasCorrectas === pregunta.palabras.length) {
        puntaje += 1;
        mostrarPuntaje();
    }

    // Deshabilitar el botón de confirmar
    document.querySelector('.confirmar-btn').disabled = true;

    // Mostrar botón siguiente
    mostrarBotonSiguiente();
}

const actualizarPalabrasOrdenadas = () => {
    const slots = document.querySelectorAll('.palabra-slot');
    palabrasOrdenadas = [];

    slots.forEach(slot => {
        const palabraElement = slot.querySelector('.palabra-item');
        if (palabraElement) {
            palabrasOrdenadas.push(palabraElement.dataset.palabra);
        }
    });
} 