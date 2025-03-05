const mostrarPreguntaEmparejamiento = () => {
    const pregunta = datosPreguntas.emparejamiento[preguntaActual];
    const contenedorPregunta = document.getElementById('question-container');

    const preguntaHTML = `
        <div class="emparejamiento-container">
            <h2 class="tema-titulo">${pregunta.tema}</h2>
            <div class="conceptos-fila">
                ${pregunta.pares.map((par, index) => `
                    <div class="concepto-container">
                        <div class="concepto-item">${par.concepto}</div>
                        <div class="respuesta-slot" draggable="false"></div>
                    </div>
                `).join('')}
            </div>
            <div class="respuestas-columna">
                ${pregunta.pares.map((par, index) => `
                    <div class="respuesta-item" draggable="true" data-respuesta="${par.respuesta}">
                        ${par.respuesta}
                    </div>
                `).join('')}
            </div>
            <button class="confirmar-btn" onclick="verificarEmparejamiento()">Confirmar</button>
            <div id="resultado" class="resultado"></div>
            <div id="explicacion" class="explicacion"></div>
        </div>
    `;
    contenedorPregunta.innerHTML = preguntaHTML;

    // Configurar eventos de drag and drop
    const slots = document.querySelectorAll('.respuesta-slot');
    const respuestas = document.querySelectorAll('.respuesta-item');

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
            
            const respuesta = document.querySelector('.respuesta-item.dragging');
            if (respuesta) {
                // Si el slot ya tiene una respuesta, devolverla a la columna
                if (slot.children.length > 0) {
                    const respuestaExistente = slot.children[0];
                    document.querySelector('.respuestas-columna').appendChild(respuestaExistente);
                }
                
                // Mover la nueva respuesta al slot
                slot.appendChild(respuesta);
            }
        });
    });

    respuestas.forEach(respuesta => {
        respuesta.addEventListener('dragstart', () => {
            respuesta.classList.add('dragging');
        });

        respuesta.addEventListener('dragend', () => {
            respuesta.classList.remove('dragging');
        });

        respuesta.addEventListener('click', () => {
            // Si la respuesta está en un slot, devolverla a la columna
            if (respuesta.parentElement.classList.contains('respuesta-slot')) {
                document.querySelector('.respuestas-columna').appendChild(respuesta);
            }
        });
    });
}

const verificarEmparejamiento = () => {
    const pregunta = datosPreguntas.emparejamiento[preguntaActual];
    const slots = document.querySelectorAll('.respuesta-slot');
    let paresCorrectos = 0;

    slots.forEach((slot, index) => {
        const respuesta = slot.children[0];
        if (respuesta) {
            const respuestaCorrecta = pregunta.pares[index].respuesta;
            const esCorrecta = respuesta.textContent === respuestaCorrecta;
            
            slot.classList.add(esCorrecta ? 'correcto' : 'incorrecto');
            if (esCorrecta) paresCorrectos++;
        }
    });

    // Mostrar resultado
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `
        <div class="resultado ${paresCorrectos === pregunta.pares.length ? 'correcto' : 'incorrecto'}">
            ${paresCorrectos === pregunta.pares.length ? '¡Correcto!' : 'Incorrecto'}
        </div>
    `;

    // Mostrar información complementaria
    const explicacionDiv = document.getElementById('explicacion');
    explicacionDiv.innerHTML = `
        <p class="informacion-complementaria">${pregunta.informacionComplementaria}</p>
    `;

    // Actualizar puntaje (0.5 puntos por cada par correcto)
    if (paresCorrectos > 0) {
        puntaje += paresCorrectos * 0.5;
        mostrarPuntaje();
    }

    // Deshabilitar el botón de confirmar
    document.querySelector('.confirmar-btn').disabled = true;

    // Mostrar botón siguiente
    mostrarBotonSiguiente();
}
