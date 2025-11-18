import { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Stack,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useProjectsStore } from '@/store/projectsStore';
import { projectsService } from '@/services/api';
import ProjectFormDialog from '@/components/ProjectFormDialog';
import { CreateProjectRequest, UpdateProjectRequest } from '@/types';

const AdminPage = () => {
  const navigate = useNavigate();
  const { projects, setProjects, addProject, updateProject, removeProject } = useProjectsStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);

  useEffect(() => {
    loadAllProjects();
  }, []);

  const loadAllProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      // Cargar todos los proyectos (usando un límite alto para admin)
      const response = await projectsService.getProjects(1, 100);
      setProjects(response.proyectos, response.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar los proyectos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CreateProjectRequest | UpdateProjectRequest) => {
    const response = await projectsService.createProject(data as CreateProjectRequest);
    addProject(response.proyecto);
    setFormOpen(false);
  };

  const handleEdit = async (project: any) => {
    try {
      setLoading(true);
      // Cargar datos completos del proyecto desde el backend
      const response = await projectsService.getProjectById(project.id);
      setEditingProject(response.proyecto);
      setFormOpen(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar el proyecto');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: CreateProjectRequest | UpdateProjectRequest) => {
    if (editingProject) {
      const response = await projectsService.updateProject(editingProject.id, data);
      updateProject(response.proyecto);
      setFormOpen(false);
      setEditingProject(null);
    }
  };

  const handleDeleteClick = (id: number) => {
    setProjectToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (projectToDelete !== null) {
      try {
        await projectsService.deleteProject(projectToDelete);
        removeProject(projectToDelete);
        setDeleteDialogOpen(false);
        setProjectToDelete(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al eliminar el proyecto');
      }
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingProject(null);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Administración de Proyectos
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setFormOpen(true)}>
          Nuevo Proyecto
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Título</TableCell>
                <TableCell>Creador</TableCell>
                <TableCell>Stack</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No hay proyectos disponibles
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>{project.id}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {project.titulo}
                      </Typography>
                    </TableCell>
                    <TableCell>{project.creador}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                        {project.stack.slice(0, 2).map((tech, idx) => (
                          <Chip key={idx} label={tech} size="small" variant="outlined" />
                        ))}
                        {project.stack.length > 2 && (
                          <Chip label={`+${project.stack.length - 2}`} size="small" />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                        {project.tags.slice(0, 2).map((tag, idx) => (
                          <Chip key={idx} label={tag} size="small" color="secondary" />
                        ))}
                        {project.tags.length > 2 && (
                          <Chip label={`+${project.tags.length - 2}`} size="small" />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {new Date(project.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/project/${project.id}`)}
                        title="Ver"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(project)}
                        title="Editar"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(project.id)}
                        title="Eliminar"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ProjectFormDialog
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={editingProject ? handleUpdate : handleCreate}
        project={editingProject}
        mode={editingProject ? 'edit' : 'create'}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPage;
