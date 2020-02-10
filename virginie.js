import { Draft } from './draft.js'

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
  Draft.save();
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
    let drafts = JSON.parse(savedContent);

    for (const draft of drafts) {
      renderThumbnail(draft);
    }
  }

  setupThumbnails();
}

function renderThumbnail(draft) {
  let newDiv = document.createElement('div');
  let cleanExtract = draft.extract.replace(/<\/?[^>]+(>|$)/g, "");

  newDiv.classList.add('thumbnail');
  newDiv.setAttribute('data-draft-uid', draft.uid);

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
      let draft = Draft.find(e.target.parentNode.dataset.draftUid);

      draft.load();
      renderCurrentContent();
    }
  }

  for (const button of deleteButtons) {
    button.onclick = function(e) {
      let draft = Draft.find(e.target.parentNode.dataset.draftUid);

      draft.destroy();
      renderSidebar();
    }
  }
}
