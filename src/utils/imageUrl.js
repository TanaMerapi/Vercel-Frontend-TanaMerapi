// utils/imageUrl.js - Utility for handling image URLs with Cloudinary support

/**
 * Helper function to get the correct image URL from either local path or Cloudinary URL
 * @param {string} imagePath - The image path from API
 * @returns {string} - The complete URL to the image
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return ''; // Return empty string if no image path
  }
  
  // Check if it's already a Cloudinary URL or any other full URL
  if (imagePath.includes('cloudinary.com') || imagePath.startsWith('http')) {
    return imagePath; // Return the URL as is
  }
  
  // Otherwise, it's a local path, prepend the API URL
  return `${process.env.REACT_APP_API_URL?.replace('/api', '')}${imagePath}`;
};

/**
 * Transforms a Cloudinary URL to apply optimizations like resizing, format conversion, etc.
 * @param {string} url - The original Cloudinary URL
 * @param {object} options - Transformation options
 * @returns {string} - The transformed URL
 */
export const optimizeCloudinaryImage = (url, options = {}) => {
  if (!url || !url.includes('cloudinary.com')) {
    return url; // Return the URL as is if it's not a Cloudinary URL
  }
  
  const defaults = {
    width: options.width || 800,
    height: options.height || 800,
    crop: options.crop || 'limit',
    quality: options.quality || 'auto',
    format: options.format || 'auto'
  };
  
  try {
    // Split the URL into parts
    const parts = url.split('/upload/');
    if (parts.length !== 2) return url;
    
    // Build the transformation string
    const transformations = [
      `w_${defaults.width}`,
      `h_${defaults.height}`,
      `c_${defaults.crop}`,
      `q_${defaults.quality}`,
      `f_${defaults.format}`
    ].join(',');
    
    // Return the transformed URL
    return `${parts[0]}/upload/${transformations}/${parts[1]}`;
  } catch (error) {
    console.error('Error optimizing image:', error);
    return url;
  }
};