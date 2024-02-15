
let nivel = 0;
let posiciones = [];
let piezasAcertadas = 0;
let maxPiezasAcertadas = 6;
let draggingCell = null;

function crearPuzzle(){
    nivel++;
    posiciones = [];
    piezasAcertadas = 0;
    maxPiezasAcertadas = nivel*nivel*6;

    const containerGrid = document.getElementById("grid-container");
    containerGrid.innerHTML = '';

    containerGrid.style.gridTemplate =`repeat(${3*nivel}, 1fr) / repeat(${2*nivel}, 1fr)`;
    //getComputedStyle(document.querySelector('.pieza')).backgroundSize = `${-posX*100}% ${-posY*100}%`;
    for(let i = 0; i<nivel*3; i++){
        for(let j = 0; j<nivel*2; j++){
            
            const pieza = document.createElement('div');
            pieza.id = `p${i}${j}`;
            pieza.className = 'pieza';
            cambiarBackground(pieza);
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

            containerGrid.appendChild(pieza);
            
            verificarPosicionCorrecta(pieza, ()=>piezasAcertadas++);
        }
    }
}

function cambiarBackground(pieza){
    switch(nivel){
        case 1:
            pieza.style.backgroundImage = `url('images/nivel1.jpg')`;
            break;
        case 2:
            console.log('adentro');
            pieza.style.backgroundImage = `url('images/nivel2.jpg')`;
            break;
        case 3:
            pieza.style.backgroundImage = "url('images/nivel3.jpg')";
            break;
        case 4:
            pieza.style.backgroundImage = "url('images/nivel4.jpg')";
            break;
        default:
            pieza.style.backgroundImage = "url('images/nivel5.jpg')";
    }
    

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

function drop(event) {
    event.preventDefault();
    const targetCell = event.target;

    // Intercambia el contenido solo si la celda de destino es diferente de la celda de origen
    if (draggingCell !== targetCell) {
        const sacadoIncorrecto = esSacadoIncorrecto(draggingCell, targetCell);

        const tempBackground = draggingCell.style.backgroundImage;
        const tempPosition = getComputedStyle(draggingCell).backgroundPosition;
        
        draggingCell.style.background = targetCell.style.backgroundImage;
        draggingCell.style.backgroundPosition = getComputedStyle(targetCell).backgroundPosition;

        targetCell.style.backgroundImage = tempBackground;
        targetCell.style.backgroundPosition = tempPosition;

        draggingCell.style.backgroundSize = `${nivel*200}% ${nivel*300}%`;
        targetCell.style.backgroundSize = `${nivel*200}% ${nivel*300}%`;

        if(!sacadoIncorrecto)
            verificarIntercambio(draggingCell, targetCell);
    }

    // Restaura el estilo de arrastre
    draggingCell.classList.remove('dragging');
    draggingCell = null;
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

document.addEventListener('DOMContentLoaded', ()=> crearPuzzle());