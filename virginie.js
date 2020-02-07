let text = document.querySelector('#text');
let clearButton = document.querySelector('#clear-button');

window.addEventListener('load', () => {
    const gettingItem = window.localStorage.getItem('virginieContent');

    if (gettingItem && gettingItem != '') {
        text.innerHTML = gettingItem;
    } else {
        text.innerHTML = 'Vous pouvez écrire ici :)'
    }
});

document.addEventListener('keyup', (event) => {
    window.localStorage.setItem('virginieContent', text.innerHTML);
});

clearButton.onclick = function() {
  text.innerHTML = '';
  window.localStorage.setItem('virginieContent', '');
};