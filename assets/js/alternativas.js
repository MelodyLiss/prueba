// preguntas.js

const mostrarPreguntaConAlternativas = () => {
    const pregunta = datosPreguntas.alternativas[preguntaActual];
    const contenedorPregunta = document.getElementById('question-container');

    const preguntaHTML = `
        <div class="pregunta-container">
            <h2 class="pregunta-titulo">${pregunta.pregunta}</h2>
            <div class="alternativas-container">
                ${pregunta.opciones.map((alternativa, index) => `
                    <div class="alternativa-container">
                        <button class="alternativa" onclick="verificarRespuestaAlternativa(${index})">
                            <span class="letra-alternativa">${String.fromCharCode(65 + index)}</span>
                            <span class="texto-alternativa">${alternativa}</span>
                        </button>
                    </div>
                `).join('')}
            </div>
            <div id="resultado" class="resultado"></div>
            <div id="explicacion" class="explicacion"></div>
        </div>
    `;
    contenedorPregunta.innerHTML = preguntaHTML;
}

const verificarRespuestaAlternativa = (indiceSeleccionado) => {
    const pregunta = datosPreguntas.alternativas[preguntaActual];
    const alternativaSeleccionada = pregunta.opciones[indiceSeleccionado];
    const esCorrecta = alternativaSeleccionada === pregunta.respuesta_correcta;
    
    // Deshabilitar todos los botones
    const botones = document.querySelectorAll('.alternativa');
    botones.forEach(boton => boton.disabled = true);
    
    // Marcar la respuesta seleccionada
    const botonSeleccionado = botones[indiceSeleccionado];
    botonSeleccionado.classList.add(esCorrecta ? 'respuesta-correcta' : 'respuesta-incorrecta');
    
    // Mostrar resultado
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `
        <div class="resultado ${esCorrecta ? 'correcto' : 'incorrecto'}">
            ${esCorrecta ? '¡Correcto!' : 'Incorrecto'}
        </div>
    `;
    
    // Mostrar información complementaria
    const explicacionDiv = document.getElementById('explicacion');
    explicacionDiv.innerHTML = `
        <p class="informacion-complementaria">${pregunta.informacion_complementaria}</p>
    `;
    
    // Actualizar puntaje
    if (esCorrecta) {
        puntaje += 2;
        mostrarPuntaje();
    }
    
    // Mostrar botón siguiente
    mostrarBotonSiguiente();
}
