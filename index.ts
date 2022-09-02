import defaultI18n from './i18n_default.json';
import EventEmitter from 'events';

/**
 * Interface to return the list of languages
 * @interface LanguageListItem
 **/
export interface LanguageListItem {
    id: string;
    nameEnglish: string;
    nameNative: string;
    default: boolean;
    fallback?: string;
}

/**
 * Interface to represent locale information
 * @interface Locale
 **/
export interface Locale {
    localeCode?: string;
    fallback?: string;
    nameEnglish: string;
    nameNative: string;    
    dateFormat: string;
    currencySymbol: string;
    currencyCode: string;
    decimalSeparator: string;
    thousandsSeparator: string;
}

export default class SimpleI18n {

    //  Event emitter
    public events = new EventEmitter();

    //  This is a singleton class
    private static instance: SimpleI18n;

    //  This holds the current translations file
    private i18n: Object = defaultI18n;

    //  The currently selected language
    private currentLanguage: string = 'en-US';

    //  The currently selected locale
    private currentLocale: Locale = {
        "currencyCode": "USD",
        "currencySymbol": "$",
        "dateFormat": "mm/dd/yyyy",
        "decimalSeparator": ".",
        "thousandsSeparator": ",",
        "fallback": null,
        "nameEnglish": "English (USA)",
        "nameNative": "English (USA)"
    };

    //  The default language and locale, set by the constructor
    private defaultLanguage: string = 'en-US';
    private defaultLocale: Locale;

    /**
     * Constructor
     * @param defaultLanguage Default language code, eg. 'fr-CA'
     * @param i18n An object with localization strings
    **/
    constructor(
        defaultLanguage?: string,
        i18n?: Object
    ) {

        //  If the object already exists, return the existing instance
        if (SimpleI18n.instance)
            return SimpleI18n.instance;
        SimpleI18n.instance = this;

        if (i18n) this.i18n = i18n;
        this.language = defaultLanguage;

        this.defaultLanguage = this.language;
        this.defaultLocale = this.locale;
    }

    /**
     * Changes the current language. 
     * If it doesn't exist, it switches to the default language.
     * If the new language has a fallback, it will switch to the fallback language.
     * @param languageCode - the code of the language, ie. 'en-US', 'es-MX', 'fr-CA'
    **/
    public set language(languageCode: string) {

        //  Get new language code
        const currentLanguage =
            this.i18n.hasOwnProperty(languageCode)
                ?
                this.i18n[languageCode].i18n.fallback || languageCode
                :
                this.defaultLanguage;

        //  Get new locale
        let currentLocale: Locale = this.defaultLocale;

        if (this.i18n.hasOwnProperty(languageCode) && this.i18n[languageCode].hasOwnProperty('i18n'))
            currentLocale = { localeCode: languageCode, ...this.i18n[languageCode].i18n }

        else if (this.i18n.hasOwnProperty(currentLanguage) && !!this.i18n[currentLanguage].hasOwnProperty('i18n'))
            currentLocale = { localeCode: currentLanguage, ...this.i18n[currentLanguage].i18n }

        this.events.emit('switchLanguage', currentLanguage);
        this.events.emit('switchLocale', currentLocale);

        this.currentLanguage = currentLanguage;
        this.currentLocale = currentLocale;
    }

    /**
    * Getter: returns the current language code
    * @type (string)  
    **/
    public get language(): string {
        return this.currentLanguage;
    }

    /**
    * Getter: returns the current locale object
    * @type (Locale)  
    **/    
    public get locale(): Locale {
        return this.currentLocale;
    }

    /**
    * Returns the list of available languages
    * @type (LanguageListItem[])  
    **/        
    public get languages(): LanguageListItem[] {

        const languages: LanguageListItem[] = [];

        Object.keys(this.i18n).forEach(lang => {
            languages.push({
                id: lang,
                nameEnglish: this.i18n[lang].i18n.nameEnglish,
                nameNative: this.i18n[lang].i18n.nameNative,
                default: lang.toLowerCase() === this.defaultLanguage.toLowerCase(),
                fallback: this.i18n[lang].i18n.fallback || null
            });
        });

        return languages.sort((a: LanguageListItem, b: LanguageListItem) =>
            (a.id < b.id || a.id === this.defaultLanguage) ? -1 : 1
        );
    }

    /**
    * Translates a string
    * @param assetId Asset ID of the string
    * @param values Key-value list of values to be replaced in the string
    * @returns (string)  
    **/ 
    public translate = (assetId: string, values?: any): string => {

        if (!assetId) return;
        let translated: any = this.i18n[this.currentLanguage];
        assetId.split('.').forEach(key => translated = (!!translated && !!translated[key]) ? translated[key] : null);

        //  Replace placeholders between double curly braces with the corresponding value passed as argument
        //  eg: "Hello, {{ username }}!" => "Hello, Pikachu!"

        if (!!values && !!translated) {
            Object.keys(values).forEach((key: string) => {
                const rx = new RegExp('{{\\s*' + key + '\\s*}}', 'gm');
                translated = translated.replace(rx, values[key]);
            });
        }

        //  Return translation or the original asset ID if not found
        return translated || assetId;
    }
}