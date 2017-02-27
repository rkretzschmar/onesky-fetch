# OneSky Fetch
An npm package that provides you with a simple promise API, that fetches languages and translations 
from the OneSky REST API.

## Installation
```javascript
npm install --save onesky-fetch
```

## Usage

### Import

```javascript
var OneSkyFetch = require('onesky-fetch');
```

### Configuration

Obtain the necessary settings from here:
 
```https://<Your OneSky URL prefix>.oneskyapp.com/admin/site/settings```

and here:
 
```https://<Your OneSky URL prefix>.oneskyapp.com/admin/project/dashboard/project/<The ID of the currently open project>```

```javascript
var oneSkyConfig = {
  secret: '<Your OneSky Secret Key>',
  apiKey: '<Your OneSky Public Key',
  projectId: '<Your OneSky project ID'
};
```

### Instantiation

```javascript
var osf = OneSkyFetch(oneSkyConfig);
```

### Fetching Languages

```javascript
osf.fetchLanguages()
  .then(function(languages) {
    console.log(languages);
  });
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
