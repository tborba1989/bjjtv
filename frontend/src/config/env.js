// src/config/env.js
export const config = {
  apiUrl: process.env.REACT_APP_API_URL,
  imagePath: process.env.REACT_APP_IMAGE_PATH || '/images',
};

export const getImageUrl = (imageName) => `${config.imagePath}/${imageName}`;

export default config;