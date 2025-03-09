// Obtener elementos del DOM
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const circleBtn = document.getElementById('circleBtn');
const squareBtn = document.getElementById('squareBtn');
const triangleBtn = document.getElementById('triangleBtn');
const coinsDisplay = document.getElementById('coins');
const resetBtn = document.getElementById('resetBtn');
const deleteShapeBtn = document.getElementById('deleteShapeBtn');
const rotateLeftBtn = document.getElementById('rotateLeftBtn');
const rotateRightBtn = document.getElementById('rotateRightBtn');

// Variables de estado
let currentShape = 'circle';
let coins = 0;
let shapes = [];
let selectedShape = null;
let offsetX, offsetY;
let availableShapes = ['circle', 'square', 'triangle'];
let rotationAngle = 0;

// Definir los ítems en la tienda
const shopItems = [
    { name: 'Rectángulo Pequeño', type: 'rectangle', width: 20, height: 10, cost: 2 },
    { name: 'Rectángulo Mediano', type: 'rectangle', width: 40, height: 20, cost: 3 },
    { name: 'Rectángulo Grande', type: 'rectangle', width: 60, height: 30, cost: 4 },
    { name: 'Deltoide', type: 'deltoid', width: 80, height: 40, cost: 5 },
    { name: 'Óvalo', type: 'oval', width: 60, height: 30, cost: 5 },
    { name: 'Trapecio', type: 'trapezoid', width: 70, height: 35, cost: 5 },
    { name: 'Paralelogramo', type: 'parallelogram', width: 50, height: 25, cost: 5 },
    { name: 'Hexágono', type: 'hexagon', width: 60, height: 34.64, cost: 5 }
];

// Función para mostrar la tienda
function displayShop() {
    const availableItemsDiv = document.getElementById('availableItems');
    if (!availableItemsDiv) {
        console.error("El elemento #availableItems no se encuentra en el DOM.");
        return;
    }
    availableItemsDiv.innerHTML = ''; // Limpiar el cuadro de compras disponibles
    shopItems.forEach(item => {
        const button = document.createElement('button');
        button.textContent = `${item.name} (${item.width}x${item.height}) - ${item.cost} monedas`;
        const isPurchased = availableShapes.includes(item.name);
        button.disabled = coins < item.cost || isPurchased;
        button.addEventListener('click', () => buyItem(item));
        availableItemsDiv.appendChild(button);
    });
}

// Función para comprar un item
function buyItem(item) {
    if (coins >= item.cost) {
        coins -= item.cost;
        coinsDisplay.textContent = coins;
        availableShapes.push(item.name);
        alert(`¡Has comprado ${item.name}!`);
        displayShop(); // Refrescar la tienda
        addShapeButton(item); // Añadir botón para seleccionar la figura
    } else {
        alert('No tienes suficientes monedas.');
    }
}

// Función para añadir botones de selección de figuras desbloqueadas
function addShapeButton(item) {
    const shopControlsDiv = document.querySelector('.shop-controls');
    const button = document.createElement('button');
    button.textContent = item.name;
    button.addEventListener('click', () => {
        currentShape = item.name;
        highlightSelectedButton(button);
    });
    shopControlsDiv.appendChild(button);
}

// Función para resaltar el botón seleccionado
function highlightSelectedButton(selectedButton) {
    const buttons = document.querySelectorAll('.shop-controls button');
    buttons.forEach(button => {
        if (button === selectedButton) {
            button.classList.add('selected-button');
        } else {
            button.classList.remove('selected-button');
        }
    });
}

