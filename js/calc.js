/*** CALCULATOR ***/
// BUG: Pressing '+-' button is full of bugs
// '56' then '+-' shows '-0'; evaluates to '-056' on '='
// NOTE: Add commas at proper places
// Create a printCalc function to call
// It will add commas to a new variable w/o altering calc.input or .rootNum

/* Define HTML Elements */
const calcDiv = document.querySelector('#calculator');
const calcTable = calcDiv.firstElementChild.firstElementChild;

const calcNodes = {
    calcDisp: calcTable.querySelector('input'),
    calcNum: calcTable.querySelectorAll('.number'),
    calcOp: calcTable.querySelectorAll('.operator'),
    calcOther: calcTable.querySelectorAll('.calc-func')
}

// Add event listeners for numbers and operators
calcNodes.calcNum.forEach(
    function (node) { node.addEventListener('click', numberClick) });
calcNodes.calcOp.forEach(
    function (node) { node.addEventListener('click', operatorClick) });

// Add functionality to other buttons
// CE, clear entry; display 0, reset calc.input, keep calc.rootNum
calcNodes.calcOther[0].addEventListener('click', function () {
    e.preventDefault();
    calcNodes.calcDisp.value = 0;
    calc.input = '';
});
// C, clear; reset all values
calcNodes.calcOther[1].addEventListener('click', function () {
    e.preventDefault();
    calcNodes.calcDisp.value = 0;
    calc.input = '';
    calc.rootNum = 0;
    calc.operator = 'plus';
});
// Backspace; remove last number from calc.input and display new value or 0
calcNodes.calcOther[2].addEventListener('click', function () {
    e.preventDefault();
    calc.input = calc.input.substring(0, calc.input.length - 1);
    if (calc.input) calcNodes.calcDisp.value = calc.input;
    else calcNodes.calcDisp.value = 0;
});
// Negation button; add or remove a '-' before rootNum
/* NOTE: Display '-' more consistenly when dealing with negative nums */
calcNodes.calcOther[3].addEventListener('click', function () {
    e.preventDefault();
    if (calc.rootNum[0] === '-') calc.rootNum = calc.rootNum.substring(1, calc.rootNum.length);
    else calc.rootNum = '-' + calc.rootNum;
    calcNodes.calcDisp.value = calc.rootNum;
});

const calc = {
    rootNum: 0,
    input: '',
    operator: 'plus'
}

function numberClick(e) {
    e.preventDefault();

    // If '=' was just clicked, reset calc values
    if (calc.operator === 'equals') {
        calc.rootNum = 0;
        calc.operator = 'plus';
    }

    // Add number to calc.input, adding a 0 before solitary decimals
    // 'else if' statement prevents stringing multiple zeroes
    if (e.target.value !== '0') {
        if (e.target.value === '.' && calc.input === '') calc.input += '0';
        calcNodes.calcDisp.value = calc.input += e.target.value;
    } else if (calc.input !== '0') {
        calcNodes.calcDisp.value = calc.input += e.target.value;
    }
};

function operatorClick(e) {
    e.preventDefault();

    // Perform equation: [ rootNum (operator) input ]
    if (calc.input !== '') {
        switch (calc.operator) {
            case 'plus':
                if (calc.operator != 'equals') calc.rootNum += Number(calc.input);
                break;
            case 'minus':
                if (calc.operator != 'equals') calc.rootNum -= Number(calc.input);
                break;
            case 'times':
                if (calc.operator != 'equals') calc.rootNum *= Number(calc.input);
                break;
            case 'divide':
                if (calc.operator != 'equals') calc.rootNum /= Number(calc.input);
                break;
            case 'equals':
                if (calc.operator != 'equals') calc.rootNum = Number(calc.input);
                break;
            // default:
            // 	console.error('somethings wrong');
        }
    }

    // Display new value, set next operator, and reset input value
    calcNodes.calcDisp.value = calc.rootNum;
    calc.operator = e.target.name;
    calc.input = '';
}

