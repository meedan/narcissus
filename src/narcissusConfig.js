let config = {};
if (process.env.DEPLOY_ENV === 'local') {
  // eslint-disable-next-line global-require
  config = require('./config');
}

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
