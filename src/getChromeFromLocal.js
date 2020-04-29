const puppeteer = require('puppeteer');

const getChromeFromLocal = async () => {
  const chrome = await puppeteer.launch({
    headless: false,
    slowMo: process.env.SLOWMO_MS,
    dumpio: true,
  });
  return chrome;
};

module.exports = getChromeFromLocal;
