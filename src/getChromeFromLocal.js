const puppeteer = require('puppeteer');

const getChromeFromLocal = async () => {
  const browserFetcher = puppeteer.createBrowserFetcher();
  const revisionInfo = await browserFetcher.download('809590.');
  const chrome = await puppeteer.launch({
    executablePath: revisionInfo.executablePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    slowMo: process.env.SLOWMO_MS,
    dumpio: true,
  });
  return chrome;
};

module.exports = getChromeFromLocal;
