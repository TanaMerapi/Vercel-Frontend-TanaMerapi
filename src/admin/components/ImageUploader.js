import React, { useState, useRef } from 'react';
import './ImageUploader.scss';
import { Upload, Image, AlertCircle } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUrl';

const ImageUploader = ({ 
  onChange, 
  value, 
  preview, 
  label, 
  helpText, 
  required = false,
  apiUrl
}) => {
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      return;
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Format file tidak valid. Gunakan JPG, PNG, atau WEBP');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file terlalu besar. Maksimal 5MB');
      return;
    }
    
    setError(null);
    onChange(file);
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const handleClickUpload = () => {
    fileInputRef.current.click();
  };
  
  const renderPreview = () => {
    // Use uploaded file preview
    if (previewUrl) {
      return <img src={previewUrl} alt="Preview" />;
    }
    
    // Use existing image preview (e.g., for edit)
    if (preview) {
      return <img src={getImageUrl(preview)} alt="Preview" />;
    }
    
    // No preview
    return (
      <div className="upload-placeholder">
        <Upload size={32} />
        <p>Klik untuk mengunggah gambar</p>
      </div>
    );
  };
  
  return (
    <div className="image-uploader">
      <label>
        {label} {required && <span className="required">*</span>}
      </label>
      
      <div className="uploader-container" onClick={handleClickUpload}>
        <div className="preview-container">
          {renderPreview()}
          {(isUploading) && (
            <div className="overlay">
              <div className="spinner"></div>
            </div>
          )}
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
        />
      </div>
      
      {error && (
        <div className="error-message">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
      
      {helpText && <p className="help-text">{helpText}</p>}
    </div>
  );
};

export default ImageUploader;