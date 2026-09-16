// frontend/src/config.js

// Mapbox access token — MUST be set via environment variable VITE_MAPBOX_TOKEN
export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

// Backend API URL — from environment or default to localhost
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';