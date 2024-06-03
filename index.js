
let nivel = 0;
let posiciones;
let piezasAcertadas;
let maxPiezasAcertadas = 6;
let draggingCell = null;

function crearPuzzle(){
    nivel++;
    posiciones = [];
    piezasAcertadas = 0;
    maxPiezasAcertadas = nivel*nivel*6;
    
    const imagenPuzzle = obtenerImagenPuzzleSegunNivel(nivel);

    const containerGrid = document.getElementById("grid-container");
    containerGrid.innerHTML = '';

    containerGrid.style.gridTemplate =`repeat(${3*nivel}, 1fr) / repeat(${2*nivel}, 1fr)`;
    
    for(let i = 0; i<nivel*3; i++){
        for(let j = 0; j<nivel*2; j++){
            
            const pieza = document.createElement('div');
            pieza.id = `p${i}${j}`;
            pieza.className = 'pieza';
            pieza.style.backgroundImage = imagenPuzzle;
            pieza.style.backgroundSize = `${nivel*200}% ${nivel*300}%`;
            //pieza.setAttribute('style', `backgroun-size: ${nivel*200}% ${nivel*300}%`); 
            

            const pos = generarPosicionRandom();
            const posY = Math.floor(pos/10);
            const posX = pos%10;
            pieza.style.backgroundPosition = `${-posX*100}% ${-posY*100}%`;
            

            pieza.setAttribute('draggable', 'true');
            pieza.setAttribute('ondragstart', 'startDrag(event)');
            pieza.setAttribute('ondrop', 'drop(event)');
            pieza.setAttribute('ondragover', 'allowDrop(event)');

            //Para pantallas tactiles:
            pieza.addEventListener('touchstart', startTouch);
            pieza.addEventListener('touchmove', moveTouch);
            pieza.addEventListener('touchend', endTouch);

            containerGrid.appendChild(pieza);
            
            verificarPosicionCorrecta(pieza, ()=>piezasAcertadas++);
            document.querySelector(".acertadas").innerHTML = piezasAcertadas;
        }
    }
}

function obtenerImagenPuzzleSegunNivel(nivel){
    let imagenPuzzle;
    switch(nivel){
        case 1:
            imagenPuzzle = `url('images/nivel1.jpg')`;
            break;
        case 2:
            imagenPuzzle = `url('images/nivel2.jpg')`;
            break;
        case 3:
            imagenPuzzle = `url('images/nivel3.jpg')`;
            break;
        case 4:
            imagenPuzzle = `url('images/nivel4.jpg')`;
            break;
        default:
            imagenPuzzle = `url('images/nivel5.jpg')`;
    }
    
    return imagenPuzzle;
}

function generarPosicionRandom(){    
    let pos = Math.floor(Math.random()*2*nivel)  + 10 * Math.floor(Math.random()*3*nivel);

    let i = 0;
    while(i < posiciones.length ){
        if(posiciones[i] === pos){
            pos = Math.floor(Math.random()*2*nivel)  + 10 * Math.floor(Math.random()*3*nivel);
            i = 0;
        }
        else {
            i++;
        }
    }
    
    posiciones.push(pos);

    return pos;
}

function startDrag(event) {
    draggingCell = event.target;
    event.dataTransfer.setData("text/plain", ''); // Necesario para Firefox
    draggingCell.classList.add('dragging');
}

function allowDrop(event) {
    event.preventDefault();
}
//parte tactil
function startTouch(event) {
    draggingCell = event.target;
    event.preventDefault();

    // Obtén la posición del dedo táctil en relación con la posición actual del elemento
    const touch = event.touches[0];
    const offsetX = touch.clientX - draggingCell.getBoundingClientRect().left;
    const offsetY = touch.clientY - draggingCell.getBoundingClientRect().top;

    // Guarda las posiciones iniciales
    draggingCell.initialX = touch.clientX - offsetX;
    draggingCell.initialY = touch.clientY - offsetY;

    draggingCell.classList.add('dragging');

    // Establece las posiciones iniciales left y top del elemento arrastrado
    draggingCell.style.left = draggingCell.initialX + 'px';
    draggingCell.style.top = draggingCell.initialY + 'px';
    
}

