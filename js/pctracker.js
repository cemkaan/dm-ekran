
/* Define HTML Elements */
const PCtrackerDiv = document.querySelector('#pc-tracker');
const PCdiv = PCtrackerDiv.firstElementChild.firstElementChild.nextElementSibling;
const PCtextarea = PCdiv.nextElementSibling;
const addPCbutton = PCtextarea.nextElementSibling.nextElementSibling.nextElementSibling;
const editPCbutton = addPCbutton.nextElementSibling;
const removePCbutton = editPCbutton.nextElementSibling;


/* Original Event Listeners */
addPCbutton.addEventListener('click', addPC);
editPCbutton.addEventListener('click', editPC);
removePCbutton.addEventListener('click', removePC);


/* PC Storage */
// Retrieve previously stored PCs or create an empty array
const myPCs = [];
if (localStorage.pc) {
	getStorage(localStorage.pc, 'pc');
	printPCs();
}

// Take a string from local storage and convert it into an array
// PC storage template: 'Player 1 name, details$%Player 2 name, details$%etc'
function getStorage(storage, type) {
	const storageSplit = storage.split('$%');

	// Separate initiative into name and init if needed, then push into 'array'
	// Init array template: [{name: 'P1', init: 1], [name: 'P2', init: 2], etc]
	storageSplit.forEach(function (val, ind) {
		if (type === 'pc') myPCs.push(val);
		else {
			const itemSplit = val.split(': ');
			const item = {
				name: itemSplit[0],
				init: itemSplit[1]
			}
			initiative.push(item);
		};
	});
}


/* Add New PCs */
// Takes input, add it to PC array, store array in local storage, and print to page; called by 'Karakter Ekle' button
function addPC() {
	try {
		// To avoid bugs, disallow this function if currently editing or deleting PCs
		if (editPCbutton.textContent != 'Karakter Düzenle' || removePCbutton.textContent != 'Karakter Kaldır') return false;

		// Take input, add 'strong' tag to name, add to 'myPCs' array, and print the new array
		const input = PCtextarea.value.trim();
		if (!input) throw new Error('No PC information entered');
		const isim = /(\w+):\s/iu;
		//const buyu = /(Büyü):\s/iu;
		const message = input.replace(isim, `<strong class="has-text-warning-light has-background-danger-dark">$1:</strong> `);
		myPCs.push(message);
		printPCs();

		// Reset input field
		PCtextarea.value = '';
		PCtextarea.focus();

	} catch (err) { handler(err) };
}


/* Edit Existing PCs */
// Creates inline 'edit' buttons; called by 'Karakter Düzenle' button
function editPC() {
	// To avoid bugs, disallow function if currently deleting PCs or if no PCs are being displayed
	if (removePCbutton.textContent != 'Karakter Kaldır') return false;
	if (!PCdiv.childNodes.length) return false;

	// Change text content to 'Cancel' and alter alter event listeners
	alterButton(editPCbutton, 'İptal', editPC, removeInlineButtons);

	// Add an 'edit' button to the div for each PC
	const pcDivs = PCdiv.children;
	for (let i = 0; i < pcDivs.length; i++) {
		const b = document.createElement('button');
		b.innerHTML = '&#10000';
		b.className = 'inline-button';
		b.addEventListener('click', createEditDiv);
		pcDivs[i].appendChild(b);
	};
}

// Remove all inline buttons, and replace <p> element with <input>; called by an inline 'edit' button
function createEditDiv() {
	const target = this.parentNode;
	removeInlineButtons();

	alterButton(editPCbutton, 'Değişiklikleri Kaydet', removeInlineButtons, storeRevision);

	const textInput = document.createElement('input');
	textInput.type = 'text';
	textInput.className = 'input';
	textInput.value = target.textContent;
	PCdiv.replaceChild(textInput, target);
}

