export class Draft {
  constructor(text) {
    this.text = text;
    this.extract = text.substring(0,150);
    this.uid = Math.random().toString(36).substring(2, 9);
    this.position = Draft.count() + 1
  }

  static getAll() {
    let allDrafts = [];

    let uids = Object.keys(localStorage)
                     .filter(key => key.startsWith('virginie-draft'))
                     .map( key => key.substring('virginie-draft-'.length));

    for (let uid of uids) {
      let draft = Draft.find(uid);
      allDrafts.push(draft);
    };

    return allDrafts.sort(function (a, b) { return a.position - b.position; });
  }

  static new(content) {
    let draft = new Draft(content);
    draft.save();
  }

  static find(uid) {
    let data = JSON.parse(window.localStorage.getItem('virginie-draft-' + uid));
    let draft = new Draft(data.text);

    draft.uid = data.uid;
    draft.extract = data.extract;
    draft.position = data.position;

    return draft;
  }

  static count() {
    return Object.keys(localStorage)
                 .filter(key => key.startsWith('virginie-draft'))
                 .length;
  }

  static adjustPositions() {
    let drafts = Draft.getAll();

    for (let draft of drafts) {
      draft.position = drafts.indexOf(draft) + 1
      draft.save();
    };
  }

  static getCurrent() {
    return window.localStorage.getItem('virginie-current');
  }

  static saveCurrent(content) {
    window.localStorage.setItem('virginie-current', content);
  }

  static destroyCurrent() {
    window.localStorage.removeItem('virginie-current');
  }

  save() {
    window.localStorage.setItem(
      'virginie-draft-' + this.uid, JSON.stringify(this)
    );
  }

  load() {
    window.localStorage.setItem('virginie-current', this.text);
  }

  destroy() {
    window.localStorage.removeItem('virginie-draft-' + this.uid);
    Draft.adjustPositions();
  }
}
