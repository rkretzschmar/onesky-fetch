import OneSkyFetch from '../node.index';
import testConfig from '../__mocks__/test-config';

jest.mock('node-fetch');

describe('OneSkyFetch tests', () => {

  it('Fetching languages works as expected', async() => {

    // Arrange
    const osf = OneSkyFetch(testConfig);

    // Act
    const languages = await osf.fetchLanguages();

    // Assert
    expect(languages.length).toBe(3);
    const languageMap = languages.reduce((acc, language) =>
      ({...acc, [language.code]: true}), {});

    expect(languageMap.en).toBeTruthy();
    expect(languageMap.fr).toBeTruthy();
    expect(languageMap.it).toBeTruthy();

  });

  it('Fetching translations works as expected', async() => {

    // Arrange
    const osf = OneSkyFetch(testConfig);
    const languages = ['en', 'it'];
    const fileName = 'strings.json';

    // Act
    const translations = await osf.fetchTranslations(languages, fileName);

    // Assert
    expect(translations.length).toBe(2);
    translations.forEach(translation =>
      expect(translation.text).toBe(`${translation.language} content`));
  });

  it('Fetching all translations works as expected', async() => {

    // Arrange
    const osf = OneSkyFetch(testConfig);
    const fileName = 'strings.json';

    // Act
    const translations = await osf.fetchAllTranslations(fileName);

    // Assert
    expect(translations.length).toBe(3);
    translations.forEach(translation =>
      expect(translation.text).toBe(`${translation.language} content`));
  });
});
