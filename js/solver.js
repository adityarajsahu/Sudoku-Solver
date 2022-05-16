function clone(table) {
    return JSON.parse(JSON.stringify(table));
}

function arraysEqual(arr1, arr2) {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
}

function valid(table, number, x, y) {
    let current = table[x - 1][y - 1];
    table[x - 1][y - 1] = "";
    let row = table[x - 1];
    let column = [];
    for (let arow of table) 
    {
        column.push(arow[y - 1]);
    }
    if (row.includes(number) || column.includes(number)) 
    {
        table[x - 1][y - 1] = current;
        return false;
    }
    let square = [Math.floor((x - 1) / 3), Math.floor((y - 1) / 3)];
    let values = [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"]];
    let rows = values[square[0]];
    let cols = values[square[1]];
    for (let i of rows) 
    {
        for (let j of cols) 
        {
            if (number === table[i - 1][j - 1]) 
            {
                table[x - 1][y - 1] = current;
                return false;
            }
        }
    }
    table[x - 1][y - 1] = current;
    return true;
}

function validPossibilities(table, x, y) {
    let possibilities = [];
    for (let i = 1; i <= 9; i++) 
    {
        if (valid(table, i.toString(), x, y)) 
        {
            possibilities.push(i.toString());
        }
    }
    return possibilities;
}

function firstEmpty(table) {
    for (let i = 0; i < 9; i++) 
    {
        for (let j = 0; j < 9; j++) 
        {
            if (table[i][j] === "") 
            {
                return [i + 1, j + 1];
            }
        }
    }
    return null;
}

function getSolutionUtil(table) {
    let first = firstEmpty(table);
    if (first !== null) 
    {
        let possibilities = validPossibilities(table, ...first);
        if (possibilities.length === 0) 
        {
            return undefined;
        }

        for (let value of possibilities) 
        {
            table[first[0] - 1][first[1] - 1] = value.toString();
            let solution = getSolutionUtil(clone(table));
            if (solution !== undefined) 
            {
                return solution;
            }
        }
    } 
    else 
    {
        return table;
    }
}

function getSolution(table) {
    table = clone(table);
    let tableClone = [];
    while (!arraysEqual(table, tableClone)) 
    {
        tableClone = clone(table);
        for (let i = 1; i <= 9; i++) 
        {
            for (let j = 1; j <= 9; j++) 
            {
                if (table[i - 1][j - 1] === "") 
                {
                    let possibilities = validPossibilities(table, i, j);
                    if (possibilities.length === 1) 
                    {
                        table[i - 1][j - 1] = possibilities[0];
                    }
                }
            }
        }
    }
    let solution = getSolutionUtil(table);
    return solution;
}

function validTable(table) {
    for (let i = 1; i <= 9; i++) 
    {
        for (let j = 1; j <= 9; j++) 
        {
            if (table[i - 1][j - 1] !== "") 
            {
                if (!valid(table, table[i - 1][j - 1], i, j)) 
                {
                    return false;
                }
            }
        }
    }
    return true;
}

function convertToArray(table) {
    newtable = [];
    for (let i = 0; i < table.length; i++) 
    {
        for (let j = 0; j < table[i].length; j++) 
        {
            newtable.push(table[i][j]);
        }
    }
    return newtable;
}

function convertTo2DMatrix(table) {
    newtable = [[], [], [], [], [], [], [], [], []];
    for (let i = 0; i < 9; i++) 
    {
        for (let j = 0; j < 9; j++) 
        {
            newtable[i].push(table[i * 9 + j]);
        }
    }
    return newtable;
}

function getTable() {
    let table = [];
    let board = document.getElementById("board");
    let boardInputs = board.getElementsByTagName("input");
    for (let element of boardInputs) 
    {
        table.push(element.value);
    }
    return convertTo2DMatrix(table);
}

function setTable(table) {
    table = convertToArray(table);
    let board = document.getElementById("board");
    let boardInputs = board.getElementsByTagName("input");
    for (let i = 0; i < boardInputs.length; i++) 
    {
        boardInputs[i].value = table[i];
    }
}

function checkValidCharacters(table) {
    let chars = ["", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    for (let row of table) 
    {
        for (let item of row) 
        {
            if (!chars.includes(item)) 
            {
                return false;
            }
        }
    }
    return true;
}

function clearError() {
    let error = document.getElementById("error");
    error.innerHTML = "";
}

function showError(message) {
    clearError();
    let error = document.getElementById("error");
    let newalert = document.createElement("div");
    newalert.setAttribute("class", "alert alert-primary");
    newalert.setAttribute("role", "alert");
    newalert.innerHTML = message;
    let newbutton = document.createElement("button");
    newbutton.setAttribute("type", "button");
    newbutton.setAttribute("class", "close");
    newbutton.setAttribute("onclick", "clearError()");
    let newspan = document.createElement("span");
    newspan.innerHTML = "&times;";
    newbutton.appendChild(newspan);
    newalert.appendChild(newbutton);
    error.appendChild(newalert);
}

function clearStatus() {
    let status = document.getElementById("status");
    status.innerHTML = "";
}

function setStatus(message) {
    clearStatus();
    let status = document.getElementById("status");
    let newalert = document.createElement("div");
    newalert.setAttribute("class", "alert alert-primary");
    newalert.setAttribute("role", "alert");
    newalert.innerHTML = message;
    status.appendChild(newalert);
}

function solve() {
    let table = getTable();
    if (!checkValidCharacters(table)) 
    {
        showError("Invalid character");
    } 
    else 
    {
        if (!validTable(table)) 
        {
            showError("Invalid puzzle");
        } 
        else 
        {
            let start = Date.now();
            let solution = getSolution(table);
            let end = Date.now();
            let totaltime = (end - start) / 1000;
            if (solution === undefined) 
            {
                showError("No solution found");
            } 
            else 
            {
                clearError();
                setTable(solution);
                setStatus(`Solution found in ${totaltime} seconds`);
            }
        }
    }
}

function main() {
    let board = document.getElementById("board");
    for (let i = 0; i < 9; i++) 
    {
        for (let j = 0; j < 9; j++) 
        {
            let newdiv = document.createElement("div");
            newdiv.classList.add("num");

            if (i === 2 || i === 5) 
            {
                newdiv.classList.add("pad-bot");
            } 
            else if (i === 3 || i === 6) 
            {
                newdiv.classList.add("pad-top");
            }

            if (j === 2 || j === 5) 
            {
                newdiv.classList.add("pad-right");
            } 
            else if (j === 3 || j === 6) 
            {
                newdiv.classList.add("pad-left");
            }
            
            let newinput = document.createElement("input");
            newinput.setAttribute("type", "text");
            newinput.setAttribute("class", "form-control input");
            newinput.setAttribute("maxlength", "1");
            newdiv.appendChild(newinput);
            board.appendChild(newdiv);
        }
    }
}

window.addEventListener("load", main);