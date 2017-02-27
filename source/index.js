import md5 from 'md5';

const fetch = (typeof window !== 'undefined' && window.fetch)
  ? window.fetch
  : require('node-fetch');

const apiUrl = 'https://platform.api.onesky.io/1';

function getDevHash(secret) {
  const timestamp = Math.floor(Date.now() / 1000);
  return {
    dev_hash: md5(timestamp + secret),
    timestamp: timestamp
  };
}

function buildUrlParams(obj) {
  let str = '';
  for (let key in obj) {
    if (str !== '') {
      str += '&';
    }
    str += `${key}=${obj[key]}`;
  }

  return str;
}

function oneSkyGetRequest(config, resourcePath, params = {}) {
  const devHash = getDevHash(config.secret);
  const urlParams = {
    api_key: config.apiKey,
    ...devHash,
    ...params
  };
  const url = `${apiUrl}${resourcePath}?${buildUrlParams(urlParams)}`;
  return fetch(url);
}

module.exports = function (config) {
  return {
    config: config,
    fetchLanguages() {
      const resourcePath = `/projects/${config.projectId}/languages`;
      return oneSkyGetRequest(config, resourcePath)
        .then(res => res.json());
    },
    fetchTranslations(languages, fileName) {
      const languages_ = (typeof languages == 'string') ? [languages] : languages;
      const languageFetches = languages_.map(language => {
        const params = {
          locale: language,
          source_file_name: fileName,
          export_file_name: `${language}.json`
        };
        const resourcePath = `/projects/${config.projectId}/translations`;
        return oneSkyGetRequest(config, resourcePath, params)
          .then(res => res.text())
          .then(text => ({[language]: text}));
      });
      return Promise.all(languageFetches);
    },
    fetchAllTranslations(fileName) {
      return this.fetchLanguages()
        .then(languages => languages.data.map(language => language.code))
        .then(languages => this.fetchTranslations(languages, fileName));
    }
  };
};
