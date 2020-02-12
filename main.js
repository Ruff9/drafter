import { Draft } from './draft.js';

const text = document.querySelector('#text');
const sidebar = document.querySelector('#sidebar');

const clearButton = document.querySelector('#clear-button');
const newDraftButton = document.querySelector('#new-draft-button');

window.addEventListener('load', () => {
  renderCurrentContent();
  renderSidebar();
});

document.addEventListener('keyup', (event) => {
  Draft.saveCurrent(text.innerHTML);
});

clearButton.onclick = function() {
  Draft.destroyCurrent();
  renderCurrentContent();
  while (text.firstChild) text.removeChild(text.firstChild);
};

newDraftButton.onclick = function() {
  Draft.build(text.innerHTML);
  renderCurrentContent();
  renderSidebar();
};

function renderCurrentContent() {
  const currentContent = Draft.getCurrent();

  if (currentContent && currentContent != '') {
    text.innerHTML = currentContent;
  } else {
    text.innerHTML = 'Express yourself :)'
  };

  renderActiveDraft();
}

function renderActiveDraft() {
  const activeDraft = JSON.parse(Draft.getActiveDraft());
  const container = document.querySelector('#active-draft');

  while (container.firstChild) container.removeChild(container.firstChild);

  if (activeDraft && activeDraft != '') {
    const position = activeDraft['position']
    container.appendChild(document.createTextNode('Draft #' + position));
  }
}

function renderSidebar() {
  while (sidebar.firstChild) sidebar.removeChild(sidebar.firstChild);

  const drafts = Draft.all();

  for (const draft of drafts) { renderThumbnail(draft); }

  setupThumbnailsEvents();
}

function renderThumbnail(draft) {
  const newDiv = document.createElement('div');
  const cleanExtract = draft.extract.replace(/<\/?[^>]+(>|$)/g, "");

  newDiv.classList.add('thumbnail');
  newDiv.setAttribute('data-draft-uid', draft.uid);
  newDiv.setAttribute('data-draft-position', draft.position);

  renderThumbnailPosition(newDiv);
  renderThumbnailContent(cleanExtract, newDiv);
  renderThumbnailDelete(newDiv);

  sidebar.append(newDiv);
}

function renderThumbnailPosition(container) {
  const position = container.dataset.draftPosition
  const positionContainer = document.createElement('div');

  positionContainer.appendChild(document.createTextNode(position));
  positionContainer.classList.add('position-container');
  container.appendChild(positionContainer);
}

function renderThumbnailContent(content, container) {
  const thumbContent = document.createElement('div');
  thumbContent.appendChild(document.createTextNode(content));
  thumbContent.classList.add('thumbnail-content');

  container.appendChild(thumbContent);
}

function renderThumbnailDelete(container) {
  const deleteContainer = document.createElement('div');
  deleteContainer.classList.add('delete-container');

  const img = document.createElement('img');
  img.src = 'icons/close.svg';
  img.classList.add('delete-icon');
  deleteContainer.appendChild(img);

  container.appendChild(deleteContainer);
}

function setupThumbnailsEvents() {
  const thumbs = document.getElementsByClassName('thumbnail-content');
  const deleteButtons = document.getElementsByClassName('delete-container');

  for (const thumb of thumbs) {
    thumb.onclick = function(e) {
      const draft = Draft.find(e.currentTarget.parentNode.dataset.draftUid);

      draft.load();
      renderCurrentContent();
    }
  }

  for (const button of deleteButtons) {
    button.onclick = function(e) {
      const draft = Draft.find(e.currentTarget.parentNode.dataset.draftUid);

      draft.destroy();
      renderCurrentContent();
      renderSidebar();
    }
  }
}
