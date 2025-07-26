// SiteSettingsPage.js
import React, { useState, useEffect } from 'react';
import './SiteSettingsPage.scss';
import api from '../../utils/api';
import Loader from '../../shared/components/Loader';
import Message from '../../shared/components/Message';
import FormModal from '../components/FormModal';
import ImageUploader from '../components/ImageUploader';
import { Edit } from 'lucide-react';

const SiteSettingsPage = () => {
  const [settings, setSettings] = useState({
    home_description: '',
    home_image: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Modal states
  const [isEditDescModalOpen, setIsEditDescModalOpen] = useState(false);
  const [isEditImageModalOpen, setIsEditImageModalOpen] = useState(false);
  
  // Form data
  const [descriptionFormData, setDescriptionFormData] = useState('');
  const [imageFormData, setImageFormData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await api.get('/site-settings');
        
        // Convert array to object with key-value pairs
        const settingsObj = {};
        response.data.forEach(setting => {
          settingsObj[setting.key] = setting.value;
        });
        
        setSettings({
          home_description: settingsObj.home_description || '',
          home_image: settingsObj.home_image || ''
        });
        
        setError(null);
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        setError('Gagal memuat pengaturan situs. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  // Handle description modal open
  const handleEditDescriptionClick = () => {
    setDescriptionFormData(settings.home_description);
    setIsEditDescModalOpen(true);
  };
  
  // Handle image modal open
  const handleEditImageClick = () => {
    setPreviewImage(settings.home_image);
    setImageFormData(null);
    setIsEditImageModalOpen(true);
  };
  
  // Handle description form submit
  const handleDescFormSubmit = async () => {
    try {
      setFormLoading(true);
      
      await api.put(`/site-settings/home_description`, {
        value: descriptionFormData,
        type: 'text'
      });
      
      // Update local state
      setSettings(prev => ({
        ...prev,
        home_description: descriptionFormData
      }));
      
      setIsEditDescModalOpen(false);
      setSuccess('Deskripsi beranda berhasil diperbarui');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Failed to update description:', error);
      setError('Gagal memperbarui deskripsi. Silakan coba lagi.');
    } finally {
      setFormLoading(false);
    }
  };
  
  // Handle image form submit
  const handleImageFormSubmit = async () => {
    if (!imageFormData) {
      setError('Silakan pilih gambar untuk diunggah');
      return;
    }
    
    try {
      setFormLoading(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append('image', imageFormData);
      
      const response = await api.put(`/site-settings/home_image`, formDataToSend);
      
      // Update local state
      setSettings(prev => ({
        ...prev,
        home_image: response.data.value
      }));
      
      setIsEditImageModalOpen(false);
      setSuccess('Gambar beranda berhasil diperbarui');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Failed to update image:', error);
      setError('Gagal memperbarui gambar. Silakan coba lagi.');
    } finally {
      setFormLoading(false);
    }
  };
  
  // Handle image change
  const handleImageChange = (file) => {
    setImageFormData(file);
    setPreviewImage(file);
  };
  
  if (loading) {
    return <Loader />;
  }
  
  return (
    <div className="site-settings-page">
      <div className="page-header">
        <h2>Pengaturan Beranda</h2>
        <p>Kelola konten pada halaman beranda website</p>
      </div>
      
      {error && (
        <Message 
          type="error" 
          message={error} 
          onClose={() => setError(null)}
        />
      )}
      
      {success && (
        <Message 
          type="success" 
          message={success} 
          onClose={() => setSuccess(null)}
        />
      )}
      
      <div className="settings-cards">
        {/* Description Card */}
        <div className="settings-card">
          <div className="card-header">
            <h3>Deskripsi Beranda</h3>
            <button 
              className="edit-button"
              onClick={handleEditDescriptionClick}
            >
              <Edit size={18} />
              <span>Edit</span>
            </button>
          </div>
          <div className="card-content">
            <div className="description-preview">
              {settings.home_description ? (
                <p>{settings.home_description}</p>
              ) : (
                <p className="placeholder">Belum ada deskripsi. Klik tombol Edit untuk menambahkan.</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Image Card */}
        <div className="settings-card">
          <div className="card-header">
            <h3>Gambar Beranda</h3>
            <button 
              className="edit-button"
              onClick={handleEditImageClick}
            >
              <Edit size={18} />
              <span>Edit</span>
            </button>
          </div>
          <div className="card-content">
            <div className="image-preview">
              {settings.home_image ? (
                <img 
                  src={`${process.env.REACT_APP_API_URL?.replace('/api', '')}${settings.home_image}`} 
                  alt="Gambar Beranda" 
                />
              ) : (
                <div className="placeholder">
                  <p>Belum ada gambar. Klik tombol Edit untuk menambahkan.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit Description Modal */}
      <FormModal
        isOpen={isEditDescModalOpen}
        onClose={() => setIsEditDescModalOpen(false)}
        onSubmit={handleDescFormSubmit}
        title="Edit Deskripsi Beranda"
        submitText="Simpan"
        isLoading={formLoading}
      >
        <div className="form-group">
          <label htmlFor="description">
            Deskripsi <span className="required">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={descriptionFormData}
            onChange={(e) => setDescriptionFormData(e.target.value)}
            required
            rows={6}
            placeholder="Masukkan deskripsi beranda di sini..."
          />
          <p className="help-text">Deskripsi ini akan ditampilkan pada halaman beranda website.</p>
        </div>
      </FormModal>
      
      {/* Edit Image Modal */}
      <FormModal
        isOpen={isEditImageModalOpen}
        onClose={() => setIsEditImageModalOpen(false)}
        onSubmit={handleImageFormSubmit}
        title="Edit Gambar Beranda"
        submitText="Simpan"
        isLoading={formLoading}
      >
        <ImageUploader
          onChange={handleImageChange}
          value={imageFormData}
          preview={previewImage}
          apiUrl={process.env.REACT_APP_API_URL}
          label="Gambar Beranda"
          required={true}
          helpText="Gambar ini akan ditampilkan pada halaman beranda website. Disarankan menggunakan gambar dengan rasio 16:9."
        />
      </FormModal>
    </div>
  );
};

export default SiteSettingsPage;