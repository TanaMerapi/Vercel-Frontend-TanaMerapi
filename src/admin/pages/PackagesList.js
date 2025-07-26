// PackagesList.js
import React, { useState, useEffect } from 'react';
import './PackagesList.scss';
import DataTable from '../components/DataTable';
import ActionMenu from '../components/ActionMenu';
import ConfirmationModal from '../components/ConfirmationModal';
import FormModal from '../components/FormModal';
import ImageUploader from '../components/ImageUploader';
import Loader from '../../shared/components/Loader';
import Message from '../../shared/components/Message';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/imageUrl';
import { Plus, MapPin, Percent, Tag } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

const PackagesList = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    route: '',
    description: '',
    price: 0,
    image: null
  });
  const [formLoading, setFormLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
  // Fetch packages
  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/packages');
      setPackages(response.data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch packages:', error);
      setError('Gagal memuat data paket. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPackages();
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
  
  // Handle add package
  const handleAddClick = () => {
    setFormData({
      name: '',
      route: '',
      description: '',
      price: 0,
      image: null
    });
    setPreviewImage(null);
    setIsAddModalOpen(true);
  };
  
  const handleAddSubmit = async () => {
    if (!formData.name || !formData.image || formData.price <= 0) {
      setError('Nama, gambar, dan harga harus diisi dengan benar');
      return;
    }
    
    try {
      setFormLoading(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('route', formData.route || '');
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('price', formData.price);
      
      formDataToSend.append('image', formData.image);
      
      await api.post('/packages', formDataToSend);
      
      setIsAddModalOpen(false);
      fetchPackages();
      setError(null);
    } catch (error) {
      console.error('Failed to add package:', error);
      setError('Gagal menambahkan paket. Silakan coba lagi.');
    } finally {
      setFormLoading(false);
    }
  };
  
  // Handle edit package
  const handleEditClick = (packageData) => {
    setCurrentPackage(packageData);
    
    setFormData({
      name: packageData.name,
      route: packageData.route || '',
      description: packageData.description || '',
      price: packageData.price,
      image: null
    });
    
    setPreviewImage(packageData.image_url);
    setIsEditModalOpen(true);
  };
  
  const handleEditSubmit = async () => {
    if (!formData.name || formData.price <= 0) {
      setError('Nama dan harga harus diisi dengan benar');
      return;
    }
    
    try {
      setFormLoading(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('route', formData.route || '');
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('price', formData.price);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      await api.put(`/packages/${currentPackage.id}`, formDataToSend);
      
      setIsEditModalOpen(false);
      fetchPackages();
      setError(null);
    } catch (error) {
      console.error('Failed to update package:', error);
      setError('Gagal mengupdate paket. Silakan coba lagi.');
    } finally {
      setFormLoading(false);
    }
  };
  
  // Handle delete package
  const handleDeleteClick = (packageData) => {
    setCurrentPackage(packageData);
    setIsDeleteModalOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    try {
      setFormLoading(true);
      
      await api.delete(`/packages/${currentPackage.id}`);
      
      setIsDeleteModalOpen(false);
      fetchPackages();
    } catch (error) {
      console.error('Failed to delete package:', error);
      setError('Gagal menghapus paket. Silakan coba lagi.');
    } finally {
      setFormLoading(false);
    }
  };
  
  // Handle view package
  const handleViewClick = (packageData) => {
    setCurrentPackage(packageData);
    setIsViewModalOpen(true);
  };
  
  // Table columns
  const columns = [
    {
      key: 'image_url',
      label: 'Gambar',
      render: (row) => (
        <div className="package-image">
          <img 
            src={getImageUrl(row.image_url)} 
            alt={row.name}
          />
          {row.discount_percent > 0 && (
            <div className="discount-badge">
              <Percent size={14} /> {row.discount_percent}%
            </div>
          )}
        </div>
      )
    },
    {
      key: 'name',
      label: 'Nama',
      sortable: true
    },
    {
      key: 'price',
      label: 'Harga',
      sortable: true,
      render: (row) => (
        <div className="price-cell">
          {row.original_price ? (
            <>
              <span className="discounted-price">{formatCurrency(row.price)}</span>
              <span className="original-price">{formatCurrency(row.original_price)}</span>
            </>
          ) : (
            formatCurrency(row.price)
          )}
        </div>
      )
    },
    {
      key: 'discount_percent',
      label: 'Promo',
      render: (row) => (
        <div className="promotion-cell">
          {row.discount_percent > 0 ? (
            <span className="has-promotion">
              <Tag size={14} /> Diskon {row.discount_percent}%
            </span>
          ) : (
            <span className="no-promotion">Tidak ada</span>
          )}
        </div>
      )
    },
    {
      key: 'description',
      label: 'Deskripsi',
      render: (row) => (
        <div className="description-cell">
          {row.description ? (
            row.description.length > 80 
              ? `${row.description.substring(0, 80)}...` 
              : row.description
          ) : (
            <span className="no-description">Tidak ada deskripsi</span>
          )}
        </div>
      )
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
  
  if (loading && packages.length === 0) {
    return <Loader />;
  }
  
  return (
    <div className="packages-list-page">
      <div className="page-actions">
        <button className="add-button" onClick={handleAddClick}>
          <Plus size={18} />
          <span>Tambah Paket</span>
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
        data={packages}
        searchKey="name"
        actionColumn={renderActions}
        isLoading={loading}
        emptyMessage="Tidak ada paket tersedia."
      />
      
      {/* Add Package Modal */}
      <FormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        title="Tambah Paket"
        submitText="Simpan"
        isLoading={formLoading}
      >
        <div className="form-group">
          <label htmlFor="name">
            Nama <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="route">
            Rute
          </label>
          <input
            type="text"
            id="route"
            name="route"
            value={formData.route}
            onChange={handleInputChange}
            placeholder="Contoh: Kaliurang - Merapi - Kaliadem"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Deskripsi</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Deskripsi paket..."
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="price">
            Harga <span className="required">*</span>
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            min="0"
            step="1000"
          />
          <p className="help-text">Harga dalam Rupiah (contoh: 350000)</p>
        </div>
        
        <ImageUploader
          onChange={handleImageChange}
          value={formData.image}
          preview={previewImage}
          apiUrl={process.env.REACT_APP_API_URL}
          label="Gambar Paket"
          required={true}
        />
      </FormModal>
      
      {/* Edit Package Modal */}
      <FormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        title="Edit Paket"
        submitText="Simpan"
        isLoading={formLoading}
      >
        <div className="form-group">
          <label htmlFor="name">
            Nama <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="route">
            Rute
          </label>
          <input
            type="text"
            id="route"
            name="route"
            value={formData.route}
            onChange={handleInputChange}
            placeholder="Contoh: Kaliurang - Merapi - Kaliadem"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Deskripsi</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Deskripsi paket..."
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="price">
            Harga <span className="required">*</span>
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            min="0"
            step="1000"
          />
          <p className="help-text">Harga dalam Rupiah (contoh: 350000)</p>
        </div>
        
        <ImageUploader
          onChange={handleImageChange}
          value={formData.image}
          preview={previewImage}
          apiUrl={process.env.REACT_APP_API_URL}
          label="Gambar Paket"
          helpText="Biarkan kosong jika tidak ingin mengubah gambar."
        />
      </FormModal>
      
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Paket"
        message={`Apakah Anda yakin ingin menghapus paket "${currentPackage?.name}"?`}
        confirmText="Hapus"
        isLoading={formLoading}
      />
      
      {/* View Package Modal */}
      {currentPackage && (
        <FormModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          onSubmit={() => setIsViewModalOpen(false)}
          title="Detail Paket"
          submitText="Tutup"
        >
          <div className="package-detail">
            <div className="detail-image">
              <img 
                src={getImageUrl(currentPackage.image_url)} 
                alt={currentPackage.name} 
              />
              {currentPackage.discount_percent > 0 && (
                <div className="discount-badge">
                  <Percent size={16} /> {currentPackage.discount_percent}% OFF
                </div>
              )}
            </div>
            
            <div className="detail-info">
              <div className="info-item">
                <h4>Nama</h4>
                <p>{currentPackage.name}</p>
              </div>
              
              {currentPackage.route && (
                <div className="info-item">
                  <h4>Rute</h4>
                  <p className="route">
                    <MapPin size={16} /> {currentPackage.route}
                  </p>
                </div>
              )}
              
              {currentPackage.description && (
                <div className="info-item">
                  <h4>Deskripsi</h4>
                  <p>{currentPackage.description}</p>
                </div>
              )}
              
              <div className="info-item">
                <h4>Harga</h4>
                {currentPackage.original_price ? (
                  <div className="promo-price">
                    <p className="original-price">
                      <span className="label">Harga Normal:</span> 
                      {formatCurrency(currentPackage.original_price)}
                    </p>
                    <p className="discounted-price">
                      <span className="label">Harga Promo:</span> 
                      {formatCurrency(currentPackage.price)} 
                      <span className="discount-tag">
                        <Percent size={14} /> {currentPackage.discount_percent}%
                      </span>
                    </p>
                  </div>
                ) : (
                  <p className="price">{formatCurrency(currentPackage.price)}</p>
                )}
              </div>
              
              {currentPackage.promotion_id && (
                <div className="info-item">
                  <h4>Promo</h4>
                  <p className="promotion">
                    <Tag size={16} /> Paket dalam promo aktif
                  </p>
                </div>
              )}
              
              <div className="info-item">
                <h4>Tanggal Dibuat</h4>
                <p>{new Date(currentPackage.createdAt).toLocaleDateString('id-ID')}</p>
              </div>
              
              <div className="info-item">
                <h4>Terakhir Diupdate</h4>
                <p>{new Date(currentPackage.updatedAt).toLocaleDateString('id-ID')}</p>
              </div>
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
};

export default PackagesList;