import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log('Intentando login con:', { username });
      const response = await authService.login({ username, password });
      console.log('Login exitoso:', response);
      setAuth(response.user, response.token);
      navigate('/admin');
    } catch (err: any) {
      console.error('Error en login:', err);
      // Mostrar mensaje específico según el error
      if (err.response?.status === 401) {
        setError('Usuario o contraseña incorrectos');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message === 'Network Error') {
        setError('Error de conexión. Verifica que el servidor esté corriendo.');
      } else {
        setError('Error al iniciar sesión. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          Atrás
        </Button>

        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Iniciar Sesión
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
              Accede al panel de administración
            </Typography>

            <form onSubmit={handleSubmit} autoComplete="off" noValidate>
              {/* Campos ocultos para confundir el autocomplete del navegador */}
              <input type="text" style={{ display: 'none' }} />
              <input type="password" style={{ display: 'none' }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {error && (
                  <Alert severity="error" onClose={() => setError(null)}>
                    {error}
                  </Alert>
                )}

                <TextField
                  autoFocus
                  required
                  fullWidth
                  label="Usuario"
                  name="username"
                  id="username-field"
                  autoComplete="off"
                  inputProps={{ 
                    autoComplete: 'off',
                    form: {
                      autoComplete: 'off',
                    },
                  }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />

                <TextField
                  required
                  fullWidth
                  type="password"
                  label="Contraseña"
                  name="password"
                  id="password-field"
                  autoComplete="new-password"
                  inputProps={{ 
                    autoComplete: 'new-password',
                  }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSubmit(e as any);
                    }
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading || !username || !password}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'Iniciando sesión...' : 'Ingresar'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default LoginPage;
