import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Chip,
  Stack,
  IconButton,
  Typography,
  Alert,
} from '@mui/material';
import { Close, AddPhotoAlternate } from '@mui/icons-material';
import { Project, CreateProjectRequest, UpdateProjectRequest } from '@/types';

interface ProjectFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProjectRequest | UpdateProjectRequest) => Promise<void>;
  project?: Project;
  mode: 'create' | 'edit';
}

const ProjectFormDialog = ({ open, onClose, onSubmit, project, mode }: ProjectFormDialogProps) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    creador: '',
    demo_url: '',
    imagenes: [] as string[],
    stack: [] as string[],
    tags: [] as string[],
  });

  const [stackInput, setStackInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos del proyecto cuando se abre en modo edición
  useEffect(() => {
    if (open && project && mode === 'edit') {
      setFormData({
        titulo: project.titulo || '',
        descripcion: project.descripcion || '',
        creador: project.creador || '',
        demo_url: project.demo_url || '',
        imagenes: project.imagenes || [],
        stack: project.stack || [],
        tags: project.tags || [],
      });
    } else if (open && mode === 'create') {
      // Reset form para crear nuevo
      setFormData({
        titulo: '',
        descripcion: '',
        creador: '',
        demo_url: '',
        imagenes: [],
        stack: [],
        tags: [],
      });
    }
  }, [open, project, mode]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const imagePromises = Array.from(files).map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    try {
      const base64Images = await Promise.all(imagePromises);
      setFormData((prev) => ({
        ...prev,
        imagenes: [...prev.imagenes, ...base64Images],
      }));
    } catch (err) {
      setError('Error al procesar las imágenes');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index),
    }));
  };

  const handleAddStack = () => {
    if (stackInput.trim() && !formData.stack.includes(stackInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        stack: [...prev.stack, stackInput.trim()],
      }));
      setStackInput('');
    }
  };

  const handleRemoveStack = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      stack: prev.stack.filter((t) => t !== tech),
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        titulo: '',
        descripcion: '',
        creador: '',
        demo_url: '',
        imagenes: [],
        stack: [],
        tags: [],
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el proyecto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {mode === 'create' ? 'Crear Nuevo Proyecto' : 'Editar Proyecto'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              required
              fullWidth
              label="Título"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              disabled={loading}
            />

            <TextField
              required
              fullWidth
              multiline
              rows={4}
              label="Descripción"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              disabled={loading}
            />

            <TextField
              required
              fullWidth
              label="Creador"
              value={formData.creador}
              onChange={(e) => setFormData({ ...formData, creador: e.target.value })}
              disabled={loading}
            />

            <TextField
              fullWidth
              label="URL de Demo (opcional)"
              placeholder="https://mi-proyecto.vercel.app"
              value={formData.demo_url}
              onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
              disabled={loading}
            />

            {/* Imágenes */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Imágenes
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<AddPhotoAlternate />}
                disabled={loading}
              >
                Agregar Imágenes
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
                {formData.imagenes.map((img, index) => (
                  <Box key={index} sx={{ position: 'relative' }}>
                    <img
                      src={img}
                      alt={`Preview ${index}`}
                      style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        bgcolor: 'background.paper',
                      }}
                      onClick={() => handleRemoveImage(index)}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* Stack */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Stack Tecnológico
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Ej: React, Node.js, PostgreSQL"
                  value={stackInput}
                  onChange={(e) => setStackInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddStack())}
                  disabled={loading}
                />
                <Button onClick={handleAddStack} disabled={loading}>
                  Agregar
                </Button>
              </Box>
              <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
                {formData.stack.map((tech, index) => (
                  <Chip
                    key={index}
                    label={tech}
                    onDelete={() => handleRemoveStack(tech)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>

            {/* Tags */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Ej: web, fullstack, mobile"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  disabled={loading}
                />
                <Button onClick={handleAddTag} disabled={loading}>
                  Agregar
                </Button>
              </Box>
              <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
                {formData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    color="secondary"
                  />
                ))}
              </Stack>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Guardando...' : mode === 'create' ? 'Crear' : 'Guardar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProjectFormDialog;