// Format and store the revision in 'myPCs', reprint 'myPCs', and revert 'Karakter Düzenle' button to original state
function storeRevision() {
	// Give 'strong' tags to the name in the new input
	const isim = /(\w+),\s/;
	const input = PCdiv.querySelector('input').value;
	const message = input.replace(isim, `<strong>$1,</strong> `);

	// Replace old entry with the revision
	PCdiv.childNodes.forEach(function (val, ind) {
		if (val.className === 'input') myPCs[ind] = message;
	});
	printPCs();

	alterButton(editPCbutton, 'Karakter Düzenle', storeRevision, editPC);
}


/* Delete Existing PCs */
// Creates inline 'delete' buttons; called by 'Karakter Kaldır' button
function removePC() {
	// To avoid bugs, disallow function if currently editing PCs or if no PCs are being displayed
	if (editPCbutton.textContent !== 'Karakter Düzenle') return false;
	if (!PCdiv.childNodes.length) return false;

	// Change text content to 'Cancel' and alter alter event listeners
	alterButton(removePCbutton, 'İptal', removePC, removeInlineButtons);

	// Add a 'delete' button to the div for each PC
	const pcDivs = PCdiv.children;
	for (let i = 0; i < pcDivs.length; i++) {
		const b = document.createElement('button');
		b.innerHTML = '&#10006';
		b.className = 'inline-button';
		b.addEventListener('click', deletePcFromArray);
		pcDivs[i].appendChild(b);
	};
}

// Inline 'delete' button will remove an entry from 'myPCs', reprint the array, and revert 'Karakter Kaldır' button
function deletePcFromArray() {
	const pc = this.previousSibling.textContent;
	myPCs.splice(myPCs.indexOf(pc), 1);
	printPCs();
	alterButton(removePCbutton, 'Karakter Kaldır', removeInlineButtons, removePC);
}


/* General Purpose PC Tracker Functions */
// Change a button text content and event listeners
function alterButton(button, newText, oldListener, newListener) {
	button.textContent = newText;
	button.removeEventListener('click', oldListener);
	button.addEventListener('click', newListener);
}

// Removes edit or remove buttons, reverts 'Cancel' button to 'Karakter Düzenle' or 'Karakter Kaldır'
function removeInlineButtons() {
	const pcDivs = PCdiv.children;
	for (let i = 0; i < pcDivs.length; i++) { pcDivs[i].querySelector('button').remove() };

	if (editPCbutton.textContent === 'Cancel') alterButton(editPCbutton, 'Karakter Düzenle', removeInlineButtons, editPC);
	if (removePCbutton.textContent === 'Cancel') alterButton(removePCbutton, 'Karakter Kaldır', removeInlineButtons, removePC);
}

// Display PC array to page and save to local storage
function printPCs() {
	let children = PCdiv.childNodes;
	for (let i = children.length; i > 0; --i) { PCdiv.removeChild(children[i - 1]) };
	for (let i = 0; i < myPCs.length; i++) {
		const p = document.createElement('p');
		p.className = 'hanging-indent';
		const buyu = /(Büyüler):\s/iu;
		const hp = /(HP):\s/u;
		const nwp = /(NWP):\s/;
		const ac = /(AC):\s/;
		const elf = /(Elf):\s/;
		const taco = /(TACO):\s/;
		p.innerHTML = myPCs[i]
			.replace(buyu, `<strong class="has-text-info-light has-background-info-dark">$1:</strong> `)
			.replace(hp, `<span class="has-text-success-light has-background-success-dark">$1:</span> `)
			.replace(nwp, `<span class="has-text-white has-background-grey-darker">$1:</span> `)
			.replace(ac, `<span class="has-text-white has-background-grey-darker">$1:</span> `)
			.replace(elf, `<span class=" has-background-success-light">$1:</span> `)
			.replace(taco, `<span class="has-text-white has-background-grey">$1:</span> `);
		PCdiv.appendChild(p);
	}
	storePlayerCharacters();
}

// Convert array items into strings for storage
function storePlayerCharacters() {
	if (!myPCs.length) return;
	let string = '';
	myPCs.forEach(function (pc) {
		if (string.length) string += '$%';
		string += pc;
	});
	localStorage.pc = string;
}

/*** ERROR HANDLER ***/
function handler(err) {
	let message = `Error: ${err.message}`;
	print(message);
	console.error(err);
	return false;
}
