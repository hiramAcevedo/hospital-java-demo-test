// Tipos para Doctor
export interface Doctor {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  especialidad: string;
  cedulaProfesional?: string;
  diasConsulta?: string;
  horarioInicio?: string;
  horarioFin?: string;
}

// Tipos para Paciente
export interface Paciente {
  id: number;
  nombre: string;
  apellidos: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  email?: string;
  telefono?: string;
  fechaNacimiento?: string;
  nss?: string;
}

// Tipos para Consultorio
export interface Consultorio {
  id: number;
  numeroConsultorio: number;
  piso: number;
  tipo?: string;
  disponible?: boolean;
}

// Tipos para Cita
export interface Cita {
  id: number;
  consultorioId: number;
  doctorId: number;
  pacienteId: number;
  horarioConsulta: string;
  activa: boolean;
  nombrePaciente?: string;
  apellidosPaciente?: string;
  nombreDoctor?: string;
  apellidoPaternoDoctor?: string;
  apellidoMaternoDoctor?: string;
  especialidadDoctor?: string;
  numeroConsultorio?: number;
  pisoConsultorio?: number;
} 