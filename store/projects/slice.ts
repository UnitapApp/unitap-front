import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Project = {
  id: number
  logo: string
  name: string
  description: string
  website: string
  socialMedias: Record<string, string>
  createdAt: Date
};

const initialProjecsState = {
  projects: [] as Project[]
};

export const projectsSlice = createSlice({
  name: 'projects',
  initialState: initialProjecsState,
  reducers: {
    addProject(state, action: PayloadAction<Project>) {
      state.projects.push(action.payload)
    },
    removeProject(state, action: PayloadAction<Project>) {
      const index = state.projects.findIndex(project => project.id === action.payload.id)
      if (index === -1) return

      state.projects.splice(index, 1)
    },
    editProject(state, action: PayloadAction<Project>) {
      const index = state.projects.findIndex(project => project.id === action.payload.id)
      if (index === -1) return

      state.projects[index] = action.payload
    }
  },
});
