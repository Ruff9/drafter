import { Draft } from "./draft.js";

const text = document.querySelector("#text");
const sidebar = document.querySelector("#sidebar");

const clearButton = document.querySelector("#clear-button");
const newDraftButton = document.querySelector("#new-draft-button");

window.addEventListener("load", function() {
  renderCurrentContent();
  renderSidebar();

  document.addEventListener("keyup", function() {
    Draft.saveCurrent(text.innerHTML);
    updateThumbnail(text.innerHTML);
  });
});

clearButton.onclick = async function() {
  Draft.destroyCurrent();
  await renderCurrentContent();
  while (text.firstChild) text.removeChild(text.firstChild);
};

newDraftButton.onclick = async function() {
  const draft = await Draft.init(text.innerHTML);
  draft.setActive();

  renderCurrentContent();
  renderSidebar();
};

async function renderCurrentContent() {
  const currentContent = await Draft.getCurrent();

  if (currentContent && currentContent != "") {
    text.innerHTML = currentContent;
  } else {
    text.innerHTML = "Express yourself :)";
  }

  renderActiveDraft();
}

async function renderActiveDraft() {
  const activeDraft = await Draft.getActive();
  const container = document.querySelector("#active-draft");

  while (container.firstChild) container.removeChild(container.firstChild);

  if (activeDraft && activeDraft != "") {
    const content = "Draft #" + activeDraft.position;
    container.appendChild(document.createTextNode(content));
  }
}

async function renderSidebar() {
  while (sidebar.firstChild) sidebar.removeChild(sidebar.firstChild);

  const drafts = await Draft.all();

  if (drafts.length == 0) {
    renderEmptySidebar();
  } else {
    for (const draft of drafts) { renderThumbnail(draft); }
    setupThumbnailsEvents();
  }
}

function renderEmptySidebar() {
  const container = document.createElement("div");
  container.classList.add("empty-sidebar-container");

  const newDiv = document.createElement("div");
  newDiv.appendChild(document.createTextNode("No draft saved"));
  newDiv.classList.add("empty-sidebar");

  container.append(newDiv);
  sidebar.append(container);
}

function renderThumbnail(draft) {
  const newDiv = document.createElement("div");
  const cleanExtract = sanitizeExtract(draft.extract);

  newDiv.classList.add("thumbnail");
  newDiv.setAttribute("data-draft-uid", draft.uid);
  newDiv.setAttribute("data-draft-position", draft.position);

  renderThumbnailPosition(newDiv);
  renderThumbnailContent(cleanExtract, newDiv);
  renderThumbnailDelete(newDiv);

  sidebar.append(newDiv);
}

function renderThumbnailPosition(container) {
  const position = container.dataset.draftPosition;
  const positionContainer = document.createElement("div");

  positionContainer.appendChild(document.createTextNode(position));
  positionContainer.classList.add("position-container");
  container.appendChild(positionContainer);
}

function renderThumbnailContent(content, container) {
  const thumbContent = document.createElement("div");
  thumbContent.appendChild(document.createTextNode(content));
  thumbContent.classList.add("thumbnail-content");

  container.appendChild(thumbContent);
}

function renderThumbnailDelete(container) {
  const deleteContainer = document.createElement("div");
  deleteContainer.classList.add("delete-container");

  const img = document.createElement("img");
  img.src = "icons/close.svg";
  img.classList.add("delete-icon");
  deleteContainer.appendChild(img);

  container.appendChild(deleteContainer);
}

async function setupThumbnailsEvents() {
  const thumbs = document.getElementsByClassName("thumbnail-content");
  const deleteButtons = document.getElementsByClassName("delete-container");

  for (const thumb of thumbs) {
    thumb.onclick = async function(e) {
      const draft = await Draft.find(eventTargetUid(e));

      await draft.load();
      renderCurrentContent();
    };
  }

  for (const button of deleteButtons) {
    button.onclick = async function(e) {
      const draft = await Draft.find(eventTargetUid(e));

      await draft.destroy();
      renderCurrentContent();
      renderSidebar();
      renderActiveDraft();
    };
  }
}

async function updateThumbnail(content) {
  const cleanContent = sanitizeExtract(content.substring(0,150));
  const activeDraft = await Draft.getActive();

  if (activeDraft && activeDraft != "") {
    const thumbs = await document.getElementsByClassName("thumbnail");
    const thumb = thumbs.item(activeDraft.position - 1);
    const container = thumb.querySelector(".thumbnail-content");

    if (container.innerHTML != cleanContent) {
      while (container.firstChild) container.removeChild(container.firstChild);
      container.innerHTML = cleanContent;
    }
  }
}

function sanitizeExtract(content) {
  return content.replace(/<\/?[^>]+(>|$)/g, "")
                .replace(/&nbsp;/gi, " ");
}

function eventTargetUid(event) {
  return event.currentTarget.parentNode.dataset.draftUid;
}
