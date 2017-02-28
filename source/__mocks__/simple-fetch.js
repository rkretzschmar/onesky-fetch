const testConfig = require('./test-config');
const languagesObjects = {
  meta: {},
  data: [
    {code: 'en'},
    {code: 'fr'},
    {code: 'it'}
  ]
};

const languagesPromise = () => new Promise(resolve => {
  process.nextTick(() => resolve(languagesObjects));
});

const languagesResponse = () => ({
  json: languagesPromise
});

const textPromise = (language) => () => new Promise(resolve => {
  process.nextTick(() => resolve(`${language} content`));
});

const textResponse = (language) => ({
  text: textPromise(language)
});

function createResponse(response) {
  return new Promise(resolve => {
    process.nextTick(() => resolve(response));
  });
}

function validateAuth(url) {
  return !url.indexOf(testConfig.apiKey) || !url.indexOf(testConfig.projectId);

}

module.exports = function(url) {

  if (url.indexOf('languages') > -1) {
    // validate URL
    if (validateAuth(url)) {
      return null;
    }

    return createResponse(languagesResponse());
  } else if (url.indexOf('translations') > -1) {

    if (
      validateAuth(url) ||
      !url.indexOf('locale') ||
      !url.indexOf('source_file_name=strings.json') ||
      !url.indexOf('export_file_name')
    ) {
      return null;
    }

    const locale = url
      .split('&')
      .filter(token => token.indexOf('locale') > -1)
      .join()
      .split('=')[1];

    const textRes = textResponse(locale);
    return createResponse(textRes);
  } else {
    return null;
  }
};
