import { apiClient } from './client';
import {
  GetProjectsResponse,
  GetProjectResponse,
  CreateProjectRequest,
  CreateProjectResponse,
  UpdateProjectRequest,
  DeleteProjectResponse,
} from '@/types';

export const projectsService = {
  getProjects: async (
    page: number = 1,
    limit: number = 10
  ): Promise<GetProjectsResponse> => {
    const response = await apiClient.get<GetProjectsResponse>('/api/projects', {
      params: { page, limit },
    });
    return response.data;
  },

  getProjectById: async (id: number): Promise<GetProjectResponse> => {
    const response = await apiClient.get<GetProjectResponse>(
      `/api/projects/${id}`
    );
    return response.data;
  },

  createProject: async (
    data: CreateProjectRequest
  ): Promise<CreateProjectResponse> => {
    const response = await apiClient.post<CreateProjectResponse>(
      '/api/projects',
      data
    );
    return response.data;
  },

  updateProject: async (
    id: number,
    data: UpdateProjectRequest
  ): Promise<GetProjectResponse> => {
    const response = await apiClient.put<GetProjectResponse>(
      `/api/projects/${id}`,
      data
    );
    return response.data;
  },

  deleteProject: async (id: number): Promise<DeleteProjectResponse> => {
    const response = await apiClient.delete<DeleteProjectResponse>(
      `/api/projects/${id}`
    );
    return response.data;
  },
};
