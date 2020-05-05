exports.handler = async () => {
  const body = {
    '/?url=:url&selector=:selector': 'Saves a screenshot of the whole webpage related to the mandatory "url" parameter or limited by the element represented by the optional "selector" parameter, which is supported to be a CSS selector. Returns an object with a "url" key pointing to the public address of the screenshot, or an "error" key with an error message.',
  };
  return {
    statusCode: 200,
    body: JSON.stringify(body),
  };
};
