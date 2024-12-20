import { API_BASE_URL } from "../config/constants";

export const proxyImageUrl = (originalUrl) => {
  return `${API_BASE_URL}/proxy-image?url=${encodeURIComponent(originalUrl)}`;
}; 
