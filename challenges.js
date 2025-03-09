// Array de desafíos matemáticos
const challenges = [
    { question: '2 + 3 - 2 + 4 = ?', answer: 7 },
    { question: '14 + 4 - 8 + 2 = ?', answer: 12 },
    { question: '5 + 17  - 5 - 8 = ?', answer: 9 },
    { question: '10 - 4 + 6 - 8 = ?', answer: 4 },
    // Puedes añadir más desafíos aquí
];

let currentChallengeIndex = 0;

// Función para mostrar el desafío actual
function showCurrentChallenge() {
    const challenge = challenges[currentChallengeIndex];
    document.getElementById('challengeText').textContent = ` ${challenge.question}`;
}

// Función para verificar si todas las figuras han sido compradas
function allShapesPurchased() {
    // `shopItems` y `availableShapes` deben estar definidos en script.js como variables globales
    return shopItems.every(item => availableShapes.includes(item.name));
}

// Lógica del desafío matemático
document.getElementById('submitBtn').addEventListener('click', () => {
    const answer = parseInt(document.getElementById('challengeInput').value);
    const feedback = document.getElementById('feedback');

    if (answer === challenges[currentChallengeIndex].answer) {
        feedback.textContent = '¡Correcto! Ganaste 1 moneda.';
        coins++; // Variable global de script.js
        document.getElementById('coins').textContent = coins; // Actualiza las monedas en el DOM
        displayShop(); // Función global de script.js para actualizar la tienda

        // Verificar si todas las figuras han sido compradas
        if (allShapesPurchased()) {
            // Ocultar input y botón
            document.getElementById('challengeInput').style.display = 'none';
            document.getElementById('submitBtn').style.display = 'none';
            // Mostrar mensaje "PREPARADO A CREAR"
            document.getElementById('challengeText').textContent = 'PREPARADO A CREAR';
            document.getElementById('challengeText').style.color = '#ff0000'; // Rojo intenso
            document.getElementById('challengeText').style.fontWeight = 'bold'; // Negrita para mayor énfasis
        } else {
            // Si no están todas compradas, avanzar al siguiente desafío
            currentChallengeIndex = (currentChallengeIndex + 1) % challenges.length;
            showCurrentChallenge();
        }
    } else {
        feedback.textContent = 'Intenta de nuevo.';
    }

    document.getElementById('challengeInput').value = ''; // Limpiar el input
});

// Mostrar el primer desafío al cargar la página
showCurrentChallenge();