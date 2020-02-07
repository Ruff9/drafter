var text = document.querySelector('.text');

window.addEventListener('load', () => {
    const gettingItem = window.localStorage.getItem('virginieContent');

    if (gettingItem && gettingItem != "") {
        text.innerHTML = gettingItem;
    } else {
        text.innerHTML = "<p>Écrire ici</p>"
    }
});

document.addEventListener('keyup', (event) => {
    window.localStorage.setItem('virginieContent', text.innerHTML);
});