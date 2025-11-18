// Interfaces para la aplicación

export interface User {
  id: number;
  username: string;
  created_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export interface Project {
  id: number;
  titulo: string;
  descripcion: string;
  imagenes: string[];
  stack: string[];
  tags: string[];
  creador: string;
  demo_url: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectRequest {
  titulo: string;
  descripcion: string;
  imagenes: string[]; // Base64 images: "data:image/png;base64,..."
  stack: string[];
  tags: string[];
  creador: string;
  demo_url: string;
}

export interface UpdateProjectRequest {
  titulo?: string;
  descripcion?: string;
  imagenes?: string[];
  stack?: string[];
  tags?: string[];
  creador?: string;
  demo_url?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetProjectsResponse {
  proyectos: Project[];
  pagination: Pagination;
}

export interface GetProjectResponse {
  proyecto: Project;
}

export interface CreateProjectResponse {
  message: string;
  proyecto: Project;
}

export interface DeleteProjectResponse {
  message: string;
}

export interface ApiError {
  message: string;
  error?: string;
}
