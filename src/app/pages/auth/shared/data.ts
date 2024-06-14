interface DataRole {
  icon: String;
  isActive: boolean;
  text: String;
}

interface Role {
  docente: DataRole;
  estudiante: DataRole;
  vicerrector: DataRole;
  jefe: DataRole;
}

export const dataRoles: Role = {
  docente: {
    icon: 'fa-user-tie',
    isActive: true,
    text: 'Docente',
  },
  estudiante: {
    icon: 'fa-user',
    isActive: false,
    text: 'Estudiante',
  },
  vicerrector: {
    icon: 'fa-user-check',
    isActive: false,
    text: 'Vicerrector',
  },
  jefe: {
    icon: 'fa-user-tie',
    isActive: false,
    text: 'Jefe de plan',
  },
};
