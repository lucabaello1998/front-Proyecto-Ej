import { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  TextField,
  InputAdornment,
  Pagination,
  Box,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useProjectsStore } from '@/store/projectsStore';
import { projectsService } from '@/services/api';

const ProjectsListPage = () => {
  const navigate = useNavigate();
  const {
    projects,
    pagination,
    searchQuery,
    isLoading,
    error,
    setProjects,
    setSearchQuery,
    setLoading,
    setError,
  } = useProjectsStore();

  const [page, setPage] = useState(1);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    loadProjects(page);
  }, [page]);

  const loadProjects = async (currentPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await projectsService.getProjects(currentPage, 12);
      setProjects(response.proyectos, response.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar los proyectos');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSearch = (value: string) => {
    setLocalSearch(value);
    setSearchQuery(value);
  };

  const filteredProjects = projects.filter((project) => {
    const query = searchQuery.toLowerCase();
    return (
      project.titulo.toLowerCase().includes(query) ||
      project.descripcion.toLowerCase().includes(query) ||
      project.creador.toLowerCase().includes(query) ||
      project.tags.some((tag) => tag.toLowerCase().includes(query)) ||
      project.stack.some((tech) => tech.toLowerCase().includes(query))
    );
  });

  const handleProjectClick = (id: number) => {
    navigate(`/project/${id}`);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Proyectos
        </Typography>
        <TextField
          fullWidth
          placeholder="Buscar proyectos por título, descripción, creador, tags o stack..."
          value={localSearch}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 800 }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!isLoading && filteredProjects.length === 0 && (
        <Alert severity="info">
          {searchQuery
            ? 'No se encontraron proyectos con los criterios de búsqueda.'
            : 'No hay proyectos disponibles.'}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
        {filteredProjects.map((project) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={project.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
              onClick={() => handleProjectClick(project.id)}
            >
              <CardMedia
                component="img"
                height="200"
                image={project.imagenes[0] || 'https://via.placeholder.com/400x200?text=Sin+Imagen'}
                alt={project.titulo}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2" noWrap>
                  {project.titulo}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    mb: 2,
                  }}
                >
                  {project.descripcion}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Por: {project.creador}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 0.5 }}>
                  {project.tags.slice(0, 3).map((tag, index) => (
                    <Chip key={index} label={tag} size="small" variant="outlined" />
                  ))}
                  {project.tags.length > 3 && (
                    <Chip label={`+${project.tags.length - 3}`} size="small" variant="outlined" />
                  )}
                </Stack>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between' }}>
                <Button size="small" onClick={() => handleProjectClick(project.id)}>
                  Ver Detalles
                </Button>
                {project.demo_url && (
                  <Button 
                    size="small" 
                    href={project.demo_url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Demo
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      )}

      {pagination && pagination.totalPages > 1 && !searchQuery && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pagination.totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Container>
  );
};

export default ProjectsListPage;
