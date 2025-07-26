import React, { useState, useEffect } from 'react';
import './SocialMediaList.scss';
import DataTable from '../components/DataTable';
import ActionMenu from '../components/ActionMenu';
import ConfirmationModal from '../components/ConfirmationModal';
import FormModal from '../components/FormModal';
import Loader from '../../shared/components/Loader';
import Message from '../../shared/components/Message';
import api from '../../utils/api';
import { Plus } from 'lucide-react';

// Import logo images
import instagramLogo from '../../images/instagram.png';
import whatsappLogo from '../../images/whatsapp.png';
import tiktokLogo from '../../images/tiktok.png';

const SocialMediaList = () => {
  const [socialMedia, setSocialMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentSocialMedia, setCurrentSocialMedia] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    platform: 'instagram',
    url: '',
    icon: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  
  // Fetch social media
  const fetchSocialMedia = async () => {
    try {
      setLoading(true);
      const response = await api.get('/social-media');
      setSocialMedia(response.data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch social media:', error);
      setError('Gagal memuat data social media. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSocialMedia();
  }, []);
  
  // Handle form change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // If platform is changing, update icon as well
    if (name === 'platform') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        icon: getPlatformIcon(value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Get default icon for platform
  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'instagram':
        return 'Instagram';
      case 'whatsapp':
        return 'MessageCircle';
      case 'tiktok':
        return 'TikTok';
      default:
        return 'Share2';
    }
  };
  
  // Render platform icon
  const renderPlatformIcon = (platform) => {
    switch (platform) {
      case 'instagram':
        return <img src={instagramLogo} alt="Instagram" className="platform-logo" />;
      case 'whatsapp':
        return <img src={whatsappLogo} alt="WhatsApp" className="platform-logo" />;
      case 'tiktok':
        return <img src={tiktokLogo} alt="TikTok" className="platform-logo" />;
      default:
        return <img src={instagramLogo} alt="Social Media" className="platform-logo" />;
    }
  };
  
  // Handle add social media
  const handleAddClick = () => {
    setFormData({
      platform: 'instagram',
      url: '',
      icon: getPlatformIcon('instagram')
    });
    setIsAddModalOpen(true);
  };
  
  const handleAddSubmit = async () => {
    if (!formData.platform || !formData.url) {
      setError('Platform dan URL harus diisi');
      return;
    }
    
    try {
      setFormLoading(true);
      
      await api.post('/social-media', {
        platform: formData.platform,
        url: formData.url,
        icon: formData.icon
      });
      
      setIsAddModalOpen(false);
      fetchSocialMedia();
      setError(null);
    } catch (error) {
      console.error('Failed to add social media:', error);
      
      if (error.response && error.response.status === 400) {
        setError(`Platform ${formData.platform} sudah ada. Gunakan platform lain.`);
      } else {
        setError('Gagal menambahkan social media. Silakan coba lagi.');
      }
    } finally {
      setFormLoading(false);
    }
  };
  
  // Handle edit social media
  const handleEditClick = (socialMediaItem) => {
    setCurrentSocialMedia(socialMediaItem);
    setFormData({
      platform: socialMediaItem.platform,
      url: socialMediaItem.url,
      icon: socialMediaItem.icon
    });
    setIsEditModalOpen(true);
  };
  
  const handleEditSubmit = async () => {
    if (!formData.platform || !formData.url) {
      setError('Platform dan URL harus diisi');
      return;
    }
    
    try {
      setFormLoading(true);
      
      await api.put(`/social-media/${currentSocialMedia.id}`, {
        platform: formData.platform,
        url: formData.url,
        icon: formData.icon
      });
      
      setIsEditModalOpen(false);
      fetchSocialMedia();
      setError(null);
    } catch (error) {
      console.error('Failed to update social media:', error);
      
      if (error.response && error.response.status === 400) {
        setError(`Platform ${formData.platform} sudah ada. Gunakan platform lain.`);
      } else {
        setError('Gagal mengupdate social media. Silakan coba lagi.');
      }
    } finally {
      setFormLoading(false);
    }
  };
  
  // Handle delete social media
  const handleDeleteClick = (socialMediaItem) => {
    setCurrentSocialMedia(socialMediaItem);
    setIsDeleteModalOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    try {
      setFormLoading(true);
      
      await api.delete(`/social-media/${currentSocialMedia.id}`);
      
      setIsDeleteModalOpen(false);
      fetchSocialMedia();
    } catch (error) {
      console.error('Failed to delete social media:', error);
      setError('Gagal menghapus social media. Silakan coba lagi.');
    } finally {
      setFormLoading(false);
    }
  };
  
  // Get platform label
  const getPlatformLabel = (platform) => {
    switch (platform) {
      case 'instagram':
        return 'Instagram';
      case 'whatsapp':
        return 'WhatsApp';
      case 'tiktok':
        return 'TikTok';
      default:
        return platform;
    }
  };
  
  // Table columns
  const columns = [
    {
      key: 'id',
      label: 'ID',
      sortable: true
    },
    {
      key: 'platform',
      label: 'Platform',
      sortable: true,
      render: (row) => (
        <div className="platform-cell">
          <div className={`platform-icon ${row.platform}`}>
            {renderPlatformIcon(row.platform)}
          </div>
          <span>{getPlatformLabel(row.platform)}</span>
        </div>
      )
    },
    {
      key: 'url',
      label: 'URL',
      render: (row) => (
        <div className="url-cell">
          <a 
            href={row.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="url-link"
          >
            {row.url.length > 50 ? `${row.url.substring(0, 50)}...` : row.url}
          </a>
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Tanggal Dibuat',
      sortable: true,
      render: (row) => new Date(row.createdAt).toLocaleDateString('id-ID')
    }
  ];
  
  // Action column
  const renderActions = (row, setMessage) => (
    <ActionMenu
      onEdit={() => handleEditClick(row)}
      onDelete={() => handleDeleteClick(row)}
      viewText={null}
    />
  );
  
  if (loading && socialMedia.length === 0) {
    return <Loader />;
  }
  
  // Check which platforms are already used
  const usedPlatforms = socialMedia.map(item => item.platform);
  const availablePlatforms = ['instagram', 'whatsapp', 'tiktok'].filter(
    platform => !usedPlatforms.includes(platform) || platform === formData.platform
  );
  
  return (
    <div className="social-media-list-page">
      <div className="page-actions">
        {availablePlatforms.length > 0 && (
          <button className="add-button" onClick={handleAddClick}>
            <Plus size={18} />
            <span>Tambah Social Media</span>
          </button>
        )}
      </div>
      
      {error && (
        <Message 
          type="error" 
          message={error} 
          onClose={() => setError(null)}
        />
      )}
      
      <DataTable
        columns={columns}
        data={socialMedia}
        searchKey="platform"
        actionColumn={renderActions}
        isLoading={loading}
        emptyMessage="Tidak ada social media tersedia."
      />
      
      {/* Add Social Media Modal */}
      <FormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        title="Tambah Social Media"
        submitText="Simpan"
        isLoading={formLoading}
      >
        <div className="form-group">
          <label htmlFor="platform">
            Platform <span className="required">*</span>
          </label>
          <select
            id="platform"
            name="platform"
            value={formData.platform}
            onChange={handleInputChange}
            required
          >
            {availablePlatforms.map(platform => (
              <option key={platform} value={platform}>
                {getPlatformLabel(platform)}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="url">
            URL <span className="required">*</span>
          </label>
          <input
            type="text"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleInputChange}
            required
            placeholder={`https://${formData.platform}.com/username`}
          />
          <p className="help-text">
            {formData.platform === 'instagram' && 'Contoh: https://instagram.com/Tanahmerapi'}
            {formData.platform === 'whatsapp' && 'Contoh: https://wa.me/6281234567890'}
            {formData.platform === 'tiktok' && 'Contoh: https://tiktok.com/@Tanahmerapi'}
          </p>
        </div>
      </FormModal>
      
      {/* Edit Social Media Modal */}
      <FormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        title="Edit Social Media"
        submitText="Simpan"
        isLoading={formLoading}
      >
        <div className="form-group">
          <label htmlFor="platform">
            Platform <span className="required">*</span>
          </label>
          <select
            id="platform"
            name="platform"
            value={formData.platform}
            onChange={handleInputChange}
            required
          >
            {availablePlatforms.map(platform => (
              <option key={platform} value={platform}>
                {getPlatformLabel(platform)}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="url">
            URL <span className="required">*</span>
          </label>
          <input
            type="text"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleInputChange}
            required
            placeholder={`https://${formData.platform}.com/username`}
          />
          <p className="help-text">
            {formData.platform === 'instagram' && 'Contoh: https://instagram.com/Tanahmerapi'}
            {formData.platform === 'whatsapp' && 'Contoh: https://wa.me/6281234567890'}
            {formData.platform === 'tiktok' && 'Contoh: https://tiktok.com/@Tanahmerapi'}
          </p>
        </div>
      </FormModal>
      
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Social Media"
        message={`Apakah Anda yakin ingin menghapus ${getPlatformLabel(currentSocialMedia?.platform || '')}?`}
        confirmText="Hapus"
        isLoading={formLoading}
      />
    </div>
  );
};

export default SocialMediaList;