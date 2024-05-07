let numSelected = null;
let tileSelected = null;
let errors = 0;
let solGrid = Array.from({ length: 9 }, () => Array(9).fill(''));
let newGrid = [];

let newGame = document.querySelector("#newGame");
let reset=document.querySelector("#reset");
function helper(row, col) {
    const list = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    if (row === solGrid.length) {
        return true;
    }
    let nrow = 0;
    let ncol = 0;
    if (col == solGrid.length - 1) {
        nrow = row + 1;
        ncol = 0;
    } else {
        nrow = row;
        ncol = col + 1;
    }
    if (solGrid[row][col] !== "") {
        if (helper(row, col)) {
            return true;
        }
    } else {
        let list = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        list = shuffleArray(list);
        for (const number of list) {
            if (safe(number, row, col)) {
                solGrid[row][col] = number;
                if (helper(nrow, ncol)) {
                    return true;
                } else {
                    solGrid[row][col] = "";
                }
            }
        }
    }
    return false;
}

function safe(num, row, col) {
    for (let i = 0; i < solGrid.length; i++) {
        if (solGrid[i][col] === num) {
            return false;
        }
    }
    for (let j = 0; j < solGrid.length; j++) {
        if (solGrid[row][j] === num) {
            return false;
        }
    }
    const sr = 3 * Math.floor(row / 3);
    const sc = 3 * Math.floor(col / 3);
    for (let i = sr; i < sr + 3; i++) {
        for (let j = sc; j < sc + 3; j++) {
            if (solGrid[i][j] === num) {
                return false;
            }
        }
    }
    return true;
}

function generateGrid() {
    helper(0, 0);
    return solGrid;
}

window.addEventListener("load",()=>{
    generateGrid();
    newGrid = grid();
    displaygrid();
});

newGame.addEventListener("click", () => {
  window.location.reload();
});
function resetTiles() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            if (tile.style.backgroundColor === "aliceblue" || tile.style.backgroundColor === "rgb(199, 247, 199)") {
                tile.innerHTML = "";
                tile.style.backgroundColor = "white"; 
            }
        }
    }
}
reset.addEventListener("click",()=>{
    resetTiles();
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generatespace() {
    const num = Math.floor(Math.random() * 2) + 1;
    const uniqueNumbers = Array.from({ length: 9 }, (_, index) => index);

    if (num == 1) {
        const fourUniqueIndices = generateUniqueNumbers(4);
        return fourUniqueIndices;
    } else {
        const fiveUniqueIndices = generateUniqueNumbers(5);
        return fiveUniqueIndices;
    }

    function generateUniqueNumbers(count) {
        shuffleArray(uniqueNumbers);
        return uniqueNumbers.slice(0, count);
    }
}

function grid() {
    const newGrid = solGrid.map(row => [...row.map(cell => cell)]);
    for (let r = 0; r < 9; r++) {
        let arr = generatespace();
        for (let c = 0; c < 9; c++) {
            let isSpace = arr.includes(c);
            if (isSpace) {
                newGrid[r][c] = "";
            }
        }
    }
    return newGrid;
}

function displaygrid() {
    for (let i = 1; i < 10; i++) {
        let number = document.createElement("div");
        number.id = i;
        number.innerHTML = i;
        number.classList.add("number");
        number.addEventListener("click", selectNumber);
        document.getElementById("digits").appendChild(number);
    }

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.addEventListener("click", selectTile);

            document.getElementById("board").appendChild(tile);
            if (r == 2 || r == 5) {
                tile.classList.add("horizontal-line");
            }
            if (r == 3 || r == 6) {
                tile.classList.add("horizontal-line-top");
            }
            if (c == 2 || c == 5) {
                tile.classList.add("vertical-line");
            }
            if (c == 3 || c == 6) {
                tile.classList.add("vertical-line-left");
            }
            tile.innerHTML = newGrid[r][c];
        }
    }
}

function selectNumber() {
    if (numSelected !== null) {
        numSelected.classList.remove("number-selected");
    }
    numSelected = this;
    numSelected.classList.add("number-selected");
}

function selectTile() {
    if (numSelected) {
        if (this.innerHTML === "" || this.style.backgroundColor === "aliceblue") {
            this.innerHTML = numSelected.id;
            this.style.backgroundColor = "aliceblue";
        } else {
            alert("You cannot change the question.");
        }

        let coords = this.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);
        if (solGrid[r][c] != numSelected.id && this.style.backgroundColor === "aliceblue") {
            this.style.color = "coral";
        } else if (solGrid[r][c] == numSelected.id && this.style.backgroundColor === "aliceblue") {
            this.style.color = "black";
            this.style.backgroundColor = "#c7f7c7";
        }
    }
}




let verifyButton = document.querySelector("#verify");
verifyButton.addEventListener("click", () => {
    verifySudoku();
    openModal();
});

function openModal() {
    let modal = document.getElementById("myModal");
    let span = document.getElementById("closeModal");
     let tryAgainButton = document.getElementById("tryAgain");
     let newGameButton = document.getElementById("newGame-2");

    span.onclick = function() {
        modal.style.display = "none";
    };

    tryAgainButton.onclick = function() {
        resetTiles();
        modal.style.display = "none";
    };

    newGameButton.onclick = function() {
        window.location.reload();
        modal.style.display = "none";
        
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }

    modal.style.display = "block";
}

function verifySudoku() {
    let isSolved = true;

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            if (tile.innerHTML==solGrid[r][c]) {
                isSolved=true;
            } else {
                isSolved=false;
                break;
            }
        }
        if(!isSolved){
            break;
        }
    }

    let verificationResult = isSolved ? "You Won!" : "You Lost!";
    let tryAgainButton = document.getElementById("tryAgain");
    tryAgainButton.innerHTML = isSolved ? "Play Again" : "Try Again";
    let modalContent = document.getElementById("modalContent");
    modalContent.innerText = verificationResult;

    openModal();
}
let viewSol=document.getElementById("viewSol");
viewSol.addEventListener("click",()=>{
    if(viewSol.innerHTML=="View Solution"){
        viewSol.innerHTML="Hide Solution";
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
               
                let tile = document.getElementById(r.toString() + "-" + c.toString());
                if(tile.innerHTML=="" || tile.style.backgroundColor=="aliceblue"){
                    tile.innerHTML=solGrid[r][c];
                    tile.style.backgroundColor="rgb(199, 247, 199)";
                    tile.style.color="black";
                    
                }
            }
        }
        verifyButton.style.display="none";
    }
    else{
        viewSol.innerHTML="View Solution";
        verifyButton.style.display="block";
        resetTiles();
        
    }
})



