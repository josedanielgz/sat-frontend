import { getColor, isTeacher } from '../helpers/ui';
import { Reason } from './meet';
import { Risk } from './risk';
import { ItemRisk, MenuOptions } from './ui';

// Item Riesgos
export const itemsaEconomicRisks: ItemRisk = {
  icon: 'fa-hand-holding-usd',
  urlImg: 'economico.svg',
  items: [
    'Estrato',
    'Situación Laboral',
    'Situación Laboral e ingreso de los padres',
    'Dependencia económica',
    'Nivel educativo de los padres',
    'Entorno macroeconómico del país',
  ],
};

export const itemAcademicRisks: ItemRisk = {
  icon: 'fa-address-book',
  urlImg: 'academico.svg',
  items: [
    'Orientación socio-ocupacional',
    'Tipo de Colegio',
    'Rendiminento académico',
    'Calidad del programa',
    'Métodos de estudio y aprendizaje',
    'Pruebas saber',
    'Resultados de examen de ingreso',
    'Cualificación docente',
    'Grado de satisfacción con el programa',
  ],
};

export const itemsaIndividualRisks: ItemRisk = {
  icon: 'fa-male',
  urlImg: 'individual.svg',
  items: [
    'Edad, sexo, estado civil',
    'Posición dentro de los hermanos',
    'Entorno familiar',
    'Calamidad, problemas de salud',
    'Integración social',
    'Incompatibilidad horaria con actividades extra-académicas',
    'Espectativas satisfechas',
    ' Embarazo',
  ],
};

export const itemsaInstitucionalRisks: ItemRisk = {
  icon: 'fa-university',
  urlImg: 'institucional.svg',
  items: [
    'Normalidad acadèmica',
    'Servicios de financiamiento',
    'Recursos universitarios',
    'Orden pùblico',
    'Entorno politico',
    'Nivel de interaciòn entre estudiantes y docentes',
    'Apoyo acadèmico',
    'Apoyo psicològico',
  ],
};

// Rutas

export const menuRoutes: MenuOptions[] = [
  {
    path: '/estudiante/actividades',
    name: 'Ver actividades',
    icon: 'list',
    isAllowed: () => true,
  },
  {
    path: '/estudiante/chat',
    name: 'Ver chat',
    icon: 'list',
    isAllowed: (role: String) => isTeacher(role),
  },
  {
    path: '/estudiante/reunion',
    name: 'Mis reuniones',
    icon: 'calendar-check',
    isAllowed: (role: String) => (role === 'estudiante' ? true : false),
  },
  {
    path: '/estudiante/ver-historial',
    name: 'Ver beneficios',
    icon: 'clock',
    isAllowed: () => true,
  },
  {
    path: '/estudiante',
    name: 'Ver riesgos',
    icon: 'hand-holding-medical',
    isAllowed: () => true,
  },
  {
    path: '/estudiante/perfil-academico',
    name: 'Perfil académico',
    icon: 'book-open',
    isAllowed: () => true,
  },
  {
    path: '/estudiante/bitacora',
    name: 'Bitácora',
    icon: 'file-signature',
    isAllowed: (role: String) =>
      !isTeacher(role) || role === 'estudiante' ? true : false,
  },
];

export const risks: Risk[] = [
  {
    name: 'Académico',
    riskGlobal: 0,
    icon: 'id-badge',
    path: 'academico',
    color: function () {
      return getColor(this.riskGlobal);
    },
  },
  {
    name: 'Económico',
    riskGlobal: 0,
    icon: 'hand-holding-usd',
    path: 'economico',
    color: function () {
      return getColor(this.riskGlobal);
    },
  },
  {
    name: 'Individual',
    riskGlobal: 0,
    icon: 'male',
    path: 'individual',
    color: function () {
      return getColor(this.riskGlobal);
    },
  },
  {
    name: 'Institucional',
    riskGlobal: 0,
    icon: 'university',
    path: 'institucional',
    color: function () {
      return getColor(this.riskGlobal);
    },
  },
];

export const reasonList: Reason[] = [
  {
    name: 'CONSUMO DE SPA',
    isActive: false,
  },
  {
    name: 'EMOCIONAL',
    isActive: false,
  },
  {
    name: 'PROCESO DE DUELO',
    isActive: false,
  },
  {
    name: 'ACADÉMICO',
    isActive: false,
  },
  {
    name: 'O. VOCACIONAL',
    isActive: false,
  },
  {
    name: 'PSICOLOGÍA',
    isActive: true,
  },
  {
    name: 'O. SEXUAL',
    isActive: false,
  },
];

export const cakeNotes = [
  {
    name: '> 4,0',
    value: 0,
  },
  {
    name: '> 3,0',
    value: 0,
  },
  {
    name: '< 3,0',
    value: 0,
  },
  {
    name: '0,0',
    value: 0,
  },
];

export const cakeNotesFinal = [
  {
    name: 'Pasarón',
    value: 0,
  },
  {
    name: 'Perdierón',
    value: 0,
  },
  {
    name: 'Cancelarón',
    value: 0,
  },
];
