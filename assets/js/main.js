// Variables globales
let preguntaActual = 0;
let totalPreguntas = 0;
let nombreJugador = '';
let puntaje = 0;
let puntajeMaximo = 0;
let preguntasFalladas = {
    verdaderoFalso: new Set(),
    alternativas: new Set(),
    completarOracion: new Set(),
    emparejamiento: new Set(),
    ordenarPalabra: new Set()
};
let preguntasUsadas = {
    verdaderoFalso: new Set(),
    alternativas: new Set(),
    completarOracion: new Set(),
    emparejamiento: new Set(),
    ordenarPalabra: new Set()
};
let datosPreguntas = {
    verdaderoFalso: [],
    alternativas: [],
    completarOracion: [],
    emparejamiento: [],
    ordenarPalabra: []
};

// Puntajes por tipo de pregunta
const puntajesPorTipo = {
    verdaderoFalso: 1,
    alternativas: 2,
    completarOracion: 3,
    emparejamiento: 0.5, // puntos por par correcto
    ordenarPalabra: 0.5  // puntos por palabra correcta
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

        // Calcular el puntaje máximo posible
        puntajeMaximo = 0;
        Object.keys(datosPreguntas).forEach(tipo => {
            const preguntas = datosPreguntas[tipo];
            if (!preguntas || !Array.isArray(preguntas)) return;

            if (tipo === 'emparejamiento') {
                puntajeMaximo += preguntas.reduce((total, pregunta) => {
                    if (pregunta && pregunta.pares && Array.isArray(pregunta.pares)) {
                        return total + (pregunta.pares.length * puntajesPorTipo[tipo]);
                    }
                    return total;
                }, 0);
            } else if (tipo === 'ordenarPalabra') {
                puntajeMaximo += preguntas.reduce((total, pregunta) => {
                    if (pregunta && pregunta.palabras && Array.isArray(pregunta.palabras)) {
                        return total + (pregunta.palabras.length * puntajesPorTipo[tipo]);
                    }
                    return total;
                }, 0);
            } else {
                puntajeMaximo += preguntas.length * puntajesPorTipo[tipo];
            }
        });

        mostrarPregunta();
    } catch (error) {
        console.error('Error al cargar los datos:', error);
        alert('Error al cargar los datos del juego. Por favor, verifica que los archivos JSON existan y recarga la página.');
    }
}

const obtenerPreguntaDisponible = (tipo) => {
    const preguntas = datosPreguntas[tipo];
    const preguntasUsadasEnTipo = preguntasUsadas[tipo];
    
    // Si no hay preguntas disponibles en esta categoría, retornar null
    if (preguntasUsadasEnTipo.size >= preguntas.length) {
        return null;
    }

    // Encontrar una pregunta no usada
    let indiceDisponible;
    do {
        indiceDisponible = Math.floor(Math.random() * preguntas.length);
    } while (preguntasUsadasEnTipo.has(indiceDisponible));

    // Marcar la pregunta como usada
    preguntasUsadasEnTipo.add(indiceDisponible);
    return preguntas[indiceDisponible];
};

const obtenerTipoPreguntaDisponible = () => {
    const tiposPreguntas = ['verdaderoFalso', 'alternativas', 'completarOracion', 'emparejamiento', 'ordenarPalabra'];
    
    // Filtrar solo los tipos que tienen preguntas disponibles
    const tiposDisponibles = tiposPreguntas.filter(tipo => {
        const preguntas = datosPreguntas[tipo];
        const preguntasUsadasEnTipo = preguntasUsadas[tipo];
        return preguntasUsadasEnTipo.size < preguntas.length;
    });

    // Si no hay tipos disponibles, retornar null
    if (tiposDisponibles.length === 0) {
        return null;
    }

    // Seleccionar aleatoriamente un tipo disponible
    return tiposDisponibles[Math.floor(Math.random() * tiposDisponibles.length)];
};

