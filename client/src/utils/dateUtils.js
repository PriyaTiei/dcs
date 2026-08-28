import moment from 'moment';

/**
 * Formats a date object or string into YYYY-MM-DD
 */
export function formatYYYYMMDD(date) {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';
  return moment(d).format('YYYY-MM-DD');
}

/**
 * Formats a timestamp into standard shop-floor DD-MMMM-YYYY HH:mm:ss
 */
export function formatFullDateTime(date) {
  if (!date) return '-';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return String(date);
  return moment(d).format('DD-MMMM-YYYY HH:mm:ss');
}

/**
 * Formats a timestamp into standard YYYY-MM-DD HH:mm:ss
 */
export function formatStandardDateTime(date) {
  if (!date) return '-';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return String(date);
  return moment(d).format('YYYY-MM-DD HH:mm:ss');
}

/**
 * Formats a timestamp into 12-hour AM/PM format (e.g. 5/14/2026, 2:30:15 PM)
 */
export function format12HourTime(date) {
  if (!date) return '-';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return String(date);
  return moment(d).format('M/DD/YYYY, h:mm:ss A');
}

export default {
  formatYYYYMMDD,
  formatFullDateTime,
  formatStandardDateTime,
  format12HourTime,
};
