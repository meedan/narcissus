const AWS = require('aws-sdk-mock');
let puppeteer = require('puppeteer-core');
const index = require('./index');
const getChromeFromLocal = require('./getChromeFromLocal');
const about = require('./about');
const config = require('./config');
const narcissusConfig = require('./narcissusConfig');

jest.setTimeout(120000);

AWS.mock('S3', 'upload', (params, callback) => (
  callback(null, {
    ETag: 'SomeETag"',
    Location: `/tmp/${params.Key.replace(/^narcissus\//, '')}`,
    Key: 'RandomKey',
    Bucket: 'TestBucket',
  })
));

Object.assign(config, {
  s3_endpoint: 'test',
  s3_access_key: 'test',
  s3_secret_key: 'test',
  s3_bucket: 'test',
  s3_bucket_region: 'test',
});

const callback = (status, message) => ({ status, message });

test('should have a valid config', () => {
  expect(config).toEqual(
    expect.objectContaining({
      s3_endpoint: expect.any(String),
      s3_access_key: expect.any(String),
      s3_secret_key: expect.any(String),
      s3_bucket: expect.any(String),
      s3_bucket_region: expect.any(String),
    })
  );
});

test('should return error if no parameters are sent', async () => {
  const response = await index.handler({});
  expect(response.statusCode).toBe(400);
});

test('should return error if no URL is sent', async () => {
  const response = await index.handler({ queryStringParameters: {} });
  expect(response.statusCode).toBe(400);
});

test('should pass callback function as parameter', async () => {
  const response = await index.handler({}, { runningLocally: true }, callback);
  expect(response.status).toBe(400);
});

test('should take screenshot with selector', async () => {
  const e = { queryStringParameters: { url: 'https://ca.ios.ba', selector: '#avatar' } };
  const response = await index.handler(e, { runningLocally: true }, callback);
  expect(response.status).toBe(200);
  expect(response.message).toMatch(/tmp/);
});

test('should take full page screenshot', async () => {
  config.s3_path_style = false;
  const e = { queryStringParameters: { url: 'https://ca.ios.ba/slack' } };
  const response = await index.handler(e, { runningLocally: true }, callback);
  expect(response.status).toBe(200);
  expect(response.message).toMatch(/tmp/);
});

test('should handle screenshot error', async () => {
  puppeteer.launch = (params) => ({ test: 'Mocked Browser Instance', close: () => {} });
  const e = { queryStringParameters: { url: 'https://ca.ios.ba/', selector: '#avatar' } };
  const response = await index.handler(e, { runningLocally: false }, callback);
  expect(response.statusCode).toBe(500);
});

test('should use default callback', async () => {
  const browser = await getChromeFromLocal();
  puppeteer.launch = (params) => (browser);
  const e = { queryStringParameters: { url: 'https://ca.ios.ba/', selector: '#avatar' } };
  const response = await index.handler(e, { runningLocally: false }, callback);
  expect(response.statusCode).toBe(200);
});

test('should information about the service', async () => {
  const response = await about.handler();
  expect(response.statusCode).toBe(200);
});

test('should get configuration from environment if available', async () => {
  const OLD_ENV = process.env;
  expect(narcissusConfig.get('s3_endpoint')).toBe('test');
  process.env.s3_endpoint = 'test-2';
  expect(narcissusConfig.get('s3_endpoint')).toBe('test-2');
  expect(narcissusConfig.get('not_defined')).toBe(undefined);
  expect(narcissusConfig.get('not_defined', 'default')).toBe('default');
  process.env = OLD_ENV;
});
