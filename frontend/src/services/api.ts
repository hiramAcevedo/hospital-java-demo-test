import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Servicios de doctores
export const getDoctores = async () => {
  const response = await api.get('/doctores');
  return response.data;
};

export const getDoctorById = async (id: number) => {
  const response = await api.get(`/doctores/${id}`);
  return response.data;
};

export const createDoctor = async (doctor: any) => {
  const response = await api.post('/doctores', doctor);
  return response.data;
};

export const updateDoctor = async (id: number, doctor: any) => {
  const response = await api.put(`/doctores/${id}`, doctor);
  return response.data;
};

export const deleteDoctor = async (id: number) => {
  const response = await api.delete(`/doctores/${id}`);
  return response.data;
};

// Servicios de consultorios
export const getConsultorios = async () => {
  const response = await api.get('/consultorios');
  return response.data;
};

export const getConsultorioById = async (id: number) => {
  const response = await api.get(`/consultorios/${id}`);
  return response.data;
};

// Servicios de pacientes
export const getPacientes = async () => {
  const response = await api.get('/pacientes');
  return response.data;
};

export const getPacienteById = async (id: number) => {
  const response = await api.get(`/pacientes/${id}`);
  return response.data;
};

export const createPaciente = async (paciente: any) => {
  const response = await api.post('/pacientes', paciente);
  return response.data;
};

export const updatePaciente = async (id: number, paciente: any) => {
  const response = await api.put(`/pacientes/${id}`, paciente);
  return response.data;
};

export const deletePaciente = async (id: number) => {
  const response = await api.delete(`/pacientes/${id}`);
  return response.data;
};

// Servicios de citas
export const getCitas = async () => {
  const response = await api.get('/citas');
  return response.data;
};

export const getCitaById = async (id: number) => {
  const response = await api.get(`/citas/${id}`);
  return response.data;
};

export const createCita = async (cita: any) => {
  const response = await api.post('/citas', cita);
  return response.data;
};

export const updateCita = async (id: number, cita: any) => {
  const response = await api.put(`/citas/${id}`, cita);
  return response.data;
};

export const cancelarCita = async (id: number) => {
  const response = await api.patch(`/citas/${id}/cancelar`);
  return response.data;
};

export const getCitasByFecha = async (fecha: string) => {
  const response = await api.get(`/citas/fecha/${fecha}`);
  return response.data;
};

export const getCitasByDoctorAndFecha = async (doctorId: number, fecha: string) => {
  const response = await api.get(`/citas/doctor/${doctorId}/fecha/${fecha}`);
  return response.data;
};

export const getCitasByConsultorioAndFecha = async (consultorioId: number, fecha: string) => {
  const response = await api.get(`/citas/consultorio/${consultorioId}/fecha/${fecha}`);
  return response.data;
}; 