import React, { useState } from 'react';
import './ImageUploader.scss';
import { Upload, X } from 'lucide-react';
import ImagePreview from '../../shared/components/ImagePreview';
import { getImageUrl } from '../../utils/imageUrl';

const ImageUploader = ({
  onChange,
  value,
  preview,
  apiUrl,
  label = 'Upload Gambar',
  required = false,
  accept = 'image/*',
  helpText
}) => {
  const [error, setError] = useState(null);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file tidak boleh lebih dari 5MB');
      return;
    }
    
    setError(null);
    onChange(file);
  };
  
  const handleRemove = () => {
    onChange(null);
  };
  
  const getPreviewUrl = () => {
    if (!preview) return null;
    
    if (typeof preview === 'string') {
      // Use our utility function to handle both Cloudinary and local URLs
      return getImageUrl(preview);
    }
    
    // If preview is a File object
    return URL.createObjectURL(preview);
  };
  
  return (
    <div className="image-uploader">
      <div className="uploader-header">
        <label>
          {label}
          {required && <span className="required">*</span>}
        </label>
      </div>
      
      {preview ? (
        <div className="preview-container">
          <ImagePreview
            src={getPreviewUrl()}
            alt="Preview"
            onRemove={handleRemove}
          />
        </div>
      ) : (
        <label className="upload-area">
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            hidden
          />
          <div className="upload-content">
            <Upload size={36} />
            <span className="upload-text">
              Klik atau seret gambar ke sini
            </span>
            <span className="upload-hint">
              Format: JPG, PNG, GIF (Maks. 5MB)
            </span>
          </div>
        </label>
      )}
      
      {helpText && <p className="help-text">{helpText}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default ImageUploader;