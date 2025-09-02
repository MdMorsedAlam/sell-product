export const getImageUrl = (filename?: string): string => {
  if (!filename) return "/placeholder.svg";

  // Keep blob URLs (from File uploads)
  if (filename.startsWith("blob:")) return filename;

  // Keep full URLs
  if (filename.startsWith("http")) return filename;

  // For relative paths, prefix with backend server URL
  return `http://localhost:5000${filename}`;
};
