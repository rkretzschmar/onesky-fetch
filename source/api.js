import md5 from 'md5';

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

function oneSkyGetRequest(fetch, config, resourcePath, params = {}) {
  const devHash = getDevHash(config.secret);
  const urlParams = {
    api_key: config.apiKey,
    ...devHash,
    ...params
  };
  const url = `${apiUrl}${resourcePath}?${buildUrlParams(urlParams)}`;
  return fetch(url);
}

module.exports = (fetch) => (config) => {
  return {
    config: config,
    fetchLanguages() {
      const resourcePath = `/projects/${config.projectId}/languages`;
      return oneSkyGetRequest(fetch, config, resourcePath)
        .then(res => {
          if (res.status > 299) {
            throw new Error(`Error fetching languages: ${res.statusMessage}`);
          }
          return res.json();
        })
        .then(json => json.data);
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
        return oneSkyGetRequest(fetch, config, resourcePath, params)
          .then(res => {
            if (res.status > 299) {
              throw new Error(`Error fetching translations: ${res.statusMessage}`);
            }
            return res.text();
          })
          .then(text => ({language, text}));
      });
      return Promise
        .all(languageFetches);
    },
    fetchAllTranslations(fileName) {
      return this.fetchLanguages()
        .then(languages => languages.map(language => language.code))
        .then(languages => this.fetchTranslations(languages, fileName));
    }
  };
};
