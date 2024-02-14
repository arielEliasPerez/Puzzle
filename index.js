
const nivel = 1;
let posiciones = [];

function crearPuzzle(){
    console.log("Probando que ande");
    //console.log(Math.floor(Math.random()*2)  + 10 * Math.floor(Math.random()*3));
    const containerGrid = document.getElementById("grid-container");

    containerGrid.style.gridTemplate ="repeat(3, 1fr) / repeat(2, 1fr)";

    for(let i = 0; i<nivel*3; i++){
        for(let j = 0; j<nivel*2; j++){
            const celda =document.createElement('div');
            celda.id = `c${i}${j}`;
            celda.className = 'celda';

            const pieza =document.createElement('div');
            pieza.id = `p${i}${j}`;
            pieza.className = 'pieza';

            const pos = generarPosicionRandom();
            console.log(pos);
            const posY = Math.floor(pos/10);
            console.log(posY);
            const posX = pos%10;

            pieza.style.backgroundPosition = `${-posX*100}% ${-posY*100}%`;
            //pieza.style.backgroundPosition = `${-j*100}% ${-i*100}%`;
            pieza.setAttribute('draggable', 'true');
            pieza.setAttribute('ondragstart', 'startDrag(event)');
            pieza.setAttribute('ondrop', 'drop(event)');
            pieza.setAttribute('ondragover', 'allowDrop(event)');

            celda.appendChild(pieza);
            containerGrid.appendChild(celda);
        }
    }
}

function generarPosicionRandom(){
    //const posX = Math.floor(Math.random()*4);
    //const posY = Math.floor(Math.random()*3);
    
    let pos = Math.floor(Math.random()*2)  + 10 * Math.floor(Math.random()*3);

    let i = 0;
    while(i < posiciones.length ){
        if(posiciones[i] === pos){
            pos = Math.floor(Math.random()*2)  + 10 * Math.floor(Math.random()*3);
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

function drop(event) {
    event.preventDefault();
    const targetCell = event.target;

    // Intercambia el contenido solo si la celda de destino es diferente de la celda de origen
    if (draggingCell !== targetCell) {
        const tempBackground = draggingCell.style.backgroundImage;
        const tempPosition = getComputedStyle(draggingCell).backgroundPosition;

    draggingCell.style.background = targetCell.style.backgroundImage;
    draggingCell.style.backgroundPosition = getComputedStyle(targetCell).backgroundPosition;

    targetCell.style.backgroundImage = tempBackground;
    targetCell.style.backgroundPosition = tempPosition;

        const temp2 = draggingCell.innerHTML;
        draggingCell.innerHTML = targetCell.innerHTML;
        targetCell.innerHTML = temp2;
    }

    // Restaura el estilo de arrastre
    draggingCell.classList.remove('dragging');
    draggingCell = null;
}

document.addEventListener('DOMContentLoaded', ()=> crearPuzzle());