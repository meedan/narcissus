const crypto = require('crypto');
const { uploadScreenshot } = require('./uploadScreenshot.js');

exports.takeScreenshot = async (browser, targetUrl, targetSelector) => {
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 2,
  });

  await page.goto(targetUrl, {
    waitUntil: ['domcontentloaded', 'networkidle2'],
  });

  const name = crypto.randomBytes(20).toString('hex');
  const imagePath = `/tmp/screenshot-${name}.png`;
  const screenshotOptions = { path: imagePath };

  if (targetSelector) {
    const element = await page.$(targetSelector);

    const {
      x,
      y,
      width,
      height,
    } = await element.boundingBox();

    screenshotOptions.clip = {
      x,
      y,
      width,
      height,
    };
  } else {
    screenshotOptions.fullPage = true;
  }

  const timeout = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  await timeout(3000);
  await page.screenshot(screenshotOptions);
  const remoteImagePath = await uploadScreenshot(name, imagePath);
  return remoteImagePath;
};
