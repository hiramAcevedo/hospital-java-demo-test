'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  Stack,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  MenuItem,
  Select
} from '@mui/material';
import { toast } from 'react-hot-toast';
import { getDoctorById, updateDoctor } from '@/services/api';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

// Especialidades médicas comunes en español
const especialidades = [
  'Alergología',
  'Anestesiología',
  'Cardiología',
  'Cirugía General',
  'Dermatología',
  'Endocrinología',
  'Gastroenterología',
  'Ginecología y Obstetricia',
  'Hematología',
  'Infectología',
  'Medicina Familiar',
  'Medicina Interna',
  'Nefrología',
  'Neurología',
  'Oftalmología',
  'Oncología',
  'Ortopedia',
  'Otorrinolaringología',
  'Pediatría',
  'Psiquiatría',
  'Radiología',
  'Reumatología',
  'Urología'
];

// Opciones de días de consulta
const diasConsultaOpciones = [
  'Lunes a Viernes',
  'Lunes, Miércoles y Viernes',
  'Martes y Jueves',
  'Lunes a Sábado',
  'Solo fines de semana',
];

interface FormData {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  especialidad: string;
  cedulaProfesional: string;
  diasConsulta: string;
  horarioInicio: string;
  horarioFin: string;
}

export default function EditarDoctor() {
  const router = useRouter();
  const params = useParams();
  const doctorId = parseInt(params.id as string);
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    defaultValues: {
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      especialidad: '',
      cedulaProfesional: '',
      diasConsulta: '',
      horarioInicio: '',
      horarioFin: ''
    }
  });

  useEffect(() => {
    const cargarDoctor = async () => {
      try {
        setInitialLoading(true);
        const doctor = await getDoctorById(doctorId);
        console.log('Doctor cargado:', doctor);
        
        reset({
          nombre: doctor.nombre,
          apellidoPaterno: doctor.apellidoPaterno,
          apellidoMaterno: doctor.apellidoMaterno || '',
          especialidad: doctor.especialidad,
          cedulaProfesional: doctor.cedulaProfesional || '',
          diasConsulta: doctor.diasConsulta || '',
          horarioInicio: doctor.horarioInicio || '08:00',
          horarioFin: doctor.horarioFin || '16:00'
        });
      } catch (error) {
        console.error('Error al cargar doctor:', error);
        setError('No se pudo cargar la información del doctor');
        toast.error('Error al cargar el doctor');
      } finally {
        setInitialLoading(false);
      }
    };
    
    if (doctorId) {
      cargarDoctor();
    }
  }, [doctorId, reset]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Enviando datos actualizados:', data);
      await updateDoctor(doctorId, data);
      toast.success('Doctor actualizado exitosamente');
      router.push('/doctores');
    } catch (error) {
      console.error('Error al actualizar doctor:', error);
      setError('Error al actualizar el doctor. Por favor, intente nuevamente.');
      toast.error('No se pudo actualizar el doctor');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Editar Doctor
        </Typography>
      </Box>
      
      <Card>
        <CardContent>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Controller
                  name="nombre"
                  control={control}
                  rules={{ required: 'El nombre es obligatorio' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.nombre}>
                      <InputLabel htmlFor="nombre">Nombre</InputLabel>
                      <OutlinedInput
                        id="nombre"
                        label="Nombre"
                        {...field}
                      />
                      {errors.nombre && <FormHelperText>{errors.nombre.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
                
                <Controller
                  name="apellidoPaterno"
                  control={control}
                  rules={{ required: 'El apellido paterno es obligatorio' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.apellidoPaterno}>
                      <InputLabel htmlFor="apellidoPaterno">Apellido Paterno</InputLabel>
                      <OutlinedInput
                        id="apellidoPaterno"
                        label="Apellido Paterno"
                        {...field}
                      />
                      {errors.apellidoPaterno && <FormHelperText>{errors.apellidoPaterno.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
                
                <Controller
                  name="apellidoMaterno"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel htmlFor="apellidoMaterno">Apellido Materno</InputLabel>
                      <OutlinedInput
                        id="apellidoMaterno"
                        label="Apellido Materno"
                        {...field}
                      />
                    </FormControl>
                  )}
                />
              </Stack>
              
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Controller
                  name="especialidad"
                  control={control}
                  rules={{ required: 'La especialidad es obligatoria' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.especialidad}>
                      <InputLabel id="especialidad-label">Especialidad</InputLabel>
                      <Select
                        labelId="especialidad-label"
                        label="Especialidad"
                        {...field}
                      >
                        {especialidades.map((esp) => (
                          <MenuItem key={esp} value={esp}>{esp}</MenuItem>
                        ))}
                      </Select>
                      {errors.especialidad && <FormHelperText>{errors.especialidad.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
                
                <Controller
                  name="cedulaProfesional"
                  control={control}
                  rules={{ required: 'La cédula profesional es obligatoria' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.cedulaProfesional}>
                      <InputLabel htmlFor="cedulaProfesional">Cédula Profesional</InputLabel>
                      <OutlinedInput
                        id="cedulaProfesional"
                        label="Cédula Profesional"
                        {...field}
                      />
                      {errors.cedulaProfesional && <FormHelperText>{errors.cedulaProfesional.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Stack>
              
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Controller
                  name="diasConsulta"
                  control={control}
                  rules={{ required: 'Los días de consulta son obligatorios' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.diasConsulta}>
                      <InputLabel id="dias-consulta-label">Días de Consulta</InputLabel>
                      <Select
                        labelId="dias-consulta-label"
                        label="Días de Consulta"
                        {...field}
                      >
                        {diasConsultaOpciones.map((dias) => (
                          <MenuItem key={dias} value={dias}>{dias}</MenuItem>
                        ))}
                      </Select>
                      {errors.diasConsulta && <FormHelperText>{errors.diasConsulta.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Stack>
              
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Horario de Inicio
                  </Typography>
                  <Controller
                    name="horarioInicio"
                    control={control}
                    render={({ field }) => (
                      <OutlinedInput
                        type="time"
                        fullWidth
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Horario de Fin
                  </Typography>
                  <Controller
                    name="horarioFin"
                    control={control}
                    render={({ field }) => (
                      <OutlinedInput
                        type="time"
                        fullWidth
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </Box>
              </Stack>
            </Stack>
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                sx={{ mr: 2 }}
                onClick={() => router.push('/doctores')}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Guardando...' : 'Actualizar Doctor'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
} 