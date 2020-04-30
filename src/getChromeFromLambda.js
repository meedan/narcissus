const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');

const getChromeFromLambda = async () => {
  const chrome = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });
  return chrome;
};

module.exports = getChromeFromLambda;
