'use client';

import Link from 'next/link';
import { Card, CardContent, Typography, Button, Box, Container, Stack } from '@mui/material';

export default function Home() {
  return (
    <Container>
      <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ my: 4 }}>
        Sistema de Citas Hospitalarias
      </Typography>
      
      <Box mb={4}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Bienvenido al Sistema de Gestión de Citas
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Este sistema permite administrar las citas médicas del departamento de Medicina Interna,
              ayudando a los médicos a saber cuántas y a qué hora tienen citas durante el día.
            </Typography>
          </CardContent>
        </Card>
      </Box>
      
      <Stack 
        direction={{ xs: 'column', md: 'row' }}
        spacing={3}
      >
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" component="h2" gutterBottom>
              Gestión de Citas
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Administra las citas médicas, programa nuevas consultas y gestiona el calendario de los doctores.
            </Typography>
            <Button variant="contained" color="primary" component={Link} href="/citas">
              Ver Citas
            </Button>
          </CardContent>
        </Card>
        
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" component="h2" gutterBottom>
              Nueva Cita
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Programa una nueva cita médica seleccionando doctor, consultorio, paciente y horario.
            </Typography>
            <Button variant="contained" color="success" component={Link} href="/citas/crear">
              Crear Cita
            </Button>
          </CardContent>
        </Card>
        
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" component="h2" gutterBottom>
              Directorio Médico
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Consulta la información de los doctores del departamento de Medicina Interna.
            </Typography>
            <Button variant="contained" color="info" component={Link} href="/doctores">
              Ver Doctores
            </Button>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
} 