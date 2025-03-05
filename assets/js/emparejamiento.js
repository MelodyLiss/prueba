const mostrarPreguntaEmparejamiento = () => {
    const pregunta = datosPreguntas.emparejamiento[preguntaActual];
    const contenedorPregunta = document.getElementById('question-container');

    // Crear un array de respuestas y desordenarlo
    const respuestasDesordenadas = [...pregunta.pares]
        .map(par => par.respuesta)
        .sort(() => Math.random() - 0.5);

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
                ${respuestasDesordenadas.map(respuesta => `
                    <div class="respuesta-item" draggable="true" data-respuesta="${respuesta}">
                        ${respuesta}
                    </div>
                `).join('')}
            </div>
            <button class="confirmar-btn" onclick="verificarEmparejamiento()">Confirmar</button>
            <div id="resultado" class="resultado"></div>
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
    const conceptos = document.querySelectorAll('.concepto-item');
    let paresCorrectos = 0;

    slots.forEach((slot, index) => {
        const respuesta = slot.children[0];
        if (respuesta) {
            const respuestaCorrecta = pregunta.pares[index].respuesta;
            const respuestaSeleccionada = respuesta.textContent.trim();
            const esCorrecta = respuestaSeleccionada === respuestaCorrecta;
            
            console.log(`Par ${index + 1}:`, {
                correcta: respuestaCorrecta,
                seleccionada: respuestaSeleccionada,
                esCorrecta: esCorrecta
            });
            
            // Marcar visualmente cada par
            slot.classList.add(esCorrecta ? 'correcto' : 'incorrecto');
            respuesta.classList.add(esCorrecta ? 'correcto' : 'incorrecto');
            conceptos[index].classList.add(esCorrecta ? 'correcto' : 'incorrecto');
            
            if (esCorrecta) paresCorrectos++;
        }
    });

    // Mostrar resultado con el conteo de pares correctos
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `
        <div class="resultado">
            Tienes ${paresCorrectos} de ${pregunta.pares.length} pares correctos
        </div>
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
