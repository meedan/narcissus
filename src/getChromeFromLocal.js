const puppeteer = require('puppeteer');

const getChromeFromLocal = async () => {
  const chrome = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    slowMo: process.env.SLOWMO_MS,
    dumpio: true,
  });
  return chrome;
};

module.exports = getChromeFromLocal;
