export const getImagePath = (path: string) => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // For development, use the path as is
  if (process.env.NODE_ENV === 'development') {
    return `/${cleanPath}`;
  }
  
  // For production (GitHub Pages), add the base path
  return `/daniyal-portfolio/${cleanPath}`;
}; 