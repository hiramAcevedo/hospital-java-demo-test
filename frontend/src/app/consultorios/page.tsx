'use client';

import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, TextField, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Card, CardContent,
  IconButton, Chip, CircularProgress,
  InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import { toast } from 'react-hot-toast';
import { getConsultorios } from '@/services/api';
import { Consultorio } from '@/types';

export default function ListaConsultorios() {
  const [consultorios, setConsultorios] = useState<Consultorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const cargarConsultorios = async () => {
      try {
        setLoading(true);
        const data = await getConsultorios();
        setConsultorios(data);
      } catch (error) {
        console.error('Error al cargar consultorios:', error);
        toast.error('No se pudieron cargar los consultorios');
      } finally {
        setLoading(false);
      }
    };
    
    cargarConsultorios();
  }, []);

  const consultoriosFiltrados = consultorios.filter(consultorio => 
    consultorio.numeroConsultorio.toString().includes(searchTerm) ||
    consultorio.piso.toString().includes(searchTerm)
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Consultorios
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          href="/consultorios/crear"
        >
          Nuevo Consultorio
        </Button>
      </Box>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ maxWidth: '600px' }}>
            <TextField
              fullWidth
              placeholder="Buscar por número o piso..."
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
          <Table sx={{ minWidth: 650 }} aria-label="tabla de consultorios">
            <TableHead>
              <TableRow>
                <TableCell>Número</TableCell>
                <TableCell>Piso</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {consultoriosFiltrados.length > 0 ? (
                consultoriosFiltrados.map((consultorio) => (
                  <TableRow key={consultorio.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ 
                          backgroundColor: 'primary.light',
                          color: 'primary.contrastText',
                          width: 40,
                          height: 40,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '50%',
                          mr: 2
                        }}>
                          <MeetingRoomIcon />
                        </Box>
                        <Typography variant="body1">
                          Consultorio {consultorio.numeroConsultorio}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>Piso {consultorio.piso}</TableCell>
                    <TableCell>
                      {consultorio.tipo || 'General'}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={consultorio.disponible ? "Disponible" : "Ocupado"} 
                        color={consultorio.disponible ? "success" : "error"} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton color="error" size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hay consultorios que mostrar
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
} 