import { Draft } from "./draft.js";

const text = document.querySelector("#text");
const sidebar = document.querySelector("#sidebar");

const clearButton = document.querySelector("#clear-button");
const newDraftButton = document.querySelector("#new-draft-button");

const welcomeMessage = `This page saves everything you type,
and allows to manage auto-saved drafts.

The data stays in your browser,
no need for an account.

Enjoy :)`

setTheme();
applyTheme();

window.addEventListener("load", function() {
  renderCurrentContent();
  renderSidebar();

  document.addEventListener("keyup", function() {
    Draft.saveCurrent(text.value);
    updateThumbnail(text.value);
  });
});

clearButton.onclick = async function() {
  Draft.destroyCurrent();
  await renderCurrentContent();
  text.value = '';
};

newDraftButton.onclick = async function() {
  const draft = await Draft.init(text.value);
  draft.setActive();

  renderCurrentContent();
  renderSidebar();
};

async function renderCurrentContent() {
  const current = await Draft.getCurrent();

  text.value = current ? current : welcomeMessage;

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
  const thumbnails = document.getElementsByClassName('thumbnail');
  while (thumbnails[0]) thumbnails[0].parentNode.removeChild(thumbnails[0]);

  const drafts = await Draft.all();

  if (drafts.length == 0) {
    renderEmptySidebar();
  } else {
    clearEmptySidebar();
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
  sidebar.prepend(container);
}

function clearEmptySidebar() {
  const emptySidebar = document.querySelector(".empty-sidebar-container");

  if(emptySidebar) {
    emptySidebar.remove();
  }
}

function renderThumbnail(draft) {
  const container = document.querySelector(".thumbnails-container");
  const newDiv = document.createElement("div");

  newDiv.classList.add("thumbnail");
  newDiv.setAttribute("data-draft-uid", draft.uid);
  newDiv.setAttribute("data-draft-position", draft.position);

  renderThumbnailPosition(newDiv);
  renderThumbnailContent(draft.extract, newDiv);
  renderThumbnailDelete(newDiv);

  container.append(newDiv);
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
  const shortenContent = content.substring(0,150);
  const activeDraft = await Draft.getActive();

  if (activeDraft && activeDraft != "") {
    const thumbs = document.getElementsByClassName("thumbnail");
    const thumb = thumbs.item(activeDraft.position - 1);
    const container = thumb.querySelector(".thumbnail-content");

    if (container.textContent != shortenContent) {
      while (container.firstChild) container.removeChild(container.firstChild);
      container.textContent = shortenContent;
    }
  }
}

async function applyTheme() {
  const pageBody = document.querySelector("body");
  const currentTheme = await browser.storage.local.get("drafter-dark-theme");

  switch(currentTheme["drafter-dark-theme"]) {
    case "":
      await saveThemeToLight();
      pageBody.classList.remove("dark-mode");
      break;
    case true:
      pageBody.classList.add("dark-mode");
      break;
    case false:
      pageBody.classList.remove("dark-mode");
      break;
  }
}

async function setTheme() {
  const checkbox = document.getElementById('selectDarkTheme')
  const current = await browser.storage.local.get("drafter-dark-theme");
  document.getElementById("selectDarkTheme").checked = current["drafter-dark-theme"];

  checkbox.onclick = async function(e) {
    if (e.currentTarget.checked) {
      await saveThemeToDark();
      await applyTheme();
    } else {
      await saveThemeToLight();
      await applyTheme();
    }
  }
}

async function saveThemeToLight() {
  await browser.storage.local.set({"drafter-dark-theme": false});
}

async function saveThemeToDark() {
  await browser.storage.local.set({"drafter-dark-theme": true});
}

function eventTargetUid(event) {
  return event.currentTarget.parentNode.dataset.draftUid;
}
