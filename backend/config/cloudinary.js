const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Check if Cloudinary credentials are fully configured
 */
const isCloudinaryConfigured = () => {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

/**
 * Uploads a file buffer to Cloudinary inside the specified folder.
 * @param {Buffer} buffer - File buffer from multer memoryStorage
 * @param {string} folder - Folder name in Cloudinary (default: 'portfolio')
 * @returns {Promise<object>} - Result from Cloudinary uploader
 */
const uploadToCloudinary = (buffer, folder = 'portfolio') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image'
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

/**
 * Deletes an image from Cloudinary by extracting its public_id from URL or publicId string.
 * @param {string} imageUrlOrId - The secure_url or public_id
 * @returns {Promise<object|null>}
 */
const deleteFromCloudinary = async (imageUrlOrId) => {
  if (!imageUrlOrId || !isCloudinaryConfigured()) return null;
  try {
    let publicId = imageUrlOrId;
    if (imageUrlOrId.includes('cloudinary.com')) {
      const match = imageUrlOrId.match(/(portfolio\/[^.]+)/);
      if (match) {
        publicId = match[1];
      } else {
        const parts = imageUrlOrId.split('/upload/');
        if (parts.length > 1) {
          const afterUpload = parts[1].replace(/^v\d+\//, '');
          publicId = afterUpload.substring(0, afterUpload.lastIndexOf('.')) || afterUpload;
        }
      }
    }
    return await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('Error deleting image from Cloudinary:', err);
    return null;
  }
};

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadToCloudinary,
  deleteFromCloudinary
};
