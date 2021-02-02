/*** DICE ROLLER ***/
/* Define HTML Elements */
const diceDiv = document.querySelector('#dice');
const diceButtons = diceDiv.firstElementChild.querySelectorAll('button');
const rollButton = Array.from(diceButtons).shift();
const diceInput = rollButton.previousElementSibling;

rollButton.addEventListener('click', function () { rollForInputValues(diceInput.value); });
/* Add listener here for 'enter' */
for (let i = 1; i < diceButtons.length; i++) {
    diceButtons[i].addEventListener('click', function () {
        print(rollDice(`1d${diceButtons[i].value}`, [1], [diceButtons[i].value]))
        // (display value, number of dice, die sides)
    });
}

function d(sides) { return Math.floor(Math.random() * sides) + 1; };

// Reads and prints for user-inputed roll value
function rollForInputValues(val) {
    try {
        if (!val) throw new Error('Please enter a roll value');

        // Separate input into sections based on instances of '+'
        const rolls = val.split('+');
        rolls.forEach(function (val, ind) {
            // Split based on '-'. Replace number values in new array with negative values.
            if (val.includes('-')) {
                const arr = rolls.splice(ind, 1)[0].split('-');
                arr.forEach(function (v) {
                    if (!v.includes('d')) v = `-${v}`;
                    rolls.splice(ind, 0, v);
                });
            }
        });

        // Create arrays to pass into 'rollDice'
        /* NOTE: Might be easier to read if 'rollDice' refactored to simply take an array of dice; [1d8, 1d6, etc] instead of 2 arrays */
        const numOfDice = [];
        const dieSides = [];
        let modifier = [];
        for (let i = 0; i < rolls.length; i++) {
            if (rolls[i].includes('d')) {
                numOfDice.push(Number(rolls[i].split('d')[0]));
                dieSides.push(Number(rolls[i].split('d')[1]));
            } else {
                modifier.push(Number(rolls[i]));
            }
        }

        // Reset input field
        diceInput.value = '';
        diceInput.focus();

        // Roll and print
        print(rollDice(val, numOfDice, dieSides, modifier));

    } catch (err) { handler(err); }
}

// Returns a readable message to display based while making dice rolls
// Template: '(1d8+1d6+5): 8, 6, 5 (19 total) - 12:34:56'
function rollDice(dispVal, numArr, sidesArr, modArr) {
    let message = `<span class="has-background-dark has-text-info-light" > ${dispVal}</span >`;
    let sum = 0;

    // For each value in 'numArr'...
    numArr.forEach(function (val, ind) {
        // Add a comma to 'message' for entry after the first one
        if (ind !== 0) { message += `,` };

        // Roll dice 'val' number of times; add rolls to 'message', and update 'sum' along the way
        for (let j = 0; j < val; j++) {
            const roll = d(sidesArr[ind]);
            message += ` ${roll}`;
            sum += roll;
        }
    });

    // If a modifier has been passed in, update 'sum' and 'message' accordingly
    if (modArr) {
        modArr.forEach(function (val) {
            message += `, ${val}`;
            sum += Number(val);
        });
    }

    // Finish 'message' with final 'sum' and a time stamp
    message += ` <strong class="has-text-primary-dark">    Toplam:</strong> <span class="is-size-3" >${sum} </span>`;
    message += '<span class="has-text-info" > ' + timeStamp() + ' </span> ';
    // Pass to 'allRollsMessage' to tack on previous rolls and save to localStorage
    message = allRollsMessage(message);
    return message;
}

// Template time stamp: ' - 12:34:56'
function timeStamp(message) {
    let date = new Date();
    return ` ${date.getHours()}:${date.getMinutes()}:<span class="is-size-6 has-text-grey-darker" > ${date.getSeconds()} </span>`;
}

// Construct a printable message from a new roll and up to 4 previous rolls
function allRollsMessage(newRoll) {
    previousRolls.unshift(newRoll);
    if (previousRolls.length > 5) { previousRolls.pop(); };
    let message = '<ol>';
    previousRolls.forEach(function (val) { message += `<li>${val}</li>`; });
    message += '</ol>';
    return message;
}

const previousRolls = [];



/*** DISPLAY ***/
const display = document.querySelector('#display');

function print(message) { display.innerHTML = message };
