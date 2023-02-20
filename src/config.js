"use strict";
const fs = require("fs");
const defaultConfig = require("./configs");
const file = require("./file");

const { log } = console;

class Config {
  constructor() {
    this._default = Object.assign({}, defaultConfig);
  }

  get _local() {
    try {
      return JSON.parse(fs.readFileSync(file.localConfig, "utf8"));
    } catch (error) {
      return log(error);
    }
  }

  get configuration() {
    this._ensureLocalConfig(file.localConfig);
    return this._local;
  }

  get shortcutKeys() {
    return this.configuration.shortcutKeys;
  }

  get customTheme() {
    return this.configuration.theme;
  }

  _updateConfig(data) {
    console.log(
      "🚀 ~ file: config.js:35 ~ Config ~ _updateConfig ~ data",
      data
    );
    const result = Object.assign({}, this._default);
    console.log(
      "🚀 ~ file: config.js:37 ~ Config ~ _updateConfig ~ result",
      result
    );

    Object.keys(data).forEach((type) => {
      result[type] = Object.assign({}, result[type], data[type]);
    });

    Object.keys(result).forEach((type) => {
      if (!data[type]) {
        data[type] = {};
      }
      const [options, defaultOptions] = [data[type], this._default[type]].map(
        (element) => Object.keys(element)
      );
      const deprecated = options.filter((x) => !defaultOptions.includes(x));
      deprecated.forEach((x) => delete result[type][x]);
    });

    return result;
  }

  _ensureLocalConfig(path) {
    const data = fs.existsSync(path)
      ? this._updateConfig(this._local)
      : this._default;
    try {
      fs.writeFileSync(path, JSON.stringify(data, null, 4));
    } catch (error) {
      log(error);
    }
  }
}

module.exports = new Config();
