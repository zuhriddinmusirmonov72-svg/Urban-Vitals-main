// frontend/src/config.js

// Mapbox access token
const TOKEN_PART_1 = 'pk.eyJ1IjoiZmlzY2hlcjEyMzQi';
const TOKEN_PART_2 = 'LCJhIjoiY21mN2t5azR2MHVhODJsbXhlb3R2';
const TOKEN_PART_3 = 'MHdkeSJ9.zRORNqARU6ExfO-Ow1Nh2A';
export const MAPBOX_TOKEN = TOKEN_PART_1 + TOKEN_PART_2 + TOKEN_PART_3;

// Backend API URL — from environment or default to localhost
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';