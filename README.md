# Simple i18n #

A platform and framework independent NPM dependency for simple and easy internationalization. Use it for any frontend or backend (Node) project.

Supports:

- string translations
- placeholders for variables
- locales
- instant language switching
- language fallbacks

# Installation #

Install the package with npm:

`npm i simple-i18n`

# How to use #

Create an instance of the `SimpleI18n` object in your JavaScript or TypeScript project:

```
import SimpleI18n from "simple-i18n";

const i18n = new SimpleI18n();

console.log(i18n.translate('test'));
```

This will display a test string from the default translation file. However, you probably want your own translations. To use your own translation file:

```
import SimpleI18n from "simple-i18n";
import translations from "assets/translations.json";

const i18n = new SimpleI18n('en-US', translations);

console.log(i18n.translate('mainpage.title'));
```

# How to add translations #

All translated strings should be collected in a single JSON structure. It's recommended to store them in a separate JSON file and import it.

The JSON tree contains all translations for all available languages. Each key in the root is a language code like `en-US` or `fr-FR`. Under each key there's a complex structure. It may look like this:

```
"en-US": {                                                // Language code
    "i18n": {
        "locale": {                                       // Locale data
            "currencyCode": "USD",
            "currencySymbol": "$",
            "dateFormat": "MM/DD/YYYY",
            "decimalSeparator": ".",
            "thousandsSeparator": ","
        },
        "name_english": "English (US)",                   //  Name of the language in English
        "name_native": "English (US)"                     //  Name of the language in the language itself
    },

    "test": "This is an English string",                  //  Translations
    "hello": "Hello, {{ name }}!"
}
```

The `i18n` node is mandatory under each entry and contains locale information. The currently selected locale can be retrieved by the read-only `currentLocale` property.

Translations are key-value pairs. The key is an asset ID, and the value is a string. You can use the asset ID to refer to the string when calling the `translate()` method.

Placeholders between double curly braces can be inserted into translated strings for dynamic values such as a name in a greeting.

You can add an optional `fallback` value to `i18n` if you want a language to use translations from another one, but with a different locale. For example you may have French language, but European French and Canadian French people use different currency, number separators and date format. In this case create a separate `fr-FR` and `fr-CA` language, configure locales, then add `"fallback": "fr-FR"` to French Canadian. As a result, SimpleI18n will switch locale when changing from French to Canadian French, but the translations remain the same.

For a working example of a translation file, see `i18n_default.json`.

To easily edit translations I suggest using the free editor Loco under https://localise.biz. Export your project as "JSON, Single/Multi-language". If you use fallbacks, also set "Translated" under Settings, so you won't get a ton of unnecessary empty strings for a language you don't actually use.

# Properties #

## language ##
Sets the current language and also changes the locale. For example, to switch to Russian:

```
i18n.currentLanguage = 'ru-RU';
console.log(i18n.language);
```
```
"ru-RU"
```

In some frameworks like React you may have to trigger a DOM update to see your content changing.

If the selected language isn't in the translation file, SimpleI18n will fall back to the default language.

## locale ##

Returns the current locale. Read only. To set the locale change the language. Example:

```
console.log(i18n.locale);
```
```
{
    "currencyCode": "USD",
    "currencySymbol": "$",
    "dateFormat": "MM/DD/YYYY",
    "decimalSeparator": ".",
    "thousandsSeparator": ","
}
```

## languages ##

Returns available languages as an array. Example:

```
console.log(i18n.languages);
```
```
0: {id: "en-US", name_english: "English (US)", name_native: "English (US)", default: true, fallback: null}
1: {id: "fr-CA", name_english: "French (CA)", name_native: "Français (CA)", default: false, fallback: "fr-FR"}
2: {id: "fr-FR", name_english: "French (FR)", name_native: "Français (FR)", default: false, fallback: null}
```

# Methods #

## translate(assetId: string, values?: any) ##

Returns a translated string based on an asset ID.

```
console.log(i18n.translate('test'));
```
```
"This is an English string"
```

You can pass values in the `values` argument as key-value pairs to replace placeholders.

```
console.log(i18n.translate('hello', { name: 'Kevin' }));
```
```
"Hello, Kevin!"
```

# Events #

## switchLanguage ##

Triggered when the language was successfully changed. Returns the current language code.

## switchLocale ##

Triggered when the locale was successfully changed. Returns the language code of the locale used.