function moveTouch(event) {
    if (draggingCell) {
        event.preventDefault();
        const touch = event.touches[0];

        // Calcula la posición actual del elemento arrastrado en relación con la posición del dedo táctil
        const offsetX = touch.clientX - draggingCell.offsetWidth / 2;
        const offsetY = touch.clientY - draggingCell.offsetHeight / 2;

        // Actualiza las propiedades left y top del elemento arrastrado
        draggingCell.style.left = offsetX + 'px';
        draggingCell.style.top = offsetY + 'px';
    }
    
}

function endTouch(event) {
    if (draggingCell) {
        event.preventDefault();
        const targetCell = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);

        if (targetCell && targetCell.classList.contains('pieza')) {
            realizarIntercambio(targetCell);
        }

        draggingCell.style.left = '';
        draggingCell.style.top = '';
        draggingCell.classList.remove('dragging');
        draggingCell = null;
    }
}   //Fin de parte tactil

function drop(event) {
    event.preventDefault();
    const targetCell = event.target;

    realizarIntercambio(targetCell);

    // Restaura el estilo de arrastre
    draggingCell.classList.remove('dragging');
    draggingCell = null;
}

function realizarIntercambio(targetCell) {
    // Intercambia el contenido solo si la celda de destino es diferente de la celda de origen
    if (draggingCell !== targetCell) {
        const sacadoIncorrecto = esSacadoIncorrecto(draggingCell, targetCell);

        const tempBackground = draggingCell.style.backgroundImage;
        const tempPosition = getComputedStyle(draggingCell).backgroundPosition;

        draggingCell.style.backgroundImage = targetCell.style.backgroundImage;
        draggingCell.style.backgroundPosition = getComputedStyle(targetCell).backgroundPosition;

        targetCell.style.backgroundImage = tempBackground;
        targetCell.style.backgroundPosition = tempPosition;

        draggingCell.style.backgroundSize = `${nivel*200}% ${nivel*300}%`;
        targetCell.style.backgroundSize = `${nivel*200}% ${nivel*300}%`;

        if(!sacadoIncorrecto)
            verificarIntercambio(draggingCell, targetCell);
    }
    document.querySelector(".acertadas").innerHTML = piezasAcertadas;
}


function verificarPosicionCorrecta(pieza, accion){
    let esPosicionCorrecta = false;
    
    const numId = parseInt(pieza.id.replace('p',''));

    let posX = parseInt(getComputedStyle(pieza).backgroundPositionX.replace('%',''))/100;
    posX = posX === 0 ? posX : posX *(-1);
    let posY = parseInt(getComputedStyle(pieza).backgroundPositionY.replace('%',''))/100;
    posY = posY === 0 ? posY : posY *(-1);
    
    const numPos = posY * 10 + posX;
    
    if(numId === numPos){
        accion();
        esPosicionCorrecta = true;
    }

    return esPosicionCorrecta;
}

function esSacadoIncorrecto(celdaArrastrada, celdaObjetivo){
    let sacadoIncorrecto = verificarPosicionCorrecta(celdaArrastrada, ()=>{
        piezasAcertadas --;
    });

    sacadoIncorrecto = verificarPosicionCorrecta(celdaObjetivo, ()=>{
        piezasAcertadas --;
    });

    return sacadoIncorrecto;
}

function verificarIntercambio(celdaArrastrada, celdaObjetivo){
    const accionPosicionCorrecta = () =>{
        piezasAcertadas ++;
        if(piezasAcertadas === maxPiezasAcertadas)
            {
                console.log("PUZZLE COMPLETADO");
                crearPuzzle()
            }
    };

    verificarPosicionCorrecta(celdaObjetivo, accionPosicionCorrecta);

    verificarPosicionCorrecta(celdaArrastrada, accionPosicionCorrecta);

    
}

const modal = document.querySelector(".modal");
const elemento = document.querySelector(".ver-imagen");

function mostrarImagenCompleta(){
    modal.style.display = "block";
    modal.style.backgroundImage = obtenerImagenPuzzleSegunNivel(nivel);
    console.log("presionado");
}

elemento.addEventListener("click", mostrarImagenCompleta);

function cerrarModal(){
    modal.style.display = "none";
}

document.addEventListener('DOMContentLoaded', ()=> crearPuzzle());