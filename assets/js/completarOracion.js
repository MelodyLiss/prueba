const mostrarPreguntaCompletarOracion = () => {
    const pregunta = datosPreguntas.completarOracion[preguntaActual];
    const contenedorPregunta = document.getElementById('question-container');

    const preguntaHTML = `
        <div class="oracion-container">
            <h2 class="pregunta-titulo">Completa la oración</h2>
            <div class="oracion">${pregunta.oracion}</div>
            <div class="respuesta-container">
                <input type="text" class="respuesta-input" placeholder="Escribe tu respuesta">
                <p class="pista-letras">La palabra tiene ${pregunta.respuestaCorrecta.length} letras</p>
            </div>
            <button class="confirmar-btn" onclick="verificarRespuestaCompletar()">Confirmar</button>
            <div id="resultado" class="resultado"></div>
            <div id="explicacion" class="explicacion"></div>
        </div>
    `;
    contenedorPregunta.innerHTML = preguntaHTML;
}

const verificarRespuestaCompletar = () => {
    const pregunta = datosPreguntas.completarOracion[preguntaActual];
    const input = document.querySelector('.respuesta-input');
    const respuesta = input.value.trim().toLowerCase();
    const respuestaCorrecta = pregunta.respuestaCorrecta.toLowerCase();
    const esCorrecta = respuesta === respuestaCorrecta;

    // Deshabilitar el input y el botón
    input.disabled = true;
    document.querySelector('.confirmar-btn').disabled = true;

    // Marcar visualmente la respuesta
    input.classList.add(esCorrecta ? 'respuesta-correcta' : 'respuesta-incorrecta');

    // Mostrar resultado
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `
        <div class="resultado ${esCorrecta ? 'correcto' : 'incorrecto'}">
            ${esCorrecta ? '¡Correcto!' : 'Incorrecto'}
        </div>
    `;

    // Si es incorrecta, mostrar la palabra correcta
    if (!esCorrecta) {
        resultadoDiv.innerHTML += `
            <p class="palabra-correcta">La palabra correcta era: <strong>${pregunta.respuestaCorrecta}</strong></p>
        `;
    }

    // Mostrar información complementaria
    const explicacionDiv = document.getElementById('explicacion');
    explicacionDiv.innerHTML = `
        <p class="informacion-complementaria">${pregunta.informacionComplementaria}</p>
    `;

    // Actualizar puntaje
    if (esCorrecta) {
        puntaje += 1;
        mostrarPuntaje();
    }

    // Mostrar botón siguiente
    mostrarBotonSiguiente();
}
