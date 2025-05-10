'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Paper, 
  Card, 
  CardContent,
  Stack,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText
} from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-hot-toast';
import { createPaciente } from '@/services/api';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

interface FormData {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  fechaNacimiento: Date | null;
  nss: string;
}

export default function CrearPaciente() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      nombre: '',
      apellidos: '',
      email: '',
      telefono: '',
      fechaNacimiento: null,
      nss: ''
    }
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      // Formatear la fecha de nacimiento a ISO string si existe
      const pacienteData = {
        ...data,
        fechaNacimiento: data.fechaNacimiento ? data.fechaNacimiento.toISOString().split('T')[0] : null,
      };

      console.log('Enviando datos:', pacienteData);
      await createPaciente(pacienteData);
      toast.success('Paciente registrado exitosamente');
      router.push('/pacientes');
    } catch (error) {
      console.error('Error al registrar paciente:', error);
      setError('Error al registrar el paciente. Por favor, intente nuevamente.');
      toast.error('No se pudo registrar el paciente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Registrar Nuevo Paciente
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
                  name="apellidos"
                  control={control}
                  rules={{ required: 'Los apellidos son obligatorios' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.apellidos}>
                      <InputLabel htmlFor="apellidos">Apellidos</InputLabel>
                      <OutlinedInput
                        id="apellidos"
                        label="Apellidos"
                        {...field}
                      />
                      {errors.apellidos && <FormHelperText>{errors.apellidos.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Stack>
              
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Controller
                  name="email"
                  control={control}
                  rules={{ 
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Introduce un email válido'
                    }
                  }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.email}>
                      <InputLabel htmlFor="email">Email</InputLabel>
                      <OutlinedInput
                        id="email"
                        label="Email"
                        type="email"
                        {...field}
                      />
                      {errors.email && <FormHelperText>{errors.email.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
                
                <Controller
                  name="telefono"
                  control={control}
                  rules={{ 
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'El teléfono debe tener 10 dígitos'
                    }
                  }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.telefono}>
                      <InputLabel htmlFor="telefono">Teléfono</InputLabel>
                      <OutlinedInput
                        id="telefono"
                        label="Teléfono"
                        {...field}
                      />
                      {errors.telefono && <FormHelperText>{errors.telefono.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Stack>
              
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Controller
                  name="fechaNacimiento"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <Typography variant="subtitle2" gutterBottom>
                        Fecha de Nacimiento
                      </Typography>
                      <Box sx={{ 
                        '.react-datepicker-wrapper': { 
                          width: '100%' 
                        }, 
                        '.react-datepicker__input-container > input': {
                          width: '100%',
                          padding: '16.5px 14px',
                          border: '1px solid rgba(0, 0, 0, 0.23)',
                          borderRadius: '4px',
                          fontSize: '1rem'
                        }
                      }}>
                        <DatePicker
                          selected={field.value}
                          onChange={(date) => field.onChange(date)}
                          dateFormat="dd/MM/yyyy"
                          showYearDropdown
                          scrollableYearDropdown
                          yearDropdownItemNumber={100}
                        />
                      </Box>
                    </FormControl>
                  )}
                />
                
                <Controller
                  name="nss"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel htmlFor="nss">NSS (Número de Seguro Social)</InputLabel>
                      <OutlinedInput
                        id="nss"
                        label="NSS (Número de Seguro Social)"
                        {...field}
                      />
                    </FormControl>
                  )}
                />
              </Stack>
            </Stack>
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                sx={{ mr: 2 }}
                onClick={() => router.push('/pacientes')}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Guardando...' : 'Guardar Paciente'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
} 