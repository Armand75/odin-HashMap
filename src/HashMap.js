export default class HaskMap {
  constructor() {
    this.factor = 0.8;
    this.capacity = 16;
    this.Map = new Array(this.capacity);
    this.count = 0;
  }

  hash(key) {
    let hashCode = 0;

    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) {
      hashCode = primeNumber * hashCode + key.charCodeAt(i);
    }
    return hashCode % this.capacity;
  }

  set(key, value) {
    if (this.count / this.capacity >= this.factor) {
      this.resize();
    }

    const index = this.hash(key);

    if (index < 0 || index >= this.Map.length)
      throw new Error("Trying to access index out of bounds");

    if (!this.Map[index]) {
      this.Map[index] = [];
      this.count++;
    }
    const existingEntry = this.Map[index].find((entry) => entry[0] === key);

    if (existingEntry) {
      existingEntry[1] = value;
    } else {
      this.Map[index].push([key, value]);
    }
  }

  resize() {
    const oldMap = this.Map;
    this.capacity *= 2;
    this.Map = new Array(this.capacity);
    this.count = 0;

    for (const bucket in oldMap) {
      if (bucket) {
        for (const [key, value] in bucket) {
          this.set(key, value);
        }
      }
    }
  }

  get(key) {
    const index = this.hash(key);

    const entry = this.Map[index].find((entry) => entry[0] === key);

    return entry ? entry[1] : null;
  }

  has(key) {
    const index = this.hash(key);
    const entry = this.Map[index].find((entry) => entry[0] === key);

    return entry ? true : false;
  }

  remove(key) {
    if (!this.has(key)) {
      return false;
    } else {
      const index = this.hash(key);
      const bucket = this.Map[index];
      const entryIndex = bucket.findIndex((entry) => entry[0] === key);
      this.Map[index].splice(entryIndex, 1);
      return true;
    }
  }
}
