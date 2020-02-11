export class Draft {
  constructor(text) {
    this.text = text;
    this.extract = text.substring(0,150);
    this.uid = Math.random().toString(36).substr(2, 9);
    this.position = JSON.parse(Draft.saved()).length + 1
  }

  static saved() {
    let data = window.localStorage.getItem('virginieSaved');

    return (data && data != '') ? data : '[]'
  }

  static save() {
    const drafts = JSON.parse(Draft.saved());

    drafts.push(new Draft(text.innerHTML))

    window.localStorage.setItem('virginieSaved', JSON.stringify(drafts));
  }

  static find(uid) {
    const drafts = JSON.parse(Draft.saved());

    let draftData = drafts.find(draft => draft.uid === uid )

    let draft = new Draft(draftData.text);
    draft.uid = draftData.uid;
    draft.extract = draftData.extract;

    return draft;
  }

  load() {
    window.localStorage.setItem('virginieCurrent', this.text);
  }

  destroy() {
    let drafts = JSON.parse(Draft.saved());

    drafts = drafts.filter(item => item.uid !== this.uid)

    window.localStorage.setItem('virginieSaved', JSON.stringify(drafts));
  }
}
