# Simple i18n #

A platform and framework independent NPM package for simple and easy internationalization.

Supports:

- string translations
- placeholders for variables
- date, currency and separator locales
- instant language switching
- language fallbacks

# Installation #

Install the package with npm:

`npm i @tomcatmwi/simple-i18n `

# How to use #

Create an instance of the `SimpleI18n` object in your JavaScript or TypeScript project:

```
import SimpleI18n from "simple-i18n";

const i18n = new SimpleI18n();

console.log(i18n.translate('test'));
```

This will display a test string from the default translation file.

# How to use your own translation file? #

You can create your own JSON file with translations, import it into your application, and pass it to SimpleI18n at object creation:

```
import SimpleI18n from "simple-i18n";
import translations from "assets/translations.json";

const i18n = new SimpleI18n('en-US', translations);

console.log(i18n.translate('mainpage.title'));
```

# Steps to create a translation #

Translations should be collected in a single JSON file, the following way.

## Step 1: Define languages ##

Create a blank JSON file, and add the languages you'd like to use:

```
{
    "en-US": {},
    "en-UK": {},
    "de-DE": {},
    "es-ES": {},
    "es-MX": {}
}
```

## Step 2: Define locales ##

Each language must have an `i18n` subnode with locale settings. Here is a sample.

```
"en-US": {                                                // Language code
    "i18n": {
        "currencyCode": "USD",                            // Currency code
        "currencySymbol": "$",                            // Currency symbol
        "dateFormat": "MM/DD/YYYY",                       // Date format
        "decimalSeparator": ".",                          // Decimal separator
        "thousandsSeparator": ","                         // Thousands separator
        "fallback": null,                                 //  Fallback - see next chapter
        "nameEnglish": "English (US)",                   //  Name of the language in English
        "nameNative": "English (US)"                     //  Name of the language in the language
    }
}
```

If you omit this information, `simple-i18n` will fall back to US English locale.

## Step 3: Define fallbacks ##

Some languages are used in multiple countries. You might still need to define them separately due to locale differences. For example, French and Québecois speak the same language, but use a different date format, currency and decimal separator.

The `i18n.fallback` node contains the code of the language to fall back to. For example, for Québecois French (`fr-CA`) you can enter `fr-FR`. If `simple-i18n` finds a fallback value, it will display translations in the fallback language (if it exists). 

In the example above, the `en-US` language setting will fall back to the translation strings used in `en-UK`. There's no need to define any translations in the `en-US` locale.

## Step 4: Add translation strings ##

Translation strings are defined as key-value pairs. For example:

```
"en-UK": {
    "pageTitle": "Hello, this is my website!",
    "loginButton": "Log in",
    "logoutButton": "Log out"
}
```

To display a translated string:

```
import { SimpleI18n } from "@tomcatmwi/simplei18n";
import i18n from "./assets/i18n.json";

const i18n = new SimpleI18n(i18n, 'en-UK');

console.log(i18n.translate('pageTitle'));
```

You can organize your strings into multi-level nodes.

```
"en-UK": {
    "loginPage": {
        "pageTitle": "Hello, this is my website!",
        "buttons": {
            "loginButton": "Log in",
            "logoutButton": "Log out"
        }
    },
    "mainPage": {
        ...
    }
}
```

In this case, you can refer to your strings with a path string:

```
console.log(i18n.translate('loginPage.buttons.loginButton'));
```

## Dynamic values ##

If you want to display a dynamic value, you can use double curly braces:

```
"en-UK": {
    "gasPrice": "The price of gas is £ {{ priceValue }} today.
}
```

You can replace placeholders by specifying a key-value list as a second argument:

```
i18n.translate('gasPrice', { priceValue: 3000 });
```

Alas, `SimpleI18n` doesn't currently offer built-in number or date formatting methods, but it's a plan for the future.

# Is there some tool to create translation files? #

Yes, there is! I am using `https://localise.biz` for this purpose.

### Very quick instructions ###

Create a project, add your translations. 

If you wish to build a multi-level JSON file, use periods to specify node paths as Asset ID. Example: `loginPage.buttons.loginButton`.

You can also add locale values as `i18n.currencyCode`, `i18n.currencySymbol`, etc., so you won't need to add them manually later.

Click the wrench icon to the right, select `Export the whole project`. Use the following settings:

- Locales: Multiple (select all languages)
- Fallback: None
- File format: JSON, simple (multi-language)
- Settings:
  - Index: auto
  - Order: Asset ID
  - Status: Translated

The *Status* setting is important if you use fallback languages. If it's on *Auto*, untranslated strings will be exported, and they'll unnecessarily increase the size of your JSON file.

# Object properties and methods #

## Properties ##

### language ###
The language code of the currently selected language.

### locale ###
The currently selected locale. Read-only.

### languages ###
Currently available languages. Read-only.

## Methods ##

### translate(assetID: string, values: object) ###
Returns the translation of a given asset ID.