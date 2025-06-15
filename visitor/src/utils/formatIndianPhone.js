// utils/formatIndianPhone.js
export const formatIndianPhone = (number) => {
  const raw = number.replace(/\D/g, '').slice(-10); // get last 10 digits
  if (raw.length < 4) return raw;
  if (raw.length < 7) return `${raw.slice(0, 4)} ${raw.slice(4)}`;
  return `${raw.slice(0, 4)} ${raw.slice(4, 7)} ${raw.slice(7, 10)}`;
};