// Función para dibujar la cuadrícula
function drawGrid() {
    const gridSize = 20;
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// Función para dibujar una figura individual
function drawShape(shape, isSelected) {
    ctx.save(); // Guardar el estado actual del lienzo
    ctx.translate(shape.x, shape.y); // Mover al centro de la figura
    ctx.rotate(shape.rotation); // Aplicar rotación
    ctx.fillStyle = shape.color;
    
    ctx.beginPath();
    if (shape.type === 'circle') {
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
    } else if (shape.type === 'square') {
        ctx.rect(-20, -20, 40, 40);
    } else if (shape.type === 'triangle') {
        ctx.moveTo(0, -20);
        ctx.lineTo(-20, 20);
        ctx.lineTo(20, 20);
        ctx.closePath();
    } else if (shape.type === 'rectangle') {
        const item = shopItems.find(i => i.name === shape.name);
        if (item) {
            ctx.rect(-item.width / 2, -item.height / 2, item.width, item.height);
        }
    } else if (shape.type === 'deltoid') {
        const item = shopItems.find(i => i.name === shape.name);
        if (item) {
            const halfWidth = item.width / 2;
            const halfHeight = item.height / 2;
            ctx.moveTo(0, -halfHeight); // Punto superior
            ctx.lineTo(halfWidth, 0);   // Punto derecho
            ctx.lineTo(0, halfHeight);  // Punto inferior
            ctx.lineTo(-halfWidth, 0);  // Punto izquierdo
            ctx.closePath();
        }
    } else if (shape.type === 'oval') {
        const item = shopItems.find(i => i.name === shape.name);
        if (item) {
            ctx.ellipse(0, 0, item.width / 2, item.height / 2, 0, 0, Math.PI * 2);
        }
    } else if (shape.type === 'trapezoid') {
        const item = shopItems.find(i => i.name === shape.name);
        if (item) {
            const halfWidth = item.width / 2;
            const halfHeight = item.height / 2;
            ctx.moveTo(-halfWidth, -halfHeight);      // Esquina superior izquierda
            ctx.lineTo(halfWidth, -halfHeight);       // Esquina superior derecha
            ctx.lineTo(halfWidth * 0.6, halfHeight);  // Esquina inferior derecha (base más corta)
            ctx.lineTo(-halfWidth * 0.6, halfHeight); // Esquina inferior izquierda
            ctx.closePath();
        }
    } else if (shape.type === 'parallelogram') {
        const item = shopItems.find(i => i.name === shape.name);
        if (item) {
            const halfWidth = item.width / 2;
            const halfHeight = item.height / 2;
            ctx.moveTo(-halfWidth + 10, -halfHeight); // Esquina superior izquierda (desplazada)
            ctx.lineTo(halfWidth + 10, -halfHeight);  // Esquina superior derecha (desplazada)
            ctx.lineTo(halfWidth - 10, halfHeight);   // Esquina inferior derecha
            ctx.lineTo(-halfWidth - 10, halfHeight);  // Esquina inferior izquierda
            ctx.closePath();
        }
    } else if (shape.type === 'hexagon') {
        const item = shopItems.find(i => i.name === shape.name);
        if (item) {
            const radius = item.width / 2; // Radio del hexágono
            ctx.moveTo(radius, 0); // Punto inicial (derecha)
            for (let i = 1; i < 6; i++) {
                const angle = (Math.PI / 3) * i; // 60 grados por lado
                ctx.lineTo(radius * Math.cos(angle), radius * Math.sin(angle));
            }
            ctx.closePath();
        }
    }
    ctx.fill();
    
    if (isSelected) {
        ctx.strokeStyle = '#FFFF00';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
    
    ctx.restore(); // Restaurar el estado del lienzo
}

// Función para redibujar todo el lienzo
function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    shapes.forEach(shape => {
        const isSelected = (shape === selectedShape);
        drawShape(shape, isSelected);
    });
}

// Evento para agregar una nueva figura al hacer clic izquierdo
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Si se hace clic fuera de cualquier figura, deseleccionar
    let clickedOnShape = false;
    for (let shape of shapes) {
        if (isMouseOverShape(shape, x, y)) {
            clickedOnShape = true;
            break;
        }
    }
    
    if (!clickedOnShape) {
        selectedShape = null;
        redraw();
    }
    
    // Solo agregar una nueva figura si no hay ninguna seleccionada y no se hizo clic en una existente
    if (!selectedShape && !clickedOnShape) {
        const newShape = {
            type: availableShapes.includes(currentShape) ? 
                  (currentShape === 'Deltoide' ? 'deltoid' : 
                   currentShape === 'Óvalo' ? 'oval' :
                   currentShape === 'Trapecio' ? 'trapezoid' :
                   currentShape === 'Paralelogramo' ? 'parallelogram' :
                   currentShape === 'Hexágono' ? 'hexagon' :
                   currentShape.startsWith('Rectángulo') ? 'rectangle' : currentShape) : currentShape,
            name: currentShape,
            x: x,
            y: y,
            color: colorPicker.value,
            rotation: 0 // Agregar propiedad de rotación
        };
        shapes.push(newShape);
        redraw();
    }
});

// Evento para deseleccionar con clic derecho
canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault(); // Evitar que aparezca el menú contextual del navegador
    if (selectedShape) {
        selectedShape = null;
        redraw();
    }
});

// Evento para seleccionar una figura con clic izquierdo
canvas.addEventListener('mousedown', (e) => {
    if (e.button === 0) { // Clic izquierdo
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        let clickedOnShape = false;
        shapes.forEach(shape => {
            if (isMouseOverShape(shape, mouseX, mouseY)) {
                selectedShape = shape;
                offsetX = mouseX - shape.x;
                offsetY = mouseY - shape.y;
                clickedOnShape = true;
                redraw();
            }
        });
        if (!clickedOnShape) {
            selectedShape = null;
            redraw();
        }
    }
});

// Evento para mover la figura seleccionada
canvas.addEventListener('mousemove', (e) => {
    if (selectedShape) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        selectedShape.x = mouseX - offsetX;
        selectedShape.y = mouseY - offsetY;
        redraw();
    }
});

