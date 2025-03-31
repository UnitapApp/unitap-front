import { Campaign } from "@/types/dashboard/campaign";
import { Project } from "@/types/dashboard/project";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialProjecsState = {
  projects: [] as Project[],
  selectedProject: null as Project | null,
  isAddCampaginOpen: false,
};

export const projectsSlice = createSlice({
  name: "projects",
  initialState: initialProjecsState,
  reducers: {
    addProject(state, action: PayloadAction<Project>) {
      state.projects.push(action.payload);
      if (!state.selectedProject) {
        state.selectedProject = action.payload;
      }
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
    createCampagin(state, action: PayloadAction<Campaign>) {
      const project = state.selectedProject;
      if (!project) return;
      state.projects
        .find((item) => item.id === project.id)
        ?.campaigns.push(action.payload);
      project.campaigns.push(action.payload);
    },
    changeAddCampaginModal(state, action: PayloadAction<boolean>) {
      state.isAddCampaginOpen = action.payload;
    },
    editProject(state, action: PayloadAction<Project>) {
      const index = state.projects.findIndex(
        (project) => project.id === action.payload.id,
      );
      if (index === -1) return;
      state.projects[index] = action.payload;
    },
    removeCampaign(state, action: PayloadAction<{ campaign: Campaign }>) {
      const project = state.selectedProject;
      if (!project) return;
      const index = project.campaigns.findIndex(
        (campaign) => campaign.id === action.payload.campaign.id,
      );

      if (index === -1) return;

      state.projects
        .find((item) => item.id === project.id)
        ?.campaigns.splice(index, 1);

      project.campaigns.splice(index, 1);
    },
  },
});

export const {
  addProject,
  editProject,
  removeProject,
  setSelectedProject,
  createCampagin,
  changeAddCampaginModal,
  removeCampaign,
} = projectsSlice.actions;
