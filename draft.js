export class Draft {
  constructor(text) {
    this.text = text;
    this.extract = text.substring(0,150);
    this.uid = Math.random().toString(36).substring(2, 9);
  }

  static async init(text) {
    const draft = new Draft(text);
    draft.position = await Draft.count() + 1;
    await draft.save();
    return draft;
  }

  static async all() {
    const allDrafts = [];
    const all = await browser.storage.local.get();

    const uids = Object.keys(all)
                       .filter(key => key.startsWith("virginie-draft"))
                       .map(key => key.substring("virginie-draft-".length));

    for (const uid of uids) {
      const draft = await Draft.find(uid);
      allDrafts.push(draft);
    }

    return allDrafts.sort(function (a, b) { return a.position - b.position; });
  }

  static async find(uid) {
    const draftKey = "virginie-draft-" + uid;
    const data = await browser.storage.local.get(draftKey);

    const draft = new Draft(data[draftKey].text);

    draft.uid = data[draftKey].uid;
    draft.position = data[draftKey].position;

    return draft;
  }

  static async count() {
    const all = await browser.storage.local.get();

    return Object.keys(all)
                 .filter(key => key.startsWith("virginie-draft"))
                 .length;
  }

  static async adjustPositions() {
    const drafts = await Draft.all();
    const active = await Draft.getActive();

    for (const draft of drafts) {
      draft.position = drafts.indexOf(draft) + 1;
      draft.save();

      if (active && draft.uid === active.uid) {
        await Draft.updateActivePosition(draft.position);
      }
    }
  }

  static async getCurrent() {
    const current = await browser.storage.local.get("virginie-current");

    return current["virginie-current"];
  }

  static async saveCurrent(content) {
    const activeDraft = await Draft.getActive();

    if (activeDraft && activeDraft != "") {
      const draft = await Draft.find(activeDraft.uid);
      await draft.update(content);
    }

    await browser.storage.local.set({ "virginie-current": content });
  }

  static async destroyCurrent() {
    await browser.storage.local.remove("virginie-current");
    await Draft.destroyActive();
  }

  async save() {
    const data = { [`virginie-draft-${this.uid}`]: this };
    await browser.storage.local.set(data);
  }

  async update(content) {
    this.text = content;
    this.extract = content.substring(0,150);
    await this.save();
  }

  async load() {
    await browser.storage.local.set({"virginie-current": this.text});
    await this.setActive();
  }

  async destroy() {
    const active = await Draft.getActive();
    if (active && this.uid === active.uid) { await Draft.destroyActive(); }

    await browser.storage.local.remove("virginie-draft-" + this.uid);
    await Draft.adjustPositions();
  }

  static async getActive() {
    const result = await browser.storage.local.get("virginie-active-draft");

    return result["virginie-active-draft"];
  }

  static async updateActivePosition(position) {
    const draft = await Draft.getActive();

    draft.position = position;

    await browser.storage.local.set({"virginie-active-draft": draft});
  }

  static async destroyActive() {
    await browser.storage.local.remove("virginie-active-draft");
  }

  async setActive() {
    await browser.storage.local.set({"virginie-active-draft": this});
  }
}
