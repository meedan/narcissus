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

  let element = await page.$('body');
  if (targetSelector) {
    element = await page.$(targetSelector);
  }

  const {
    x,
    y,
    width,
    height,
  } = await element.boundingBox();

  const name = crypto.randomBytes(20).toString('hex');
  const imagePath = `/tmp/screenshot-${name}.png`;

  await page.screenshot({
    path: imagePath,
    clip: {
      x: x + 2,
      y: y + 2,
      width: width - 2,
      height: height - 2,
    },
  });

  const remoteImagePath = await uploadScreenshot(imagePath);

  return remoteImagePath;
};
