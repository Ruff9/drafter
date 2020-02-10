import { Blob } from './blob.js'

let text = document.querySelector('#text');
let sidebar = document.querySelector('#sidebar');

let clearButton = document.querySelector('#clear-button');
let saveButton = document.querySelector('#save-button');

window.addEventListener('load', () => {
  renderCurrentContent();
  renderSidebar();
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

  setupThumbnails();
}

function renderThumbnail(blob) {
  let newDiv = document.createElement('div');
  let cleanExtract = blob.extract.replace(/<\/?[^>]+(>|$)/g, "");

  newDiv.classList.add('thumbnail');
  newDiv.setAttribute('data-blob-id', blob.id);

  let thumbContent = document.createElement('div');
  thumbContent.appendChild(document.createTextNode(cleanExtract));
  thumbContent.classList.add('thumbnail-content');
  newDiv.appendChild(thumbContent);

  let deleteContainer = document.createElement('div');
  deleteContainer.classList.add('delete-container');
  newDiv.appendChild(deleteContainer);

  let img = document.createElement('img');
  img.src = 'icons/close.svg';
  img.classList.add('delete-icon');
  deleteContainer.appendChild(img);

  sidebar.append(newDiv);
}

function setupThumbnails() {
  let thumbs = document.getElementsByClassName('thumbnail-content');
  let deleteButtons = document.getElementsByClassName('delete-container');

  for (const thumb of thumbs) {
    thumb.onclick = function(e) {
      let blob = Blob.find(e.target.parentNode.dataset.blobId);

      blob.load();
      renderCurrentContent();
    }
  }

  for (const button of deleteButtons) {
    button.onclick = function(e) {
      let blob = Blob.find(e.target.parentNode.dataset.blobId);

      blob.destroy();
      renderSidebar();
    }
  }
}
