import React, { useState } from 'react';
import './ImagePreview.scss';
import { X } from 'lucide-react';

const ImagePreview = ({ src, alt, onRemove }) => {
  const [error, setError] = useState(false);
  
  const handleError = () => {
    setError(true);
  };
  
  return (
    <div className="image-preview">
      {!error ? (
        <img 
          src={src} 
          alt={alt || 'Preview'} 
          onError={handleError}
        />
      ) : (
        <div className="image-error">Image not available</div>
      )}
      
      {onRemove && (
        <button className="remove-button" onClick={onRemove}>
          <X size={20} />
        </button>
      )}
    </div>
  );
};

export default ImagePreview;