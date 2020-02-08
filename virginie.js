import { Blob } from './blob.js'

let text = document.querySelector('#text');
let sidebar = document.querySelector('#sidebar');

let clearButton = document.querySelector('#clear-button');
let saveButton = document.querySelector('#save-button');

window.addEventListener('load', () => {
  renderCurrentContent();
  renderSidebar();
  setupThumbnails();
});

document.addEventListener('keyup', (event) => {
  window.localStorage.setItem('virginieCurrent', text.innerHTML);
});

clearButton.onclick = function() {
  text.innerHTML = '';
  window.localStorage.removeItem('virginieCurrent');
};

saveButton.onclick = function() {
  Blob.save();
  renderSidebar();
};

function setupThumbnails() {
  let thumbs = document.getElementsByClassName('thumbnail');

  for (const thumb of thumbs) {
    thumb.onclick = function(e) {
      let blob = Blob.find(e.target.dataset.blobId);

      blob.load();
      renderCurrentContent();
    }
  }
}

function renderCurrentContent() {
  const currentContent = window.localStorage.getItem('virginieCurrent');

  if (currentContent && currentContent != '') {
    text.innerHTML = currentContent;
  } else {
    text.innerHTML = 'Express yourself :)'
  }
}

function renderSidebar() {
  sidebar.innerHTML = '';
  const savedContent = window.localStorage.getItem('virginieSaved');

  if (savedContent && savedContent != '') {
    let blobs = JSON.parse(savedContent);

    for (const blob of blobs) {
      renderThumbnail(blob);
    }
  }
}

function renderThumbnail(blob) {
  let newDiv = document.createElement('div');

  newDiv.appendChild(document.createTextNode(blob.extract));
  newDiv.setAttribute('data-blob-id', blob.id);
  newDiv.classList.add('thumbnail');

  sidebar.append(newDiv);
}
