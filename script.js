const input = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");
const history = document.querySelector(".history-list");
const saved = localStorage.getItem("calculatorHistory");

let nonIntegerInputs = ["/", "+", "*", "-"];
let output = "";
let historyArray = [];
let decimalSeperator = true;
let leadingZero = false;
let displayOutput = false;

if (saved) {
    historyArray = JSON.parse(saved);
    renderHistory(historyArray);
}

buttons.forEach(inputKey);

function inputKey(key) {
    key.addEventListener('click', () => {
        if (displayOutput && Number(key.innerText) < 10 && Number(key.innerText) >= 0) { // automatically clear output
            input.value = "";  
        };

        displayOutput = false;

        if (Number(key.innerText) < 10 && Number(key.innerText) > 0) { // always allow non-zero digits to be entered
            input.value += `${key.innerText}`;
            leadingZero = false;
        };

        if (key.innerText === "0") { 
            if (nonIntegerInputs.includes(input.value[input.value.length - 1]) || input.value.length === 0) { // enter leading zero
                leadingZero = true;
                input.value += `${key.innerText}`;
            }

            if (Number(input.value[input.value.length - 1]) < 10 
                && Number(input.value[input.value.length - 1]) >= 0 
                && !leadingZero
                || input.value[input.value.length - 1] === ".") { //
                input.value += `${key.innerText}`;
            }
        };

        if (nonIntegerInputs.includes(key.innerText) 
            && !nonIntegerInputs.includes(input.value[input.value.length - 1]) 
            && input.value.length !== 0) { // only allow operators to be entered if previous element wasn't an operator
            input.value += `${key.innerText}`;
            decimalSeperator = true;
        } else if (key.innerText === "-" && input.value[input.value.length - 1] !== "-") { // allows minus to be entered behind everything except another minus
            input.value += `${key.innerText}`;
            decimalSeperator = true;
        }

        if (key.innerText === "." 
            && decimalSeperator 
            && ((Number(input.value[input.value.length - 1])) < 10 || (Number(input.value[input.value.length - 1])) >= 0)) { // must have operator between decimal points and decimals must follow digit
            input.value += key.innerText;
            decimalSeperator = false;
            leadingZero = false;
        }

        if (key.innerText === "=") { // show output
            output = parseOperations(input.value);
            input.value = output;
            saveOutput(output);
            saveToLocalStorage(output);
            displayOutput = true;
            decimalSeperator = true;       
        }

        if (key.innerText === "AC") { // clear display
            input.value = "";
        }

        if (key.innerText === "CH") { // clear history
            history.innerHTML = "";
            localStorage.removeItem("calculatorHistory");
            historyArray = [];
        };
    });
};

function parseOperations(expression) {
    if (nonIntegerInputs.includes(expression[expression.length - 1])) {
        expression = expression.slice(0, expression.length - 1);
    }
    return eval(expression);
}

function saveOutput(output) {
    history.innerHTML = `<li class="results">${output}<li>` + history.innerHTML;
}

function saveToLocalStorage(newEntry) {
    historyArray.push(newEntry);
    localStorage.setItem("calculatorHistory", JSON.stringify(historyArray));
}

function renderHistory(historyArray) {
    historyArray.forEach((entry) => {
        history.innerHTML = `<li class="results">${entry}<li>` + history.innerHTML;
    })
}