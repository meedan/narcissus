const getChromeFromLambda = require('./getChromeFromLambda');
const getChromeFromLocal = require('./getChromeFromLocal');
const { takeScreenshot } = require('./takeScreenshot.js');

exports.handler = async (event, context, callback) => {
  let callbackRef = callback;
  if (!process.env.RUNNING_LOCALLY) {
    callbackRef = (statusCode, message) => {
      const body = {};
      if (statusCode === 200) {
        body.url = message;
      } else {
        body.error = message;
      }
      return {
        statusCode,
        body: JSON.stringify(body),
      };
    };
  }

  let browser = null;

  if (!event.queryStringParameters) {
    return callbackRef(400, 'You need a URL');
  }

  const targetUrl = event.queryStringParameters.url;
  const targetSelector = event.queryStringParameters.selector;

  if (!targetUrl) {
    return callbackRef(400, 'You need a URL');
  }

  if (process.env.RUNNING_LOCALLY) {
    browser = await getChromeFromLocal();
  } else {
    browser = await getChromeFromLambda();
  }

  try {
    const result = await takeScreenshot(browser, targetUrl, targetSelector);
    return callbackRef(200, result);
  } catch (e) {
    console.error(e.message);
    return callbackRef(500, 'Error 500, please check the logs');
  } finally {
    await browser.close();
  }
};
