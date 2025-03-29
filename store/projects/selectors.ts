import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";

export const selectProjects = createSelector(
  (state: RootState) => state.projects,
  (projects) => projects.projects,
);

export const selectSelectedProject = createSelector(
  (state: RootState) => state.projects,
  (projects) => projects.selectedProject ?? projects.projects[0],
);

export const selectIsAddCampaginOpen = createSelector(
  (state: RootState) => state.projects,
  (projects) => projects.isAddCampaginOpen,
);
