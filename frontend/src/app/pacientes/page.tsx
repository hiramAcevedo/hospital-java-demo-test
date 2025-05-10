'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, Typography, Button, TextField, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Card, CardContent,
  IconButton, Avatar, Chip, CircularProgress,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { toast } from 'react-hot-toast';
import { getPacientes, deletePaciente } from '@/services/api';
import { Paciente } from '@/types';

export default function ListaPacientes() {
  const router = useRouter();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pacienteToDelete, setPacienteToDelete] = useState<Paciente | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    cargarPacientes();
  }, []);

  const cargarPacientes = async () => {
    try {
      setLoading(true);
      const data = await getPacientes();
      console.log('Datos recibidos de pacientes:', data);
      setPacientes(data);
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
      toast.error('No se pudieron cargar los pacientes');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (id: number) => {
    router.push(`/pacientes/editar/${id}`);
  };

  const handleDeleteClick = (paciente: Paciente) => {
    setPacienteToDelete(paciente);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!pacienteToDelete) return;

    try {
      setDeleteLoading(true);
      await deletePaciente(pacienteToDelete.id);
      toast.success('Paciente eliminado con éxito');
      // Recargar la lista de pacientes
      cargarPacientes();
    } catch (error) {
      console.error('Error al eliminar paciente:', error);
      toast.error('Error al eliminar el paciente');
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setPacienteToDelete(null);
    }
  };

  const pacientesFiltrados = pacientes.filter(paciente => 
    paciente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (paciente.apellidos?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (paciente.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Pacientes
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          href="/pacientes/crear"
        >
          Nuevo Paciente
        </Button>
      </Box>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ maxWidth: '600px' }}>
            <TextField
              fullWidth
              placeholder="Buscar pacientes..."
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
          <Table sx={{ minWidth: 650 }} aria-label="tabla de pacientes">
            <TableHead>
              <TableRow>
                <TableCell>Paciente</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Nacimiento</TableCell>
                <TableCell>NSS</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pacientesFiltrados.length > 0 ? (
                pacientesFiltrados.map((paciente) => (
                  <TableRow key={paciente.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                          {paciente.nombre[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body1">
                            {paciente.nombre} {paciente.apellidos}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            ID: {paciente.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{paciente.email || '-'}</TableCell>
                    <TableCell>{paciente.telefono || '-'}</TableCell>
                    <TableCell>
                      {paciente.fechaNacimiento 
                        ? new Date(paciente.fechaNacimiento).toLocaleDateString('es-ES')
                        : '-'
                      }
                    </TableCell>
                    <TableCell>{paciente.nss || '-'}</TableCell>
                    <TableCell>
                      <IconButton 
                        color="primary" 
                        size="small"
                        onClick={() => handleEditClick(paciente.id)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        size="small"
                        onClick={() => handleDeleteClick(paciente)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No hay pacientes que mostrar
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
            ¿Está seguro de que desea eliminar al paciente{' '}
            <strong>{pacienteToDelete?.nombre} {pacienteToDelete?.apellidos}</strong>?
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