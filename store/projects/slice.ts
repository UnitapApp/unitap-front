import { Project } from "@/types/dashboard/project";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialProjecsState = {
  projects: [] as Project[],
  selectedProject: null as Project | null,
};

export const projectsSlice = createSlice({
  name: "projects",
  initialState: initialProjecsState,
  reducers: {
    addProject(state, action: PayloadAction<Project>) {
      state.projects.push(action.payload);
    },
    removeProject(state, action: PayloadAction<Project>) {
      const index = state.projects.findIndex(
        (project) => project.id === action.payload.id,
      );
      if (index === -1) return;

      state.projects.splice(index, 1);
    },
    setSelectedProject(state, action: PayloadAction<Project | null>) {
      state.selectedProject = action.payload;
    },
    editProject(state, action: PayloadAction<Project>) {
      const index = state.projects.findIndex(
        (project) => project.id === action.payload.id,
      );
      if (index === -1) return;

      state.projects[index] = action.payload;
    },
  },
});

export const { addProject, editProject, removeProject, setSelectedProject } =
  projectsSlice.actions;
