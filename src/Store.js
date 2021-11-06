const path = require("path");
const fs = require("fs");
const electron = require("electron");

class Store {
  constructor(opts) {
    const userDataPath = (electron.app || electron.remote.app).getPath(
      "userData"
    );

    this.path = path.join(userDataPath, opts.configName + ".json");
    this.data = this.parseDataFile(this.path, opts.defaults);

    console.log("CONSTRUCTOR:PATH::: ", this.path);
    console.log("CONSTRUCTOR:DATA::: ", this.data);
  }

  get(key) {
    console.log(`STORE:GET:${key}::: `, key);
    console.log(`STORE:GET:DATA::: `, this.data[key]);
    return this.data[key];
  }

  set(key, val) {
    this.data[key] = val;
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }

  parseDataFile(path, defaults) {
    try {
      return JSON.parse(fs.readFileSync(path));
    } catch (error) {
      return defaults;
    }
  }
}

module.exports = Store;
