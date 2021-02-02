
/*** TABLE LOADER ***/
const tableLoader = document.querySelector('#tables');
const tableSelect = tableLoader.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling;
const tableButton = tableSelect.nextElementSibling;
const tableImg = tableButton.nextElementSibling.nextElementSibling;

tableButton.addEventListener('click', function () {
    if (tableSelect.value) tableImg.src = `./images/${tableSelect.value}.jpg`;
    else tableImg.display = 'none';
});




/*** LINKS TO OTHER RESOURCES ***/
const links = document.querySelector('#links');
const linkButton = links.lastElementChild;
const linkSelect = linkButton.previousElementSibling;

linkButton.addEventListener('click', function () { if (linkSelect.value) window.open(linkSelect.value, '_blank') });


