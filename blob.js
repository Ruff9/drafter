export class Blob {
  constructor(id, text) {
    this.id = id;
    this.text = text;
    this.extract = text.substring(0,150);
  }

  static save() {
    const savedContent = window.localStorage.getItem('virginieSaved');
    let savedItems = []

    if (savedContent && savedContent != '') {
      savedItems = JSON.parse(savedContent);
    }

    savedItems.push(new Blob(savedItems.length, text.innerHTML))

    window.localStorage.setItem('virginieSaved', JSON.stringify(savedItems));
  }

  static find(id) {
    const savedContent = window.localStorage.getItem('virginieSaved');
    const blobs = JSON.parse(savedContent);

    const blob = blobs.filter(obj => {
      return obj.id == id
    })[0]

    return new Blob(blob.id, blob.text);
  }

  load() {
    window.localStorage.setItem('virginieCurrent', this.text);
  }

  destroy() {
    const savedContent = window.localStorage.getItem('virginieSaved');
    let blobs = JSON.parse(savedContent);

    blobs = blobs.filter(item => item.id !== this.id)

    window.localStorage.setItem('virginieSaved', JSON.stringify(blobs));
  }
}