const mostrarPregunta = () => {
    // Si hemos llegado al límite de preguntas, mostrar la pantalla final
    if (preguntaActual >= totalPreguntas) {
        mostrarFinJuego();
        return;
    }

    const nextButton = document.getElementById('next-button');
    nextButton.style.display = 'none';
    nextButton.disabled = false;

    // Obtener un tipo de pregunta disponible
    const tipoPregunta = obtenerTipoPreguntaDisponible();
    
    if (!tipoPregunta) {
        console.error('No hay más preguntas disponibles');
        mostrarFinJuego();
        return;
    }

    // Obtener una pregunta no usada del tipo seleccionado
    const pregunta = obtenerPreguntaDisponible(tipoPregunta);
    
    if (!pregunta) {
        console.error('Error al obtener la pregunta');
        return;
    }

    // Calcular y mostrar los puntos posibles para esta pregunta
    let puntosPosibles = 0;
    switch (tipoPregunta) {
        case 'emparejamiento':
            if (pregunta && pregunta.pares && Array.isArray(pregunta.pares)) {
                puntosPosibles = pregunta.pares.length * puntajesPorTipo.emparejamiento;
            }
            break;
        case 'ordenarPalabra':
            if (pregunta && pregunta.palabras && Array.isArray(pregunta.palabras)) {
                puntosPosibles = pregunta.palabras.length * puntajesPorTipo.ordenarPalabra;
            }
            break;
        default:
            puntosPosibles = puntajesPorTipo[tipoPregunta];
    }

    // Mostrar los puntos posibles en el contenedor de la pregunta
    const questionContainer = document.getElementById('question-container');
    const puntosInfo = document.createElement('div');
    puntosInfo.className = 'puntos-info';
    puntosInfo.textContent = `Puntos posibles: ${puntosPosibles}`;
    questionContainer.insertBefore(puntosInfo, questionContainer.firstChild);

    // Mostrar la pregunta según su tipo
    switch (tipoPregunta) {
        case 'verdaderoFalso':
            inicializarVerdaderoFalso(pregunta, tipoPregunta);
            break;
        case 'alternativas':
            inicializarAlternativas(pregunta, tipoPregunta);
            break;
        case 'completarOracion':
            inicializarCompletarOracion(pregunta, tipoPregunta);
            break;
        case 'emparejamiento':
            inicializarEmparejamiento(pregunta, tipoPregunta);
            break;
        case 'ordenarPalabra':
            inicializarOrdenarPalabra(pregunta, tipoPregunta);
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

export const registrarPreguntaFallada = (tipo, indice) => {
    preguntasFalladas[tipo].add(indice);
};

const obtenerTotalPreguntasFalladas = () => {
    return Object.values(preguntasFalladas).reduce((total, set) => total + set.size, 0);
};

const mostrarFinJuego = () => {
    const totalFalladas = obtenerTotalPreguntasFalladas();
    const container = document.getElementById('question-container');
    container.innerHTML = `
        <div class="fin-juego">
            <h2>¡Juego Terminado!</h2>
            <p>${nombreJugador}, has completado todas las preguntas.</p>
            <p>Tu puntaje final es: ${puntaje.toFixed(1)}</p>
            <p>Has fallado en ${totalFalladas} pregunta${totalFalladas !== 1 ? 's' : ''}</p>
            <div class="botones-fin-juego">
                <button onclick="reiniciarJuego()" class="btn-reiniciar">Jugar de nuevo</button>
                ${totalFalladas > 0 ? `<button onclick="window.repasarFalladas()" class="btn-repasar">Repasar preguntas falladas</button>` : ''}
            </div>
        </div>
    `;
    document.getElementById('next-button').style.display = 'none';
}

const repasarFalladas = () => {
    // Limpiar el registro de preguntas usadas pero mantener las falladas
    Object.keys(preguntasUsadas).forEach(tipo => {
        preguntasUsadas[tipo].clear();
    });
    
    // Copiar las preguntas falladas a preguntas usadas
    Object.keys(preguntasFalladas).forEach(tipo => {
        preguntasFalladas[tipo].forEach(indice => {
            preguntasUsadas[tipo].add(indice);
        });
    });
    
    // Limpiar el registro de preguntas falladas
    Object.keys(preguntasFalladas).forEach(tipo => {
        preguntasFalladas[tipo].clear();
    });
    
    preguntaActual = 0;
    totalPreguntas = obtenerTotalPreguntasUsadas();
    actualizarProgreso();
    mostrarPregunta();
};

const obtenerTotalPreguntasUsadas = () => {
    return Object.values(preguntasUsadas).reduce((total, set) => total + set.size, 0);
};

const reiniciarJuego = () => {
    // Limpiar todos los registros
    Object.keys(preguntasUsadas).forEach(tipo => {
        preguntasUsadas[tipo].clear();
    });
    Object.keys(preguntasFalladas).forEach(tipo => {
        preguntasFalladas[tipo].clear();
    });
    
    preguntaActual = 0;
    puntaje = 0;
    
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
    document.getElementById('start-form').reset();
    document.querySelectorAll('.question-option').forEach(opt => opt.classList.remove('selected'));
}

export const mostrarPuntaje = (tipo, cantidad = 1) => {
    puntaje += puntajesPorTipo[tipo] * cantidad;
    document.getElementById('score').textContent = `Puntaje: ${puntaje.toFixed(1)}`;
}

// Inicializar el juego al cargar la página
window.onload = inicializarJuego;

// Hacer las funciones disponibles globalmente
window.repasarFalladas = repasarFalladas;
window.reiniciarJuego = reiniciarJuego;