// Evento para soltar la figura
canvas.addEventListener('mouseup', () => {
    redraw();
});

// Función para verificar si el mouse está sobre una figura
function isMouseOverShape(shape, mouseX, mouseY) {
    if (shape.type === 'circle') {
        const dx = mouseX - shape.x;
        const dy = mouseY - shape.y;
        return dx * dx + dy * dy <= 20 * 20;
    } else if (shape.type === 'square') {
        return mouseX >= shape.x - 20 && mouseX <= shape.x + 20 &&
               mouseY >= shape.y - 20 && mouseY <= shape.y + 20;
    } else if (shape.type === 'triangle') {
        return mouseX >= shape.x - 20 && mouseX <= shape.x + 20 &&
               mouseY >= shape.y - 20 && mouseY <= shape.y + 20;
    } else if (shape.type === 'rectangle') {
        const item = shopItems.find(i => i.name === shape.name);
        if (item) {
            const halfWidth = item.width / 2;
            const halfHeight = item.height / 2;
            return mouseX >= shape.x - halfWidth && mouseX <= shape.x + halfWidth &&
                   mouseY >= shape.y - halfHeight && mouseY <= shape.y + halfHeight;
        }
    } else if (shape.type === 'deltoid') {
        const item = shopItems.find(i => i.name === shape.name);
        if (item) {
            const halfWidth = item.width / 2;
            const halfHeight = item.height / 2;
            return mouseX >= shape.x - halfWidth && mouseX <= shape.x + halfWidth &&
                   mouseY >= shape.y - halfHeight && mouseY <= shape.y + halfHeight;
        }
    } else if (shape.type === 'oval') {
        const item = shopItems.find(i => i.name === shape.name);
        if (item) {
            const halfWidth = item.width / 2;
            const halfHeight = item.height / 2;
            const dx = mouseX - shape.x;
            const dy = mouseY - shape.y;
            return (dx * dx) / (halfWidth * halfWidth) + (dy * dy) / (halfHeight * halfHeight) <= 1;
        }
    } else if (shape.type === 'trapezoid') {
        const item = shopItems.find(i => i.name === shape.name);
        if (item) {
            const halfWidth = item.width / 2;
            const halfHeight = item.height / 2;
            return mouseX >= shape.x - halfWidth && mouseX <= shape.x + halfWidth &&
                   mouseY >= shape.y - halfHeight && mouseY <= shape.y + halfHeight;
        }
    } else if (shape.type === 'parallelogram') {
        const item = shopItems.find(i => i.name === shape.name);
        if (item) {
            const halfWidth = item.width / 2;
            const halfHeight = item.height / 2;
            return mouseX >= shape.x - halfWidth - 10 && mouseX <= shape.x + halfWidth + 10 &&
                   mouseY >= shape.y - halfHeight && mouseY <= shape.y + halfHeight;
        }
    } else if (shape.type === 'hexagon') {
        const item = shopItems.find(i => i.name === shape.name);
        if (item) {
            const radius = item.width / 2;
            const dx = mouseX - shape.x;
            const dy = mouseY - shape.y;
            return dx * dx + dy * dy <= radius * radius; // Aproximación circular
        }
    }
    return false;
}

// Eventos para seleccionar la forma predeterminada
circleBtn.addEventListener('click', () => currentShape = 'circle');
squareBtn.addEventListener('click', () => currentShape = 'square');
triangleBtn.addEventListener('click', () => currentShape = 'triangle');

// Evento para resetear el lienzo
resetBtn.addEventListener('click', () => {
    shapes = [];
    selectedShape = null; // Asegurarse de deseleccionar al resetear
    redraw();
});

// Evento para borrar la figura seleccionada
deleteShapeBtn.addEventListener('click', () => {
    if (selectedShape) {
        const index = shapes.indexOf(selectedShape);
        if (index > -1) {
            shapes.splice(index, 1);
        }
        selectedShape = null;
        redraw();
    } else {
        alert('Por favor, selecciona una figura para borrar.');
    }
});

// Eventos para rotar la figura seleccionada
rotateLeftBtn.addEventListener('click', () => {
    if (selectedShape) {
        selectedShape.rotation -= Math.PI / 18; // Rotar 10 grados a la izquierda
        redraw();
    } else {
        alert('Por favor, selecciona una figura para rotar.');
    }
});

rotateRightBtn.addEventListener('click', () => {
    if (selectedShape) {
        selectedShape.rotation += Math.PI / 18; // Rotar 10 grados a la derecha
        redraw();
    } else {
        alert('Por favor, selecciona una figura para rotar.');
    }
});

// Inicializar la tienda al cargar la página
displayShop();

// Resaltar el botón de la figura actual
const firstButton = document.querySelector('.shop-controls button');
if (firstButton) {
    highlightSelectedButton(firstButton);
}

// Dibujar la cuadrícula inicialmente
drawGrid();