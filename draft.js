export class Draft {
  constructor(text) {
    this.text = text;
    this.extract = text.substring(0,150);
    this.uid = Math.random().toString(36).substr(2, 9);
    this.position = Draft.getAll().length + 1
  }

  static getAll() {
    let allDrafts = [];

    let keys = Object.keys(localStorage).filter(
      key => key.startsWith('virginie-draft')
    );

    for (let key of keys) {
      let draft = JSON.parse(window.localStorage.getItem(key));
      allDrafts.push(draft)
    }

    return allDrafts.sort(function (a, b) { return a.position - b.position; });
  }

  static new(content) {
    let draft = new Draft(content);

    window.localStorage.setItem(
      'virginie-draft-' + draft.uid, JSON.stringify(draft)
    );
  }

  static find(uid) {
    let data = JSON.parse(window.localStorage.getItem('virginie-draft-' + uid));
    let draft = new Draft(data.text);

    draft.uid = data.uid;
    draft.extract = data.extract;
    draft.position = data.position;

    return draft;
  }

  static getCurrent() {
    return window.localStorage.getItem('virginieCurrent');
  }

  static saveCurrent(content) {
    window.localStorage.setItem('virginieCurrent', content);
  }

  static destroyCurrent() {
    window.localStorage.removeItem('virginieCurrent');
  }

  load() {
    window.localStorage.setItem('virginieCurrent', this.text);
  }

  destroy() {
    window.localStorage.removeItem('virginie-draft-' + this.uid);
  }
}
