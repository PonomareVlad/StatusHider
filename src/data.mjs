import {getURL} from "vercel-grammy";
import empty from "./l10n/empty.mjs";
import en from "./l10n/en.mjs";
import ru from "./l10n/ru.mjs";

export const locales = {en, ru};

export const fallbackLocale = "en";

export const url = new URL(getURL({path: "sticker.tgs"}));

export const getLocaleKey = locale => locale === fallbackLocale ? undefined : locale;

export const getFromLocale = (locale, key, ...args) => {
    const target = locale[key] || key;
    return typeof target === "function" ?
        target(...args) :
        target;
}

export function getByLocales(key) {
    const entries = Object.entries(locales).map(
        ([name, locale]) => [name, getFromLocale(new locale(), key)]
    );
    return Object.fromEntries(entries.filter(Boolean));
}

export function l10n(ctx, next) {
    const locale = new (
        locales[ctx.from?.language_code] ||
        locales[fallbackLocale] ||
        empty
    );
    ctx.l = (key, ...args) =>
        getFromLocale(locale, key, ...args);
    return next();
}
