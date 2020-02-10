export class Draft {
  constructor(text) {
    this.text = text;
    this.extract = text.substring(0,150);
    this.uid = Math.random().toString(36).substr(2, 9);
  }

  static save() {
    const savedContent = window.localStorage.getItem('virginieSaved');
    let parsedItems = []

    if (savedContent && savedContent != '') {
      parsedItems = JSON.parse(savedContent);
    }

    parsedItems.push(new Draft(text.innerHTML))

    window.localStorage.setItem('virginieSaved', JSON.stringify(parsedItems));
  }

  static find(uid) {
    const savedContent = window.localStorage.getItem('virginieSaved');
    const drafts = JSON.parse(savedContent);

    const draftData = drafts.filter(obj => {
      return obj.uid == uid
    })[0]

    let draft = new Draft(draftData.text);
    draft.uid = draftData.uid;
    // draft.extract = draftData.extract;

    return draft;
  }

  load() {
    window.localStorage.setItem('virginieCurrent', this.text);
  }

  destroy() {
    const savedContent = window.localStorage.getItem('virginieSaved');
    let drafts = JSON.parse(savedContent);

    drafts = drafts.filter(item => item.uid !== this.uid)

    window.localStorage.setItem('virginieSaved', JSON.stringify(drafts));
  }
}
