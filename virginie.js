let text = document.querySelector('.text');

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