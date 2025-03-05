// verdaderoFalso.js

const mostrarPreguntaVerdaderoFalso = () => {
    const pregunta = datosPreguntas.verdaderoFalso.preguntas[preguntaActual];
    const contenedorPregunta = document.getElementById('question-container');

    const preguntaHTML = `
        <div class="verdadero-falso-container">
            <h2 class="pregunta-titulo">${pregunta.pregunta}</h2>
            <div class="opciones-container">
                <button class="opcion-btn verdadero" onclick="verificarRespuestaVerdaderoFalso(true)">Verdadero</button>
                <button class="opcion-btn falso" onclick="verificarRespuestaVerdaderoFalso(false)">Falso</button>
            </div>
            <div id="resultado" class="resultado"></div>
            <div id="explicacion" class="explicacion"></div>
        </div>
    `;
    contenedorPregunta.innerHTML = preguntaHTML;
}

const verificarRespuestaVerdaderoFalso = (respuestaSeleccionada) => {
    const pregunta = datosPreguntas.verdaderoFalso.preguntas[preguntaActual];
    const esCorrecta = respuestaSeleccionada === pregunta.respuestaCorrecta;
    
    // Deshabilitar todos los botones
    const botones = document.querySelectorAll('.opcion-btn');
    botones.forEach(boton => boton.disabled = true);
    
    // Marcar la respuesta seleccionada
    const botonSeleccionado = document.querySelector(`.opcion-btn.${respuestaSeleccionada ? 'verdadero' : 'falso'}`);
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
