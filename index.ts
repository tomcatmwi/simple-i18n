import defaultI18n from './i18n_default.json';
import EventEmitter from 'events';

export interface LanguageListItem {
    id: string;
    name_english: string;
    name_native: string;
    default: boolean;
    fallback?: string;
}

export interface Locale {
    localeCode?: string;
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
    private currentLocale: Locale;

    //  The default language and locale, set by the constructor
    private defaultLanguage: string;
    private defaultLocale: Locale;

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

    //  Switches to a new language
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

        if (this.i18n.hasOwnProperty(languageCode) && this.i18n[languageCode].i18n.locale)
            currentLocale = { localeCode: languageCode, ...this.i18n[languageCode].i18n.locale }

        else if (this.i18n.hasOwnProperty(currentLanguage) && this.i18n[currentLanguage].i18n.locale)
            currentLocale = { localeCode: currentLanguage, ...this.i18n[currentLanguage].i18n.locale }

        // if (currentLanguage !== this.currentLanguage)
        this.events.emit('switchLanguage', currentLanguage);
        this.events.emit('switchLocale', currentLocale);

        this.currentLanguage = currentLanguage;
        this.currentLocale = currentLocale;

    }

    //  Gets the current language
    public get language(): string {
        return this.currentLanguage;
    }

    public get locale(): Locale {
        return this.currentLocale;
    }

    //  Returns the list of available languages
    public get languages(): LanguageListItem[] {

        const languages: LanguageListItem[] = [];

        Object.keys(this.i18n).forEach(lang => {
            languages.push({
                id: lang,
                name_english: this.i18n[lang].i18n.name_english,
                name_native: this.i18n[lang].i18n.name_native,
                default: lang.toLowerCase() === this.defaultLanguage.toLowerCase(),
                fallback: this.i18n[lang].i18n.fallback || null
            });
        });

        return languages.sort((a: LanguageListItem, b: LanguageListItem) =>
            (a.id < b.id || a.id === this.defaultLanguage) ? -1 : 1
        );
    }

    //  Translates a string
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