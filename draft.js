export class Draft {
  constructor(text) {
    this.text = text;
    this.extract = text.substring(0,150);
    this.uid = Math.random().toString(36).substring(2, 9);
    this.position = Draft.count() + 1
  }

  static all() {
    const allDrafts = [];

    const uids = Object.keys(localStorage)
                     .filter(key => key.startsWith('virginie-draft'))
                     .map(key => key.substring('virginie-draft-'.length));

    for (const uid of uids) {
      const draft = Draft.find(uid);
      allDrafts.push(draft);
    };

    return allDrafts.sort(function (a, b) { return a.position - b.position; });
  }

  static build(content) {
    const draft = new Draft(content);
    draft.save();
    draft.setActive();
  }

  static find(uid) {
    const data = JSON.parse(window.localStorage.getItem('virginie-draft-' + uid));
    const draft = new Draft(data.text);

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
    const drafts = Draft.all();

    for (const draft of drafts) {
      draft.position = drafts.indexOf(draft) + 1
      draft.save();
    };
  }

  static getCurrent() {
    return window.localStorage.getItem('virginie-current');
  }

  static getActiveDraft() {
    return window.localStorage.getItem('virginie-active-draft')
  }

  static saveCurrent(content) {
    const activeDraft = JSON.parse(Draft.getActiveDraft());

    if (activeDraft && activeDraft != '') {
      const draft = Draft.find(activeDraft.uid);
      draft.update(content);
    };

    window.localStorage.setItem('virginie-current', content);
  }

  static destroyCurrent() {
    window.localStorage.removeItem('virginie-current');
    window.localStorage.removeItem('virginie-active-draft');
  }

  save() {
    window.localStorage.setItem(
      'virginie-draft-' + this.uid, JSON.stringify(this)
    );
  }

  update(content) {
    this.text = content;
    this.extract = content.substring(0,150);
    this.save();
  }

  load() {
    window.localStorage.setItem('virginie-current', this.text);
    this.setActive();
  }

  destroy() {
    window.localStorage.removeItem('virginie-draft-' + this.uid);
    Draft.adjustPositions();
  }

  setActive() {
    const active = { uid: this.uid, position: this.position };
    window.localStorage.setItem('virginie-active-draft', JSON.stringify(active));
  }
}
