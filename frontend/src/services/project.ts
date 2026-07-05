/**
 * Project API service.
 *
 * This module handles CRUD operations for saved projects.
 * All requests require authentication and are scoped to the
 * currently logged in user.
 */

import type { MarketingKit } from "../types/marketingKit";
import type { AudioAnalysis } from "../types/audioAnalysis";

type ProjectData = {
  title: string;
  genre: string;
  mood: string;
  bpm: string;
  key: string;
  analysis: AudioAnalysis | null;
  marketingKit: MarketingKit;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Build authenticated request headers using the user's JWT.
 */
function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Save a newly generated marketing project.
 */
export async function saveProject(projectData: ProjectData) {
  const response = await fetch(`${API_BASE_URL}/api/projects`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      title: projectData.title,
      genre: projectData.genre,
      mood: projectData.mood,
      bpm: Number(projectData.bpm),
      key: projectData.key,
      duration_seconds: projectData.analysis?.duration_seconds ?? 0,
      energy: projectData.analysis?.energy ?? "Unknown",
      marketing_kit: projectData.marketingKit,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to save project");
  }

  return response.json();
}

/**
 * Retrieve all projects belonging to the authenticated user.
 */
export async function getProjects() {
  const response = await fetch(`${API_BASE_URL}/api/projects`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json();
}

/**
 * Delete a saved project.
 */
export async function deleteProject(projectId: number) {
  const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete project");
  }

  return response.json();
}

/**
 * Update an existing saved project with the latest form data,
 * audio analysis results, and generated marketing assets.
 */
export async function updateProject(
  projectId: number,
  projectData: ProjectData
) {
  const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      title: projectData.title,
      genre: projectData.genre,
      mood: projectData.mood,
      bpm: Number(projectData.bpm),
      key: projectData.key,
      duration_seconds: projectData.analysis?.duration_seconds ?? 0,
      energy: projectData.analysis?.energy ?? "Unknown",
      marketing_kit: projectData.marketingKit,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update project");
  }

  return response.json();
}