import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Box,
} from '@mui/material';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/api';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

const LoginDialog = ({ open, onClose }: LoginDialogProps) => {
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
      setUsername('');
      setPassword('');
      onClose();
      // Forzar recarga del navbar
      window.location.href = '/admin';
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
      // NO cerrar el diálogo en caso de error
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setUsername('');
      setPassword('');
      setError(null);
      onClose();
    }
  };

  const handleCancel = () => {
    setUsername('');
    setPassword('');
    setError(null);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      disableEscapeKeyDown={loading}
    >
      <form onSubmit={handleSubmit} autoComplete="off">
        <DialogTitle>Iniciar Sesión</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              autoFocus
              required
              fullWidth
              label="Usuario"
              name="username"
              autoComplete="off"
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !username || !password}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Iniciando...' : 'Ingresar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LoginDialog;
