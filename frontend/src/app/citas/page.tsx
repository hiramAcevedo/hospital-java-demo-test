'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Card, CardContent, Typography, Button, Box, 
  FormControl, InputLabel, MenuItem, Select, Chip,
  TextField, Alert, CircularProgress, Stack, ButtonGroup, Avatar
} from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-hot-toast';
import { 
  getCitas, 
  getDoctores, 
  getConsultorios, 
  getCitasByFecha, 
  getCitasByDoctorAndFecha, 
  getCitasByConsultorioAndFecha, 
  cancelarCita 
} from '@/services/api';
import { Doctor, Paciente, Consultorio, Cita } from '@/types';
import TodayIcon from '@mui/icons-material/Today';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RoomIcon from '@mui/icons-material/Room';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';

export default function ListaCitas() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [consultorios, setConsultorios] = useState<Consultorio[]>([]);
  const [filtroFecha, setFiltroFecha] = useState<Date>(new Date());
  const [filtroDoctor, setFiltroDoctor] = useState<string>('');
  const [filtroConsultorio, setFiltroConsultorio] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [doctoresData, consultoriosData] = await Promise.all([
          getDoctores(),
          getConsultorios()
        ]);
        setDoctores(doctoresData);
        setConsultorios(consultoriosData);
        
        // Cargar citas iniciales por fecha actual
        await filtrarCitas();
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError('Error al cargar los datos. Por favor, intente nuevamente.');
      }
    };
    
    cargarDatos();
  }, []);

  const filtrarCitas = async () => {
    try {
      setLoading(true);
      let resultado;
      
      const fechaFormateada = filtroFecha.toISOString().split('T')[0];
      
      if (filtroDoctor && filtroDoctor !== '') {
        resultado = await getCitasByDoctorAndFecha(parseInt(filtroDoctor), fechaFormateada);
      } else if (filtroConsultorio && filtroConsultorio !== '') {
        resultado = await getCitasByConsultorioAndFecha(parseInt(filtroConsultorio), fechaFormateada);
      } else {
        resultado = await getCitasByFecha(fechaFormateada);
      }
      
      setCitas(resultado || []);
      if (resultado && resultado.length === 0) {
        toast.success('No se encontraron citas con los filtros seleccionados');
      }
    } catch (error) {
      console.error('Error al filtrar citas:', error);
      setError('Error al filtrar las citas. Por favor, intente nuevamente.');
      setCitas([]);
      toast.error('Error al cargar las citas');
    } finally {
      setLoading(false);
    }
  };

  const cargarTodasCitas = async () => {
    try {
      setLoading(true);
      setFiltroDoctor('');
      setFiltroConsultorio('');
      const resultado = await getCitas();
      setCitas(resultado || []);
      if (resultado && resultado.length === 0) {
        toast.success('No hay citas registradas en el sistema');
      }
    } catch (error) {
      console.error('Error al cargar todas las citas:', error);
      setError('Error al cargar todas las citas. Por favor, intente nuevamente.');
      setCitas([]);
      toast.error('Error al cargar todas las citas');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelarCita = async (id: number) => {
    try {
      await cancelarCita(id);
      toast.success('Cita cancelada exitosamente');
      // Actualizar la lista de citas
      filtrarCitas();
    } catch (error) {
      console.error('Error al cancelar cita:', error);
      toast.error('Error al cancelar la cita');
    }
  };

  const formatoFechaHora = (fechaHora: string) => {
    const fecha = new Date(fechaHora);
    return fecha.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Listado de Citas
        </Typography>
        <Button 
          variant="contained" 
          color="success" 
          component={Link} 
          href="/citas/crear"
        >
          Nueva Cita
        </Button>
      </Box>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filtros de Búsqueda
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <ButtonGroup variant="outlined">
              <Button 
                startIcon={<TodayIcon />}
                onClick={filtrarCitas}
                variant={filtroDoctor === '' && filtroConsultorio === '' ? "contained" : "outlined"}
              >
                Filtrar por Fecha
              </Button>
              <Button 
                startIcon={<CalendarMonthIcon />}
                onClick={cargarTodasCitas}
                variant={citas.length > 0 && filtroDoctor === '' && filtroConsultorio === '' ? "contained" : "outlined"}
              >
                Ver Todas las Citas
              </Button>
            </ButtonGroup>
          </Box>
          
          <Stack 
            direction={{ xs: 'column', md: 'row' }}
            spacing={3} 
            sx={{ mb: 2 }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Fecha
              </Typography>
              <Box sx={{ 
                '.react-datepicker-wrapper': { 
                  width: '100%' 
                }, 
                '.react-datepicker__input-container > input': {
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }
              }}>
                <DatePicker
                  selected={filtroFecha}
                  onChange={(date: Date) => setFiltroFecha(date)}
                  dateFormat="dd/MM/yyyy"
                />
              </Box>
            </Box>
            
            <FormControl sx={{ flex: 1 }}>
              <InputLabel id="doctor-select-label">Doctor</InputLabel>
              <Select
                labelId="doctor-select-label"
                value={filtroDoctor}
                label="Doctor"
                onChange={(e) => setFiltroDoctor(e.target.value)}
              >
                <MenuItem value="">Todos los doctores</MenuItem>
                {doctores.map((doctor) => (
                  <MenuItem key={doctor.id} value={doctor.id}>
                    Dr. {doctor.nombre} {doctor.apellidoPaterno}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl sx={{ flex: 1 }}>
              <InputLabel id="consultorio-select-label">Consultorio</InputLabel>
              <Select
                labelId="consultorio-select-label"
                value={filtroConsultorio}
                label="Consultorio"
                onChange={(e) => setFiltroConsultorio(e.target.value)}
              >
                <MenuItem value="">Todos los consultorios</MenuItem>
                {consultorios.map((consultorio) => (
                  <MenuItem key={consultorio.id} value={consultorio.id}>
                    Consultorio {consultorio.numeroConsultorio}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Box sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              onClick={filtrarCitas} 
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Cargando...' : 'Buscar'}
            </Button>
          </Box>
        </CardContent>
      </Card>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="tabla de citas">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Consultorio</TableCell>
              <TableCell>Paciente</TableCell>
              <TableCell>Fecha y Hora</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={40} />
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    Cargando citas...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : citas.length > 0 ? (
              citas.map((cita) => (
                <TableRow key={cita.id}>
                  <TableCell>{cita.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        {cita.nombreDoctor ? cita.nombreDoctor[0] : "D"}
                      </Avatar>
                      <Box>
                        <Typography variant="body1">
                          Dr. {cita.nombreDoctor} {cita.apellidoPaternoDoctor}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {cita.especialidadDoctor}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={`Consultorio ${cita.numeroConsultorio}`} 
                      variant="outlined" 
                      size="small"
                      icon={<RoomIcon fontSize="small" />} 
                    />
                    <Typography variant="caption" display="block" color="textSecondary">
                      Piso {cita.pisoConsultorio}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {cita.nombrePaciente} {cita.apellidosPaciente}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {formatoFechaHora(cita.horarioConsulta)}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={cita.activa ? "ACTIVA" : "CANCELADA"} 
                      color={cita.activa ? "success" : "error"}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      component={Link}
                      href={`/citas/editar/${cita.id}`}
                      size="small"
                      variant="outlined"
                      color="primary"
                      startIcon={<EditIcon />}
                      sx={{ mr: 1 }}
                    >
                      Editar
                    </Button>
                    {cita.activa && (
                      <Button 
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => handleCancelarCita(cita.id)}
                      >
                        Cancelar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="textSecondary">
                    No hay citas para mostrar
                  </Typography>
                  <Button 
                    variant="text" 
                    color="primary"
                    onClick={cargarTodasCitas}
                    sx={{ mt: 1 }}
                  >
                    Ver todas las citas
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
} 