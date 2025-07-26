import React, { useState, useEffect } from 'react';
import './SlidesList.scss';
import DataTable from '../components/DataTable';
import ActionMenu from '../components/ActionMenu';
import ConfirmationModal from '../components/ConfirmationModal';
import FormModal from '../components/FormModal';
import ImageUploader from '../components/ImageUploader';
import Loader from '../../shared/components/Loader';
import Message from '../../shared/components/Message';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/imageUrl';
import { Plus, Eye, Trash2 } from 'lucide-react';

const SlidesList = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    order: 0,
    image: null
  });
  const [formLoading, setFormLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
  // Fetch slides
  const fetchSlides = async () => {
    try {
      setLoading(true);
      const response = await api.get('/slides');
      setSlides(response.data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch slides:', error);
      setError('Gagal memuat data slides. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSlides();
  }, []);
  
  // Handle form change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (file) => {
    setFormData(prev => ({ ...prev, image: file }));
    setPreviewImage(file);
  };
  
  // Handle add slide
  const handleAddClick = () => {
    setFormData({
      title: '',
      order: 0,
      image: null
    });
    setPreviewImage(null);
    setIsAddModalOpen(true);
  };
  
  const handleAddSubmit = async () => {
    if (!formData.title || !formData.image) {
      setError('Judul dan gambar harus diisi');
      return;
    }
    
    try {
      setFormLoading(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('order', formData.order);
      formDataToSend.append('image', formData.image);
      
      await api.post('/slides', formDataToSend);
      
      setIsAddModalOpen(false);
      fetchSlides();
      setError(null);
    } catch (error) {
      console.error('Failed to add slide:', error);
      setError('Gagal menambahkan slide. Silakan coba lagi.');
    } finally {
      setFormLoading(false);
    }
  };
  
  // Handle edit slide
  const handleEditClick = (slide) => {
    setCurrentSlide(slide);
    setFormData({
      title: slide.title,
      order: slide.order,
      image: null
    });
    setPreviewImage(slide.image_url);
    setIsEditModalOpen(true);
  };
  
  const handleEditSubmit = async () => {
    if (!formData.title) {
      setError('Judul harus diisi');
      return;
    }
    
    try {
      setFormLoading(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('order', formData.order);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      await api.put(`/slides/${currentSlide.id}`, formDataToSend);
      
      setIsEditModalOpen(false);
      fetchSlides();
      setError(null);
    } catch (error) {
      console.error('Failed to update slide:', error);
      setError('Gagal mengupdate slide. Silakan coba lagi.');
    } finally {
      setFormLoading(false);
    }
  };
  
  // Handle delete slide
  const handleDeleteClick = (slide) => {
    setCurrentSlide(slide);
    setIsDeleteModalOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    try {
      setFormLoading(true);
      
      await api.delete(`/slides/${currentSlide.id}`);
      
      setIsDeleteModalOpen(false);
      fetchSlides();
    } catch (error) {
      console.error('Failed to delete slide:', error);
      setError('Gagal menghapus slide. Silakan coba lagi.');
    } finally {
      setFormLoading(false);
    }
  };
  
  // Handle view slide
  const handleViewClick = (slide) => {
    setCurrentSlide(slide);
    setIsViewModalOpen(true);
  };
  
  // Table columns
  const columns = [
    {
      key: 'id',
      label: 'ID',
      sortable: true
    },
    {
      key: 'image_url',
      label: 'Gambar',
      render: (row) => (
        <div className="slide-image">
          <img 
            src={getImageUrl(row.image_url)} 
            alt={row.title}
          />
        </div>
      )
    },
    {
      key: 'title',
      label: 'Judul',
      sortable: true
    },
    {
      key: 'order',
      label: 'Urutan',
      sortable: true
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
      onView={() => handleViewClick(row)}
      onEdit={() => handleEditClick(row)}
      onDelete={() => handleDeleteClick(row)}
    />
  );
  
  if (loading && slides.length === 0) {
    return <Loader />;
  }
  
  return (
    <div className="slides-list-page">
      <div className="page-actions">
        <button className="add-button" onClick={handleAddClick}>
          <Plus size={18} />
          <span>Tambah Slide</span>
        </button>
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
        data={slides}
        searchKey="title"
        actionColumn={renderActions}
        isLoading={loading}
        emptyMessage="Tidak ada slide tersedia."
      />
      
      {/* Add Slide Modal */}
      <FormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        title="Tambah Slide"
        submitText="Simpan"
        isLoading={formLoading}
      >
        <div className="form-group">
          <label htmlFor="title">
            Judul <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="order">Urutan</label>
          <input
            type="number"
            id="order"
            name="order"
            value={formData.order}
            onChange={handleInputChange}
          />
          <p className="help-text">Urutan tampilan slide (0, 1, 2, ...)</p>
        </div>
        
        <ImageUploader
          onChange={handleImageChange}
          value={formData.image}
          preview={previewImage}
          apiUrl={process.env.REACT_APP_API_URL}
          label="Gambar Slide"
          required={true}
        />
      </FormModal>
      
      {/* Edit Slide Modal */}
      <FormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        title="Edit Slide"
        submitText="Simpan"
        isLoading={formLoading}
      >
        <div className="form-group">
          <label htmlFor="title">
            Judul <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="order">Urutan</label>
          <input
            type="number"
            id="order"
            name="order"
            value={formData.order}
            onChange={handleInputChange}
          />
          <p className="help-text">Urutan tampilan slide (0, 1, 2, ...)</p>
        </div>
        
        <ImageUploader
          onChange={handleImageChange}
          value={formData.image}
          preview={previewImage}
          apiUrl={process.env.REACT_APP_API_URL}
          label="Gambar Slide"
          helpText="Biarkan kosong jika tidak ingin mengubah gambar."
        />
      </FormModal>
      
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Slide"
        message={`Apakah Anda yakin ingin menghapus slide "${currentSlide?.title}"?`}
        confirmText="Hapus"
        isLoading={formLoading}
      />
      
      {/* View Slide Modal */}
      {currentSlide && (
        <FormModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          onSubmit={() => setIsViewModalOpen(false)}
          title="Detail Slide"
          submitText="Tutup"
        >
          <div className="slide-detail">
            <div className="detail-image">
              <img 
                src={getImageUrl(currentSlide.image_url)} 
                alt={currentSlide.title} 
              />
            </div>
            
            <div className="detail-info">
              <div className="info-item">
                <h4>Judul</h4>
                <p>{currentSlide.title}</p>
              </div>
              
              <div className="info-item">
                <h4>Urutan</h4>
                <p>{currentSlide.order}</p>
              </div>
              
              <div className="info-item">
                <h4>Tanggal Dibuat</h4>
                <p>{new Date(currentSlide.createdAt).toLocaleDateString('id-ID')}</p>
              </div>
              
              <div className="info-item">
                <h4>Terakhir Diupdate</h4>
                <p>{new Date(currentSlide.updatedAt).toLocaleDateString('id-ID')}</p>
              </div>
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
};

export default SlidesList;