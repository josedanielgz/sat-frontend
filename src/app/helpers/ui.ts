import { DatePipe } from '@angular/common';
import { Role } from '../model/role';

const normalizeText = (text: String) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const convertToRoman = (semester: number): String[] => {
  const romanos: String[] = [
    'I',
    'II',
    'III',
    'IV',
    'V',
    'VI',
    'VII',
    'VIII',
    'IX',
    'X',
    'XI',
    'XII',
    'XIII',
    'XIV',
    'XV',
    'XVI',
    'XVII',
    'XVIII',
    'XIX',
    'XX',
  ];
  return romanos.slice(0, semester);
};

const resetDate = (date: string) => {
  const newDate = new Date(date);
  newDate.setHours(0);
  newDate.setMinutes(0);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  newDate.setDate(newDate.getDate() + 1);
  return newDate.toISOString();
};

const getDateUTC = (date: Date = new Date()) => {
  const culo = new DatePipe('es-Ar').transform(
    date.toISOString(),
    "M d, y, HH:mm:ss 'UTC'"
  );
  console.log(culo);
  return culo;
};

const getColor = (value: number) =>
  value > 0 && value < 2
    ? { color: 'red', risk: 'en Riesgo Crítico' }
    : value >= 2 && value < 3
    ? { color: 'orange', risk: 'en Riesgo Moderado' }
    : value >= 3 && value < 4
    ? { color: 'yellow', risk: 'en Riesgo Leve' }
    : value >= 4 && value <= 5
    ? { color: 'green', risk: 'Sin riesgo' }
    : { color: 'gray', risk: 'Cargando...' };

const capitalizeText = (risk: String) =>
  risk === 'critico' ? 'Crítico' : risk.charAt(0).toUpperCase() + risk.slice(1);

const normalizeRoles = (role) =>
  role
    .split('')
    .map((letra) => (/^[A-Z]*$/.test(letra) ? [' ', letra].join('') : letra))
    .join('')
    .toUpperCase();

const isAdministrative = (roles: Role[], roleAuth: String) =>
  roles.find(({ role }) => role === roleAuth);

const isTeacher = (role: String) => role === 'docente' || role === 'jefe';

const parseDate = (date: Date = new Date()) => {
  const formatDate = date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return formatDate;
};

const getColorByRisk = (value: String) => {
  if (value === 'global') return 'gray';
  return value === 'critico'
    ? 'red'
    : value === 'moderado'
    ? 'orange'
    : value === 'leve'
    ? 'yellow'
    : 'green';
};

const dateHourFormat = (date, hour): Date => {
  date = date.split('-').map((i) => parseInt(i));
  hour = hour.split(':').map((i) => parseInt(i));
  return new Date(date[0], date[1] - 1, date[2], hour[0], hour[1]);
};

export {
  normalizeText,
  resetDate,
  getColor,
  capitalizeText,
  normalizeRoles,
  isAdministrative,
  isTeacher,
  parseDate,
  getColorByRisk,
  getDateUTC,
  dateHourFormat,
  convertToRoman,
};
