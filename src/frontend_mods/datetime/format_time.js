/* eslint-disable no-use-before-define */
import memoizeOne from 'memoize-one';
// import '../../resources/intl-polyfill';
import { useAmPm } from './use_am_pm';

// 9:15 PM || 21:15
export const formatTime = (dateObj, locale) => formatTimeMem(locale).format(dateObj);

const formatTimeMem = memoizeOne(
  (locale) => new Intl.DateTimeFormat(
      locale.language === 'en' && !useAmPm(locale)
        ? 'en-u-hc-h23'
        : locale.language,
      {
        hour: 'numeric',
        minute: '2-digit',
        hour12: useAmPm(locale),
      },
    ),
);

// 9:15:24 PM || 21:15:24
export const formatTimeWithSeconds = (dateObj, locale) => formatTimeWithSecondsMem(locale).format(dateObj);

const formatTimeWithSecondsMem = memoizeOne(
  (locale) => new Intl.DateTimeFormat(
      locale.language === 'en' && !useAmPm(locale)
        ? 'en-u-hc-h23'
        : locale.language,
      {
        hour: useAmPm(locale) ? 'numeric' : '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: useAmPm(locale),
      },
    ),
);

// Tuesday 7:00 PM || Tuesday 19:00
export const formatTimeWeekday = (dateObj, locale) => formatTimeWeekdayMem(locale).format(dateObj);

const formatTimeWeekdayMem = memoizeOne(
  (locale) => new Intl.DateTimeFormat(
      locale.language === 'en' && !useAmPm(locale)
        ? 'en-u-hc-h23'
        : locale.language,
      {
        weekday: 'long',
        hour: useAmPm(locale) ? 'numeric' : '2-digit',
        minute: '2-digit',
        hour12: useAmPm(locale),
      },
    ),
);

// 21:15
export const formatTime24h = (dateObj) => formatTime24hMem().format(dateObj);

const formatTime24hMem = memoizeOne(
  () =>
    // en-GB to fix Chrome 24:59 to 0:59 https://stackoverflow.com/a/60898146
    // eslint-disable-next-line implicit-arrow-linebreak
    new Intl.DateTimeFormat('en-GB', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false,
    }),
);
