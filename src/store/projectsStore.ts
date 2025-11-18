import { create } from 'zustand';
import { Project, Pagination } from '@/types';

interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  pagination: Pagination | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  setProjects: (projects: Project[], pagination: Pagination) => void;
  setCurrentProject: (project: Project | null) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  removeProject: (id: number) => void;
  clearProjects: () => void;
}

export const useProjectsStore = create<ProjectsState>((set) => ({
  projects: [],
  currentProject: null,
  pagination: null,
  searchQuery: '',
  isLoading: false,
  error: null,
  setProjects: (projects, pagination) =>
    set({ projects, pagination, error: null }),
  setCurrentProject: (project) => set({ currentProject: project }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  addProject: (project) =>
    set((state) => ({
      projects: [project, ...state.projects],
    })),
  updateProject: (project) =>
    set((state) => ({
      projects: state.projects.map((p) => (p.id === project.id ? project : p)),
      currentProject:
        state.currentProject?.id === project.id ? project : state.currentProject,
    })),
  removeProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      currentProject: state.currentProject?.id === id ? null : state.currentProject,
    })),
  clearProjects: () =>
    set({
      projects: [],
      currentProject: null,
      pagination: null,
      searchQuery: '',
      error: null,
    }),
}));
