import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  ImageList,
  ImageListItem,
  Dialog,
  IconButton,
} from '@mui/material';
import { ArrowBack, Close, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useProjectsStore } from '@/store/projectsStore';
import { projectsService } from '@/services/api';

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentProject, setCurrentProject } = useProjectsStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      loadProject(parseInt(id));
    }
  }, [id]);

  const loadProject = async (projectId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await projectsService.getProjectById(projectId);
      setCurrentProject(response.proyecto);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar el proyecto');
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setCarouselOpen(true);
  };

  const handleNextImage = () => {
    if (currentProject) {
      setCurrentImageIndex((prev) => 
        prev === currentProject.imagenes.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (currentProject) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? currentProject.imagenes.length - 1 : prev - 1
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') handleNextImage();
    if (e.key === 'ArrowLeft') handlePrevImage();
    if (e.key === 'Escape') setCarouselOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/')}>
          Volver a la lista
        </Button>
      </Container>
    );
  }

  if (!currentProject) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">Proyecto no encontrado</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Volver a la lista
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/')} sx={{ mb: 3 }}>
        Volver a la lista
      </Button>

      <Card>
        <CardContent>
          <Typography variant="h3" component="h1" gutterBottom>
            {currentProject.titulo}
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap' }}>
            <Typography variant="subtitle1" color="text.secondary">
              Creado por: <strong>{currentProject.creador}</strong>
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {new Date(currentProject.created_at).toLocaleDateString()}
            </Typography>
            {currentProject.demo_url && (
              <Button
                variant="outlined"
                size="small"
                href={currentProject.demo_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver Demo
              </Button>
            )}
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Imágenes */}
          {currentProject.imagenes && currentProject.imagenes.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Galería
              </Typography>
              <ImageList
                sx={{ width: '100%', maxHeight: 500 }}
                cols={currentProject.imagenes.length === 1 ? 1 : 3}
                rowHeight={250}
              >
                {currentProject.imagenes.map((imagen, index) => (
                  <ImageListItem 
                    key={index}
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        zIndex: 1,
                      }
                    }}
                    onClick={() => handleImageClick(index)}
                  >
                    <img
                      src={imagen}
                      alt={`${currentProject.titulo} - ${index + 1}`}
                      loading="lazy"
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Descripción */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Descripción
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {currentProject.descripcion}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Stack */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Stack Tecnológico
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {currentProject.stack.map((tech, index) => (
                <Chip key={index} label={tech} color="primary" variant="outlined" />
              ))}
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Tags */}
          <Box>
            <Typography variant="h5" gutterBottom>
              Tags
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {currentProject.tags.map((tag, index) => (
                <Chip key={index} label={tag} color="secondary" />
              ))}
            </Stack>
          </Box>

          {/* Metadata */}
          <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Creado: {new Date(currentProject.created_at).toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Actualizado: {new Date(currentProject.updated_at).toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Carrusel de imágenes */}
      <Dialog
        open={carouselOpen}
        onClose={() => setCarouselOpen(false)}
        maxWidth="lg"
        fullWidth
        onKeyDown={handleKeyDown}
        PaperProps={{
          sx: {
            bgcolor: 'transparent',
            boxShadow: 'none',
            maxWidth: '90vw',
            maxHeight: '90vh',
          }
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '90vh',
          }}
        >
          {/* Botón cerrar */}
          <IconButton
            onClick={() => setCarouselOpen(false)}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)',
              },
              zIndex: 2,
            }}
          >
            <Close />
          </IconButton>

          {/* Botón anterior */}
          {currentProject && currentProject.imagenes.length > 1 && (
            <IconButton
              onClick={handlePrevImage}
              sx={{
                position: 'absolute',
                left: 16,
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.7)',
                },
                zIndex: 2,
              }}
            >
              <ChevronLeft fontSize="large" />
            </IconButton>
          )}

          {/* Imagen */}
          {currentProject && currentProject.imagenes[currentImageIndex] && (
            <Box
              component="img"
              src={currentProject.imagenes[currentImageIndex]}
              alt={`${currentProject.titulo} - ${currentImageIndex + 1}`}
              sx={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
          )}

          {/* Botón siguiente */}
          {currentProject && currentProject.imagenes.length > 1 && (
            <IconButton
              onClick={handleNextImage}
              sx={{
                position: 'absolute',
                right: 16,
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.7)',
                },
                zIndex: 2,
              }}
            >
              <ChevronRight fontSize="large" />
            </IconButton>
          )}

          {/* Indicador de posición */}
          {currentProject && currentProject.imagenes.length > 1 && (
            <Typography
              variant="body2"
              sx={{
                position: 'absolute',
                bottom: 16,
                bgcolor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                px: 2,
                py: 1,
                borderRadius: 1,
              }}
            >
              {currentImageIndex + 1} / {currentProject.imagenes.length}
            </Typography>
          )}
        </Box>
      </Dialog>
    </Container>
  );
};

export default ProjectDetailPage;
