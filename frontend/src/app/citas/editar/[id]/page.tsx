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
  FormHelperText,
  MenuItem,
  Select,
  Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import { 
  getDoctores, 
  getConsultorios, 
  getPacientes, 
  getCitaById, 
  updateCita,
  cancelarCita
} from '@/services/api';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Doctor, Paciente, Consultorio, Cita } from '@/types';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

interface CitaFormData {
  doctorId: string;
  consultorioId: string;
  pacienteId: string;
}

export default function EditarCita() {
  const router = useRouter();
  const params = useParams();
  const citaId = parseInt(params.id as string);
  
  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [consultorios, setConsultorios] = useState<Consultorio[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [fecha, setFecha] = useState<Date | null>(new Date());
  const [hora, setHora] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cita, setCita] = useState<Cita | null>(null);
  
  const { control, handleSubmit, formState: { errors }, reset } = useForm<CitaFormData>();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setInitialLoading(true);
        const [doctoresData, consultoriosData, pacientesData, citaData] = await Promise.all([
          getDoctores(),
          getConsultorios(),
          getPacientes(),
          getCitaById(citaId)
        ]);
        
        setDoctores(doctoresData);
        setConsultorios(consultoriosData);
        setPacientes(pacientesData);
        setCita(citaData);
        
        // Establecer la fecha y hora
        const fechaHora = new Date(citaData.horarioConsulta);
        setFecha(fechaHora);
        setHora(fechaHora);
        
        // Resetear el formulario con los valores de la cita
        reset({
          doctorId: citaData.doctorId.toString(),
          consultorioId: citaData.consultorioId.toString(),
          pacienteId: citaData.pacienteId.toString(),
        });
        
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError('Error al cargar los datos. Por favor, intente nuevamente.');
        toast.error('Error al cargar la información de la cita');
      } finally {
        setInitialLoading(false);
      }
    };
    
    if (citaId) {
      cargarDatos();
    }
  }, [citaId, reset]);

  const onSubmit: SubmitHandler<CitaFormData> = async (data) => {
    try {
      if (!fecha || !hora) {
        toast.error('La fecha y hora son requeridas');
        return;
      }

      setLoading(true);
      
      // Combinar fecha y hora para crear datetime
      const fechaHora = new Date(fecha);
      fechaHora.setHours(hora.getHours(), hora.getMinutes());
      
      const citaData = {
        doctorId: parseInt(data.doctorId),
        consultorioId: parseInt(data.consultorioId),
        pacienteId: parseInt(data.pacienteId),
        horarioConsulta: fechaHora.toISOString()
      };
      
      await updateCita(citaId, citaData);
      toast.success('Cita actualizada exitosamente');
      router.push('/citas');
    } catch (error: any) {
      console.error('Error al actualizar cita:', error);
      if (error.response && error.response.data) {
        setError(typeof error.response.data === 'string' ? error.response.data : 'Error al actualizar la cita');
      } else {
        setError('Error al actualizar la cita. Por favor, intente nuevamente.');
      }
      toast.error('No se pudo actualizar la cita');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelarCita = async () => {
    if (confirm('¿Está seguro de que desea cancelar esta cita? Esta acción no se puede deshacer.')) {
      try {
        setLoading(true);
        await cancelarCita(citaId);
        toast.success('Cita cancelada exitosamente');
        router.push('/citas');
      } catch (error) {
        console.error('Error al cancelar cita:', error);
        toast.error('Error al cancelar la cita');
      } finally {
        setLoading(false);
      }
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
          Editar Cita
        </Typography>
        {cita && !cita.activa && (
          <Chip 
            label="CITA CANCELADA" 
            color="error" 
            variant="outlined" 
            sx={{ fontWeight: 'bold' }}
          />
        )}
      </Box>
      
      <Card>
        <CardContent>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Controller
                    name="doctorId"
                    control={control}
                    rules={{ required: 'El doctor es obligatorio' }}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.doctorId}>
                        <InputLabel id="doctor-select-label">Doctor</InputLabel>
                        <Select
                          labelId="doctor-select-label"
                          label="Doctor"
                          {...field}
                        >
                          {doctores.map((doctor) => (
                            <MenuItem key={doctor.id} value={doctor.id.toString()}>
                              Dr. {doctor.nombre} {doctor.apellidoPaterno} - {doctor.especialidad}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.doctorId && <FormHelperText>{errors.doctorId.message}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <Controller
                    name="consultorioId"
                    control={control}
                    rules={{ required: 'El consultorio es obligatorio' }}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.consultorioId}>
                        <InputLabel id="consultorio-select-label">Consultorio</InputLabel>
                        <Select
                          labelId="consultorio-select-label"
                          label="Consultorio"
                          {...field}
                        >
                          {consultorios.map((consultorio) => (
                            <MenuItem key={consultorio.id} value={consultorio.id.toString()}>
                              Consultorio {consultorio.numeroConsultorio} - Piso {consultorio.piso}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.consultorioId && <FormHelperText>{errors.consultorioId.message}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </Box>
              </Stack>
              
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                    <DatePicker
                      label="Fecha de Cita"
                      value={fecha}
                      onChange={(newValue) => setFecha(newValue)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: 'outlined',
                          error: !fecha,
                          helperText: !fecha ? 'La fecha es obligatoria' : ''
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                    <TimePicker
                      label="Hora de Cita"
                      value={hora}
                      onChange={(newValue) => setHora(newValue)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: 'outlined',
                          error: !hora,
                          helperText: !hora ? 'La hora es obligatoria' : ''
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Box>
              </Stack>
              
              <Box>
                <Controller
                  name="pacienteId"
                  control={control}
                  rules={{ required: 'El paciente es obligatorio' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.pacienteId}>
                      <InputLabel id="paciente-select-label">Paciente</InputLabel>
                      <Select
                        labelId="paciente-select-label"
                        label="Paciente"
                        {...field}
                      >
                        {pacientes.map((paciente) => (
                          <MenuItem key={paciente.id} value={paciente.id.toString()}>
                            {paciente.nombre} {paciente.apellidos || `${paciente.apellidoPaterno} ${paciente.apellidoMaterno || ''}`}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.pacienteId && <FormHelperText>{errors.pacienteId.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Box>
            </Stack>
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                variant="outlined" 
                color="error"
                startIcon={<CancelIcon />}
                onClick={handleCancelarCita}
                disabled={loading || (cita && !cita.activa)}
              >
                {cita && !cita.activa ? 'Cita ya cancelada' : 'Cancelar Cita'}
              </Button>
              
              <Box>
                <Button 
                  variant="outlined" 
                  sx={{ mr: 2 }}
                  onClick={() => router.push('/citas')}
                >
                  Volver
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  startIcon={<SaveIcon />}
                  disabled={loading || (cita && !cita.activa)}
                >
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
} 