const crypto = require('crypto');
const { uploadScreenshot } = require('./uploadScreenshot.js');

exports.takeScreenshot = async (browser, targetUrl, targetSelector) => {
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
    isMobile: true,
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
      x: x + 2,
      y: y + 2,
      width: width - 2,
      height: height - 2,
    };
  } else {
    screenshotOptions.fullPage = true;
  }

  const timeout = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  await timeout(2000);
  await page.screenshot(screenshotOptions);
  const remoteImagePath = await uploadScreenshot(imagePath);
  return remoteImagePath;
};
