import React, { useState, useEffect } from 'react';
import './MenuItemsList.scss';
import DataTable from '../components/DataTable';
import ActionMenu from '../components/ActionMenu';
import ConfirmationModal from '../components/ConfirmationModal';
import FormModal from '../components/FormModal';
import ImageUploader from '../components/ImageUploader';
import Loader from '../../shared/components/Loader';
import Message from '../../shared/components/Message';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/imageUrl';
import { Plus } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

const MenuItemsList = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentMenuItem, setCurrentMenuItem] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    image: null
  });
  const [formLoading, setFormLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
  // Fetch menu items
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/menu-items');
      setMenuItems(response.data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
      setError('Gagal memuat data menu. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMenuItems();
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
  
  // Handle add menu item
  const handleAddClick = () => {
    setFormData({
      name: '',
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
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('price', formData.price);
      formDataToSend.append('image', formData.image);
      
      await api.post('/menu-items', formDataToSend);
      
      setIsAddModalOpen(false);
      fetchMenuItems();
      setError(null);
    } catch (error) {
      console.error('Failed to add menu item:', error);
      setError('Gagal menambahkan menu. Silakan coba lagi.');
    } finally {
      setFormLoading(false);
    }
  };
  
  // Handle edit menu item
  const handleEditClick = (menuItem) => {
    setCurrentMenuItem(menuItem);
    setFormData({
      name: menuItem.name,
      description: menuItem.description || '',
      price: menuItem.price,
      image: null
    });
    setPreviewImage(menuItem.image_url);
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
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('price', formData.price);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      await api.put(`/menu-items/${currentMenuItem.id}`, formDataToSend);
      
      setIsEditModalOpen(false);
      fetchMenuItems();
      setError(null);
    } catch (error) {
      console.error('Failed to update menu item:', error);
      setError('Gagal mengupdate menu. Silakan coba lagi.');
    } finally {
      setFormLoading(false);
    }
  };
  
  // Handle delete menu item
  const handleDeleteClick = (menuItem) => {
    setCurrentMenuItem(menuItem);
    setIsDeleteModalOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    try {
      setFormLoading(true);
      
      await api.delete(`/menu-items/${currentMenuItem.id}`);
      
      setIsDeleteModalOpen(false);
      fetchMenuItems();
    } catch (error) {
      console.error('Failed to delete menu item:', error);
      setError('Gagal menghapus menu. Silakan coba lagi.');
    } finally {
      setFormLoading(false);
    }
  };
  
  // Handle view menu item
  const handleViewClick = (menuItem) => {
    setCurrentMenuItem(menuItem);
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
        <div className="menu-image">
          <img 
            src={getImageUrl(row.image_url)} 
            alt={row.name}
          />
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
      render: (row) => formatCurrency(row.price)
    },
    {
      key: 'description',
      label: 'Deskripsi',
      render: (row) => (
        <div className="description-cell">
          {row.description ? (
            row.description.length > 50 
              ? `${row.description.substring(0, 50)}...` 
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
  
  if (loading && menuItems.length === 0) {
    return <Loader />;
  }
  
  return (
    <div className="menu-items-list-page">
      <div className="page-actions">
        <button className="add-button" onClick={handleAddClick}>
          <Plus size={18} />
          <span>Tambah Menu</span>
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
        data={menuItems}
        searchKey="name"
        actionColumn={renderActions}
        isLoading={loading}
        emptyMessage="Tidak ada menu tersedia."
      />
      
      {/* Add Menu Item Modal */}
      <FormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        title="Tambah Menu"
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
          <label htmlFor="description">Deskripsi</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
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
          <p className="help-text">Harga dalam Rupiah (contoh: 25000)</p>
        </div>
        
        <ImageUploader
          onChange={handleImageChange}
          value={formData.image}
          preview={previewImage}
          apiUrl={process.env.REACT_APP_API_URL}
          label="Gambar Menu"
          required={true}
        />
      </FormModal>
      
      {/* Edit Menu Item Modal */}
      <FormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        title="Edit Menu"
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
          <label htmlFor="description">Deskripsi</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
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
          <p className="help-text">Harga dalam Rupiah (contoh: 25000)</p>
        </div>
        
        <ImageUploader
          onChange={handleImageChange}
          value={formData.image}
          preview={previewImage}
          apiUrl={process.env.REACT_APP_API_URL}
          label="Gambar Menu"
          helpText="Biarkan kosong jika tidak ingin mengubah gambar."
        />
      </FormModal>
      
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Menu"
        message={`Apakah Anda yakin ingin menghapus menu "${currentMenuItem?.name}"?`}
        confirmText="Hapus"
        isLoading={formLoading}
      />
      
      {/* View Menu Item Modal */}
      {currentMenuItem && (
        <FormModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          onSubmit={() => setIsViewModalOpen(false)}
          title="Detail Menu"
          submitText="Tutup"
        >
          <div className="menu-detail">
            <div className="detail-image">
              <img 
                src={getImageUrl(currentMenuItem.image_url)} 
                alt={currentMenuItem.name} 
              />
            </div>
            
            <div className="detail-info">
              <div className="info-item">
                <h4>Nama</h4>
                <p>{currentMenuItem.name}</p>
              </div>
              
              <div className="info-item">
                <h4>Deskripsi</h4>
                <p>{currentMenuItem.description || 'Tidak ada deskripsi'}</p>
              </div>
              
              <div className="info-item">
                <h4>Harga</h4>
                <p className="price">{formatCurrency(currentMenuItem.price)}</p>
              </div>
              
              <div className="info-item">
                <h4>Tanggal Dibuat</h4>
                <p>{new Date(currentMenuItem.createdAt).toLocaleDateString('id-ID')}</p>
              </div>
              
              <div className="info-item">
                <h4>Terakhir Diupdate</h4>
                <p>{new Date(currentMenuItem.updatedAt).toLocaleDateString('id-ID')}</p>
              </div>
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
};

export default MenuItemsList;