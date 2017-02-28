# OneSky Fetch [![Build Status](https://travis-ci.org/rkretzschmar/onesky-fetch.svg?branch=master)](https://travis-ci.org/rkretzschmar/onesky-fetch) [![npm version](https://badge.fury.io/js/onesky-fetch.svg)](https://badge.fury.io/js/onesky-fetch)
An npm package that provides you with a simple promise API, that fetches languages and translations 
from the OneSky REST API.

## Installation
```
npm install --save onesky-fetch
```

## Usage

### Import

```javascript
// ES5 syntax
var OneSkyFetch = require('onesky-fetch');

// ES6 syntax
import OneSkyFetch from 'onesky-fetch';
```

### Configuration

Obtain the necessary settings from here:
 
```https://<Your OneSky URL prefix>.oneskyapp.com/admin/site/settings```

and here:
 
```https://<Your OneSky URL prefix>.oneskyapp.com/admin/project/dashboard/project/<The ID of the currently open project>```

```javascript
// ES6 syntax
const oneSkyConfig = {
  secret: '<Your OneSky Secret Key>',
  apiKey: '<Your OneSky Public Key',
  projectId: '<Your OneSky project ID'
};
```

### Instantiation

```javascript
// ES6 syntax
const osf = OneSkyFetch(oneSkyConfig);
```

### Fetching Languages

```javascript
// in ES5 syntax
osf.fetchLanguages()
  .then(function(languages) {
    console.log(languages);
  });

// or ES6 syntax
osf.fetchLanguages()
  .then(languages => {
    console.log(languages);
  });

// or even async / await syntax
async function test() {
  const languages = await osf.fetchLanguages();
  console.log(languages);
}
```

#### Output

```
[ 
    { 
        code: 'it-IT',
        english_name: 'Italian (Italy)',
        local_name: 'Italiano (Italia)\u0000',
        custom_locale: null,
        locale: 'it',
        region: 'IT',
        is_base_language: false,
        is_ready_to_publish: false,
        translation_progress: '0.0%',
        last_updated_at: '#####',
        last_updated_at_timestamp: ##### 
    },
    // other languages
]
```


### Fetching Translations

```javascript
const languages = ['en','it-IT'];
const fileName = 'strings.json';

osf.fetchTranslations(languages, fileName)
  .then(function(translations) {
    console.log(translations);
  });
```

#### Output

```
[
  { language: 'en', text: '<Your english strings>' },
  { language: 'it-IT', text: '<Your italian strings>' }
]
```

### Fetching all translations

A convenient function to fetch all translations:

```javascript
const fileName = 'strings.json';

osf.fetchAllTranslations(fileName)
  .then(function(translations) {
    console.log(translations);
  });
```

This is just a chain of fetching languages and fetching their translations.

Feel free to contribute with additional functions.
