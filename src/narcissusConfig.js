const fs = require('fs');

if (!fs.existsSync('config.js')) {
  fs.writeFileSync('config.js', JSON.stringify({}))
}

const config = require('./config');

const narcissusConfig = {
  get: (key, fallback) => {
    if (Object.keys(process.env).indexOf(key) > -1) {
      return process.env[key];
    }
    if (Object.keys(config).indexOf(key) > -1) {
      return config[key];
    }
    return fallback;
  },
};

module.exports = narcissusConfig;
