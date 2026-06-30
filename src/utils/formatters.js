import dayjs from 'dayjs';

export const formatDate = (value) => (value ? dayjs(value).format('DD/MM/YYYY') : '-');
export const formatDateTime = (value) => (value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '-');
export const formatTime = (value) => (value ? dayjs(value).format('HH:mm') : '-');
export const formatId = (prefix, number) => `${prefix}-${dayjs().format('YYYYMM')}${String(number).padStart(4, '0')}`;

export default {
  formatDate,
  formatDateTime,
  formatTime,
  formatId,
};
