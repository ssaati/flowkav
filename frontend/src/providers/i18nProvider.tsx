import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from '../i18n/en';
import farsiMessages from '../i18n/fa';

const messages = {
    fr: () => import('../i18n/fa').then(messages => messages.default),
};

export default polyglotI18nProvider(
    locale => {
        if (locale === 'en') {
            return messages[locale]();
        }

        // Always fallback on english
        return farsiMessages;
    },
    'fa',
    [
        { locale: 'en', name: 'English' },
        { locale: 'fa', name: 'فارسی' },
    ]
);
