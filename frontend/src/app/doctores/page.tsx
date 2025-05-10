'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Card, 
  CardContent,
  IconButton, 
  Avatar, 
  Chip, 
  CircularProgress,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { toast } from 'react-hot-toast';
import { getDoctores, deleteDoctor } from '@/services/api';
import { Doctor } from '@/types';

export default function ListaDoctores() {
  const router = useRouter();
  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    cargarDoctores();
  }, []);

  const cargarDoctores = async () => {
    try {
      setLoading(true);
      const data = await getDoctores();
      console.log('Doctores cargados:', data);
      setDoctores(data);
    } catch (error) {
      console.error('Error al cargar doctores:', error);
      toast.error('No se pudieron cargar los doctores');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (id: number) => {
    router.push(`/doctores/editar/${id}`);
  };

  const handleDeleteClick = (doctor: Doctor) => {
    setDoctorToDelete(doctor);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!doctorToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteDoctor(doctorToDelete.id);
      toast.success('Doctor eliminado con éxito');
      // Recargar la lista de doctores
      cargarDoctores();
    } catch (error) {
      console.error('Error al eliminar doctor:', error);
      toast.error('Error al eliminar el doctor');
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setDoctorToDelete(null);
    }
  };

  const doctoresFiltrados = doctores.filter(doctor => 
    doctor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.apellidoPaterno.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.especialidad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Doctores
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          href="/doctores/crear"
        >
          Nuevo Doctor
        </Button>
      </Box>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ maxWidth: '600px' }}>
            <TextField
              fullWidth
              placeholder="Buscar por nombre o especialidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              variant="outlined"
              size="small"
            />
          </Box>
        </CardContent>
      </Card>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="tabla de doctores">
            <TableHead>
              <TableRow>
                <TableCell>Doctor</TableCell>
                <TableCell>Especialidad</TableCell>
                <TableCell>Cédula Profesional</TableCell>
                <TableCell>Días Consulta</TableCell>
                <TableCell>Horario</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {doctoresFiltrados.length > 0 ? (
                doctoresFiltrados.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                          {doctor.nombre[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body1">
                            Dr. {doctor.nombre} {doctor.apellidoPaterno}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            ID: {doctor.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={doctor.especialidad} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                    </TableCell>
                    <TableCell>{doctor.cedulaProfesional || '-'}</TableCell>
                    <TableCell>{doctor.diasConsulta || '-'}</TableCell>
                    <TableCell>
                      {doctor.horarioInicio && doctor.horarioFin 
                        ? `${doctor.horarioInicio} - ${doctor.horarioFin}`
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        color="primary" 
                        size="small"
                        onClick={() => handleEditClick(doctor.id)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        size="small"
                        onClick={() => handleDeleteClick(doctor)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No hay doctores que mostrar
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Diálogo de confirmación de eliminación */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Confirmar eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro de que desea eliminar al doctor{' '}
            <strong>Dr. {doctorToDelete?.nombre} {doctorToDelete?.apellidoPaterno}</strong>?
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            disabled={deleteLoading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
          >
            {deleteLoading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 