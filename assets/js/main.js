// Variables globales
let preguntaActual = 0;
let totalPreguntas = 0;
let nombreJugador = '';
let puntaje = 0;
let datosPreguntas = {
    verdaderoFalso: [],
    alternativas: [],
    completarOracion: [],
    emparejamiento: [],
    ordenarPalabra: []
};

// Importar módulos
import { inicializarVerdaderoFalso } from './verdaderoFalso.js';
import { inicializarAlternativas } from './alternativas.js';
import { inicializarCompletarOracion } from './completarOracion.js';
import { inicializarEmparejamiento } from './emparejamiento.js';
import { inicializarOrdenarPalabra } from './ordenarPalabra.js';

// Inicializar la pantalla de inicio
const inicializarJuego = () => {
    const questionOptions = document.querySelectorAll('.question-option');
    questionOptions.forEach(option => {
        option.addEventListener('click', () => {
            questionOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            document.getElementById('selected-questions').value = option.dataset.questions;
        });
    });

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

        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = 'block';
        
        document.getElementById('player-name-display').textContent = `Jugador: ${nombreJugador}`;
        actualizarProgreso();

        cargarDatos();
    });
}

const actualizarProgreso = () => {
    document.getElementById('questions-progress').textContent = 
        `Pregunta ${preguntaActual + 1} de ${totalPreguntas}`;
}

const cargarDatos = async () => {
    try {
        const [verdaderoFalsoRes, alternativasRes, completarOracionRes, emparejamientoRes, ordenarPalabraRes] = await Promise.all([
            fetch('./assets/json/verdaderoFalso.json'),
            fetch('./assets/json/alternativas.json'),
            fetch('./assets/json/completarOracion.json'),
            fetch('./assets/json/emparejamiento.json'),
            fetch('./assets/json/ordenarPalabra.json')
        ]);

        if (!verdaderoFalsoRes.ok || !alternativasRes.ok || !completarOracionRes.ok || !emparejamientoRes.ok || !ordenarPalabraRes.ok) {
            throw new Error('Error al cargar los archivos JSON');
        }

        const [verdaderoFalso, alternativas, completarOracion, emparejamiento, ordenarPalabra] = await Promise.all([
            verdaderoFalsoRes.json(),
            alternativasRes.json(),
            completarOracionRes.json(),
            emparejamientoRes.json(),
            ordenarPalabraRes.json()
        ]);

        datosPreguntas = {
            verdaderoFalso,
            alternativas,
            completarOracion,
            emparejamiento,
            ordenarPalabra
        };

        mostrarPregunta();
    } catch (error) {
        console.error('Error al cargar los datos:', error);
        alert('Error al cargar los datos del juego. Por favor, verifica que los archivos JSON existan y recarga la página.');
    }
}

const mostrarPregunta = () => {
    // Si hemos llegado al límite de preguntas, mostrar la pantalla final
    if (preguntaActual >= totalPreguntas) {
        mostrarFinJuego();
        return;
    }

    const nextButton = document.getElementById('next-button');
    nextButton.style.display = 'none';
    nextButton.disabled = false;

    // Seleccionar aleatoriamente un tipo de pregunta
    const tiposPreguntas = ['verdaderoFalso', 'alternativas', 'completarOracion', 'emparejamiento', 'ordenarPalabra'];
    const tipoPregunta = tiposPreguntas[Math.floor(Math.random() * tiposPreguntas.length)];

    switch (tipoPregunta) {
        case 'verdaderoFalso':
            inicializarVerdaderoFalso(datosPreguntas.verdaderoFalso.preguntas[preguntaActual]);
            break;
        case 'alternativas':
            if (preguntaActual < datosPreguntas.alternativas.length) {
                inicializarAlternativas(datosPreguntas.alternativas[preguntaActual]);
            } else {
                console.error('Índice de pregunta fuera de rango');
            }
            break;
        case 'completarOracion':
            inicializarCompletarOracion(datosPreguntas.completarOracion[preguntaActual]);
            break;
        case 'emparejamiento':
            inicializarEmparejamiento(datosPreguntas.emparejamiento[preguntaActual]);
            break;
        case 'ordenarPalabra':
            inicializarOrdenarPalabra(datosPreguntas.ordenarPalabra[preguntaActual]);
            break;
    }
}

export const siguientePregunta = () => {
    if (preguntaActual >= totalPreguntas) {
        mostrarFinJuego();
        return;
    }

    preguntaActual++;
    actualizarProgreso();
    mostrarPregunta();
}

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
    document.getElementById('next-button').style.display = 'none';
}

const reiniciarJuego = () => {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
    document.getElementById('start-form').reset();
    document.querySelectorAll('.question-option').forEach(opt => opt.classList.remove('selected'));
}

export const mostrarPuntaje = (puntos = 1) => {
    puntaje += puntos;
    document.getElementById('score').textContent = `Puntaje: ${puntaje}`;
}

// Inicializar el juego al cargar la página
window.onload = inicializarJuego;
