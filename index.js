var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import defaultI18n from './i18n_default.json';
import EventEmitter from 'events';
var SimpleI18n = /** @class */ (function () {
    function SimpleI18n(defaultLanguage, i18n) {
        var _this = this;
        //  Event emitter
        this.events = new EventEmitter();
        //  This holds the current translations file
        this.i18n = defaultI18n;
        //  The currently selected language
        this.currentLanguage = 'en-US';
        //  Translates a string
        this.translate = function (assetId, values) {
            if (!assetId)
                return;
            var translated = _this.i18n[_this.currentLanguage];
            assetId.split('.').forEach(function (key) { return translated = (!!translated && !!translated[key]) ? translated[key] : null; });
            //  Replace placeholders between double curly braces with the corresponding value passed as argument
            //  eg: "Hello, {{ username }}!" => "Hello, Pikachu!"
            if (!!values && !!translated) {
                Object.keys(values).forEach(function (key) {
                    var rx = new RegExp('{{\\s*' + key + '\\s*}}', 'gm');
                    translated = translated.replace(rx, values[key]);
                });
            }
            //  Return translation or the original asset ID if not found
            return translated || assetId;
        };
        //  If the object already exists, return the existing instance
        if (SimpleI18n.instance)
            return SimpleI18n.instance;
        SimpleI18n.instance = this;
        if (i18n)
            this.i18n = i18n;
        this.language = defaultLanguage;
        this.defaultLanguage = this.language;
        this.defaultLocale = this.locale;
    }
    Object.defineProperty(SimpleI18n.prototype, "language", {
        //  Gets the current language
        get: function () {
            return this.currentLanguage;
        },
        //  Switches to a new language
        set: function (languageCode) {
            //  Get new language code
            var currentLanguage = this.i18n.hasOwnProperty(languageCode)
                ?
                    this.i18n[languageCode].i18n.fallback || languageCode
                :
                    this.defaultLanguage;
            //  Get new locale
            var currentLocale = this.defaultLocale;
            if (this.i18n.hasOwnProperty(languageCode) && this.i18n[languageCode].i18n.locale)
                currentLocale = __assign({ localeCode: languageCode }, this.i18n[languageCode].i18n.locale);
            else if (this.i18n.hasOwnProperty(currentLanguage) && this.i18n[currentLanguage].i18n.locale)
                currentLocale = __assign({ localeCode: currentLanguage }, this.i18n[currentLanguage].i18n.locale);
            // if (currentLanguage !== this.currentLanguage)
            this.events.emit('switchLanguage', currentLanguage);
            this.events.emit('switchLocale', currentLocale);
            this.currentLanguage = currentLanguage;
            this.currentLocale = currentLocale;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SimpleI18n.prototype, "locale", {
        get: function () {
            return this.currentLocale;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SimpleI18n.prototype, "languages", {
        //  Returns the list of available languages
        get: function () {
            var _this = this;
            var languages = [];
            Object.keys(this.i18n).forEach(function (lang) {
                languages.push({
                    id: lang,
                    name_english: _this.i18n[lang].i18n.name_english,
                    name_native: _this.i18n[lang].i18n.name_native,
                    default: lang.toLowerCase() === _this.defaultLanguage.toLowerCase(),
                    fallback: _this.i18n[lang].i18n.fallback || null
                });
            });
            return languages.sort(function (a, b) {
                return (a.id < b.id || a.id === _this.defaultLanguage) ? -1 : 1;
            });
        },
        enumerable: false,
        configurable: true
    });
    return SimpleI18n;
}());
export default SimpleI18n;
