
/*** INITIATIVE TRACKER */
/* Define HTML Elements */
const initiativeTracker = document.querySelector('#initiative');
// Tracker left side
const leftDiv = initiativeTracker.firstElementChild.firstElementChild.nextElementSibling;
const name = leftDiv.firstElementChild.nextElementSibling;
const init = name.nextElementSibling.nextElementSibling;
// Tracker right side
const rightDiv = leftDiv.nextElementSibling;
const addInit = rightDiv.firstElementChild;
const placeholder = addInit.nextElementSibling;
const clearByNameInit = placeholder.nextElementSibling.nextElementSibling;
const clearInit = clearByNameInit.nextElementSibling;
// Tracker display
const initDisplay = rightDiv.nextElementSibling.nextElementSibling;


/* Event Listeners */
addInit.addEventListener('click', addToInitiativeList);
placeholder.addEventListener('click', function () { return false }); // Presently has no function, will likely remove
clearByNameInit.addEventListener('click', clearByName);
clearInit.addEventListener('click', clearInitiative);


/* Initiative Storage */
// Get stored initiative values or create an empty array for new ones
const initiative = [];
if (localStorage.initiative) {
    getStorage(localStorage.initiative, 'init');
    printInitiative();
}

/* Initiative User Interface */
// Take inputs, sort into 'initiative' array, update to localStorage, and print to page
function addToInitiativeList() {
    try {
        // Check for valid inputs
        if (!name.value) throw new Error('Please enter a name');
        if (!init.value || isNaN(init.value)) throw new Error('Please enter a valid initiative');

        // Store inputs, add them to 'initiative' array, and sort
        const input = {
            name: name.value,
            init: init.value
        }
        initiative.unshift(input);
        initiative.sort((a, b) => b.init - a.init);

        // Reset inputs and print
        clearInitInputs();
        printInitiative();

    } catch (err) {
        handler(err);
        printInitiative();
    }
}

// Placeholder button

// Clear a specific name based on current 'name.value'
/* Unnecessary? */
function clearByName() {
    try {
        const input = name.value.toLowerCase();
        let found = false;
        initiative.forEach(function (person, i) {
            if (input === person.name.toLowerCase()) {
                initiative.splice(i, 1);
                found = true;
            }
        });
        if (!found) throw new Error('Name given was not found');
        clearInitInputs();
    } catch (err) {
        handler(err);
    } finally {
        printInitiative();
    }
}

// Clear all initiative values
function clearInitiative() {
    initiative.length = 0;
    delete localStorage.initiative;
    initDisplay.textContent = '';
}

// Convert 'initiative' array into readable message to display, and decodable message to store
function printInitiative() {
    let message = '';
    let storage = '';

    initiative.forEach(function (person, ind) {
        // Add a separator before every entry after the first
        if (ind !== 0) {
            message += ', ';
            storage += '$%';
        };
        message += `${person.name}: ${person.init}`;
        storage += `${person.name}: ${person.init}`;
    });

    localStorage.initiative = storage;
    initDisplay.textContent = message;
}

// Reset initiative inputs
function clearInitInputs() {
    name.value = '';
    init.value = '';
    name.focus();
}

