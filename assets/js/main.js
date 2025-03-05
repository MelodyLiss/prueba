// main.js

let preguntaActual = 0;
let totalPreguntas = 0;
let nombreJugador = '';
let puntaje = 0;
let datosPreguntas = {
    alternativas: [],
    completarOracion: [],
    emparejamiento: [],
    ordenarPalabra: [],
    verdaderoFalso: { preguntas: [] }
};

// Inicializar la pantalla de inicio
const inicializarJuego = () => {
    // Configurar los botones de selección de preguntas
    const questionOptions = document.querySelectorAll('.question-option');
    questionOptions.forEach(option => {
        option.addEventListener('click', () => {
            questionOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            document.getElementById('selected-questions').value = option.dataset.questions;
        });
    });

    // Configurar el formulario de inicio
    document.getElementById('start-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('player-name').value;
        const preguntas = document.getElementById('selected-questions').value;

        if (!nombre || !preguntas) {
            alert('Por favor, ingresa tu nombre y selecciona el número de preguntas');
            return;
        }

        nombreJugador = nombre;
        totalPreguntas = parseInt(preguntas);
        preguntaActual = 0;
        puntaje = 0;

        // Ocultar pantalla de inicio y mostrar pantalla de juego
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = 'block';
        
        // Actualizar información del jugador
        document.getElementById('player-name-display').textContent = `Jugador: ${nombreJugador}`;
        actualizarProgreso();

        // Cargar datos y comenzar el juego
        cargarDatos();
    });
}

// Actualizar el progreso de preguntas
const actualizarProgreso = () => {
    document.getElementById('questions-progress').textContent = 
        `Pregunta ${preguntaActual + 1} de ${totalPreguntas}`;
}

// Cargar datos de los archivos JSON
const cargarDatos = async () => {
    try {
        // Cargar solo el archivo de completar oración
        const completarOracionResponse = await fetch('./assets/json/completarOracion.json');

        // Verificar que la respuesta sea exitosa
        if (!completarOracionResponse.ok) throw new Error('Error al cargar completarOracion.json');

        // Convertir la respuesta a JSON
        const completarOracion = await completarOracionResponse.json();

        // Asignar los datos
        datosPreguntas = {
            alternativas: [],
            completarOracion,
            emparejamiento: [],
            ordenarPalabra: [],
            verdaderoFalso: { preguntas: [] }
        };

        // Iniciar el juego
        mostrarPregunta();
    } catch (error) {
        console.error('Error al cargar los datos:', error);
        alert('Error al cargar los datos del juego. Por favor, verifica que el archivo completarOracion.json exista y recarga la página.');
    }
}

// Mostrar la pregunta actual
const mostrarPregunta = () => {
    // Ocultar el botón siguiente al mostrar una nueva pregunta
    const nextButton = document.getElementById('next-button');
    nextButton.style.display = 'none';
    nextButton.disabled = false;

    // Temporalmente solo mostrar preguntas de completar oración
    mostrarPreguntaCompletarOracion();
}

// Función para pasar a la siguiente pregunta
const siguientePregunta = () => {
    // Verificar si el juego ha terminado
    if (preguntaActual >= totalPreguntas) {
        return;
    }

    // Si estamos en la última pregunta, mostrar el botón de resultados
    if (preguntaActual === totalPreguntas - 1) {
        const nextButton = document.getElementById('next-button');
        nextButton.textContent = 'Ver Resultados';
        nextButton.onclick = mostrarFinJuego;
        return;
    }

    // Si no es la última pregunta, continuar normalmente
    preguntaActual++;
    actualizarProgreso();
    mostrarPregunta();
}

// Mostrar pantalla de fin de juego
const mostrarFinJuego = () => {
    const container = document.getElementById('question-container');
    container.innerHTML = `
        <div class="fin-juego">
            <h2>¡Juego Terminado!</h2>
            <p>${nombreJugador}, has completado todas las preguntas.</p>
            <p>Tu puntaje final es: ${puntaje}</p>
            <button onclick="reiniciarJuego()">Jugar de nuevo</button>
        </div>
    `;
    // Deshabilitar el botón después de mostrar resultados
    document.getElementById('next-button').style.display = 'none';
}

// Reiniciar el juego
const reiniciarJuego = () => {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
    document.getElementById('start-form').reset();
    document.querySelectorAll('.question-option').forEach(opt => opt.classList.remove('selected'));
}

// Mostrar puntaje en la interfaz
const mostrarPuntaje = () => {
    document.getElementById('score').textContent = `Puntaje: ${puntaje}`;
}

// Función para mostrar el botón siguiente
const mostrarBotonSiguiente = () => {
    const nextButton = document.getElementById('next-button');
    nextButton.style.display = 'block';
}

// Inicializar el juego al cargar la página
window.onload = inicializarJuego;
