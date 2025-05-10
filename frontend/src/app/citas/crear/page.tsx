'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Select,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
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
  createCita, 
  createPaciente 
} from '@/services/api';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Doctor, Paciente, Consultorio } from '@/types';
import AddIcon from '@mui/icons-material/Add';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

interface CitaFormData {
  doctorId: string;
  consultorioId: string;
  pacienteId: string;
}

interface PacienteFormData {
  nombre: string;
  apellidos: string;
  email?: string;
  telefono?: string;
}

export default function CrearCita() {
  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [consultorios, setConsultorios] = useState<Consultorio[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [fecha, setFecha] = useState<Date | null>(new Date());
  const [hora, setHora] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [dialogoPaciente, setDialogoPaciente] = useState<boolean>(false);
  const [loadingPaciente, setLoadingPaciente] = useState<boolean>(false);
  
  const { control: controlCita, handleSubmit: handleSubmitCita, formState: { errors: errorsCita } } = useForm<CitaFormData>();
  const { control: controlPaciente, handleSubmit: handleSubmitPaciente, formState: { errors: errorsPaciente }, reset: resetPaciente } = useForm<PacienteFormData>();
  
  const router = useRouter();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [doctoresData, consultoriosData, pacientesData] = await Promise.all([
          getDoctores(),
          getConsultorios(),
          getPacientes()
        ]);
        setDoctores(doctoresData);
        setConsultorios(consultoriosData);
        setPacientes(pacientesData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError('Error al cargar los datos. Por favor, intente nuevamente.');
      }
    };
    
    cargarDatos();
  }, []);

  const onSubmitPaciente: SubmitHandler<PacienteFormData> = async (data) => {
    try {
      setLoadingPaciente(true);
      const nuevoPaciente = await createPaciente(data);
      setPacientes([...pacientes, nuevoPaciente]);
      toast.success('Paciente creado exitosamente');
      setDialogoPaciente(false);
      resetPaciente();
    } catch (error) {
      console.error('Error al crear paciente:', error);
      toast.error('Error al crear el paciente');
    } finally {
      setLoadingPaciente(false);
    }
  };

  const onSubmitCita: SubmitHandler<CitaFormData> = async (data) => {
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
      
      await createCita(citaData);
      toast.success('Cita creada exitosamente');
      router.push('/citas');
    } catch (error: any) {
      console.error('Error al crear cita:', error);
      if (error.response && error.response.data) {
        setError(typeof error.response.data === 'string' ? error.response.data : 'Error al crear la cita');
      } else {
        setError('Error al crear la cita. Por favor, intente nuevamente.');
      }
      toast.error('No se pudo crear la cita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Nueva Cita
        </Typography>
      </Box>
      
      <Card>
        <CardContent>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          
          <Box component="form" onSubmit={handleSubmitCita(onSubmitCita)}>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Controller
                    name="doctorId"
                    control={controlCita}
                    rules={{ required: 'El doctor es obligatorio' }}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errorsCita.doctorId}>
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
                        {errorsCita.doctorId && <FormHelperText>{errorsCita.doctorId.message}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <Controller
                    name="consultorioId"
                    control={controlCita}
                    rules={{ required: 'El consultorio es obligatorio' }}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errorsCita.consultorioId}>
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
                        {errorsCita.consultorioId && <FormHelperText>{errorsCita.consultorioId.message}</FormHelperText>}
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
                      disablePast
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
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Controller
                  name="pacienteId"
                  control={controlCita}
                  rules={{ required: 'El paciente es obligatorio' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errorsCita.pacienteId} sx={{ flex: 1, mr: 2 }}>
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
                      {errorsCita.pacienteId && <FormHelperText>{errorsCita.pacienteId.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
                
                <Button 
                  variant="outlined"
                  startIcon={<PersonAddIcon />}
                  onClick={() => setDialogoPaciente(true)}
                  sx={{ height: 'fit-content', mt: 1 }}
                >
                  Nuevo Paciente
                </Button>
              </Box>
            </Stack>
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                sx={{ mr: 2 }}
                onClick={() => router.push('/citas')}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
              >
                {loading ? 'Creando cita...' : 'Crear Cita'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Diálogo para crear nuevo paciente */}
      <Dialog 
        open={dialogoPaciente} 
        onClose={() => setDialogoPaciente(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Registrar Nuevo Paciente</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmitPaciente(onSubmitPaciente)} sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <Controller
                name="nombre"
                control={controlPaciente}
                rules={{ required: 'El nombre es obligatorio' }}
                render={({ field }) => (
                  <TextField
                    label="Nombre"
                    fullWidth
                    error={!!errorsPaciente.nombre}
                    helperText={errorsPaciente.nombre?.message}
                    {...field}
                  />
                )}
              />
              
              <Controller
                name="apellidos"
                control={controlPaciente}
                rules={{ required: 'Los apellidos son obligatorios' }}
                render={({ field }) => (
                  <TextField
                    label="Apellidos"
                    fullWidth
                    error={!!errorsPaciente.apellidos}
                    helperText={errorsPaciente.apellidos?.message}
                    {...field}
                  />
                )}
              />
              
              <Controller
                name="email"
                control={controlPaciente}
                render={({ field }) => (
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    {...field}
                  />
                )}
              />
              
              <Controller
                name="telefono"
                control={controlPaciente}
                render={({ field }) => (
                  <TextField
                    label="Teléfono"
                    fullWidth
                    {...field}
                  />
                )}
              />
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogoPaciente(false)}>Cancelar</Button>
          <Button 
            onClick={handleSubmitPaciente(onSubmitPaciente)}
            variant="contained" 
            disabled={loadingPaciente}
            startIcon={loadingPaciente ? <CircularProgress size={20} /> : null}
          >
            {loadingPaciente ? 'Guardando...' : 'Guardar Paciente'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 