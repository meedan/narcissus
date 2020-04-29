const puppeteer = require('puppeteer-core');
const getChromeFromLambda = require('./getChromeFromLambda');
const getChromeFromLocal = require('./getChromeFromLocal');

const { takeScreenshot } = require('./takeScreenshot.js');

exports.handler = async (event, context, callback) => {
  const contextRef = context;
  if (contextRef) {
    contextRef.callbackWaitsForEmptyEventLoop = false;
  }
  let browser = null;

  if (!event.queryStringParameters) {
    return callback(400, 'You need a URL');
  }

  const targetUrl = event.queryStringParameters.url;
  const targetSelector = event.queryStringParameters.selector;

  if (!targetUrl) {
    return callback(400, 'You need a URL');
  }

  if (process.env.RUNNING_LOCALLY) {
    browser = await getChromeFromLocal();
  } else {
    const chrome = await getChromeFromLambda();
    browser = await puppeteer.connect({
      browserWSEndpoint: chrome.endpoint,
    });
  }

  try {
    const result = await takeScreenshot(browser, targetUrl, targetSelector);
    return callback(200, result);
  } catch (e) {
    console.error(e.message);
    return callback(500, 'Error 500, please check the logs');
  } finally {
    if (process.env.RUNNING_LOCALLY) {
      await browser.close();
    }
  }
};
