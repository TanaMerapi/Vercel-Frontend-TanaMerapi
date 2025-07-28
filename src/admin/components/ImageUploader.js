import React, { useState, useEffect } from 'react';
import './ImageUploader.scss';
import { Upload, AlertCircle } from 'lucide-react';
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
  const [fileDetails, setFileDetails] = useState(null);
  
  // Debug log when component updates
  useEffect(() => {
    console.log('ImageUploader state:', {
      hasValue: !!value,
      hasPreview: !!preview,
      previewType: typeof preview,
      error
    });
    
    if (preview && typeof preview === 'string') {
      console.log('Preview URL:', preview);
    }
  }, [value, preview, error]);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      return;
    }
    
    // Log file details for debugging
    console.log('File selected:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    });
    
    setFileDetails({
      name: file.name,
      type: file.type,
      size: formatFileSize(file.size),
      lastModified: new Date(file.lastModified).toLocaleString()
    });
    
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
    setFileDetails(null);
    setError(null);
    onChange(null);
  };
  
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
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
          {fileDetails && (
            <div className="file-details">
              <p className="file-name">{fileDetails.name}</p>
              <p className="file-size">{fileDetails.size}</p>
              <p className="file-type">{fileDetails.type}</p>
            </div>
          )}
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
      
      {error && (
        <div className="error-container">
          <AlertCircle size={16} />
          <p className="error-text">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;