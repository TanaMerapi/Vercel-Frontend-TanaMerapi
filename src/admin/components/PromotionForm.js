import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { Calendar } from 'lucide-react';

const PromotionForm = ({ initialData, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    terms: '',
    valid_from: '',
    valid_until: '',
    discount_percent: 10,
    package_ids: [],
    primary_package_id: ''
  });
  
  const [availablePackages, setAvailablePackages] = useState([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(false);
  
  // Update form with initial data if provided
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        terms: initialData.terms || '',
        valid_from: initialData.valid_from ? new Date(initialData.valid_from).toISOString().split('T')[0] : '',
        valid_until: initialData.valid_until ? new Date(initialData.valid_until).toISOString().split('T')[0] : '',
        discount_percent: initialData.discount_percent || 10,
        package_ids: initialData.packages ? initialData.packages.map(pkg => pkg.id) : [],
        primary_package_id: initialData.primary_package_id || (initialData.packages && initialData.packages.length > 0 ? initialData.packages[0].id : '')
      });
    }
  }, [initialData]);
  
  // Fetch available packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setIsLoadingPackages(true);
        const response = await api.get('/packages');
        setAvailablePackages(response.data);
        
        // If creating a new promotion and there are packages, set default values
        if (!initialData && response.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            package_ids: [response.data[0].id],
            primary_package_id: response.data[0].id
          }));
        }
      } catch (error) {
        console.error('Failed to fetch packages:', error);
      } finally {
        setIsLoadingPackages(false);
      }
    };
    
    fetchPackages();
  }, [initialData]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handlePackageChange = (e) => {
    const packageId = parseInt(e.target.value);
    const isChecked = e.target.checked;
    
    let newPackageIds = [...formData.package_ids];
    
    if (isChecked) {
      newPackageIds.push(packageId);
    } else {
      newPackageIds = newPackageIds.filter(id => id !== packageId);
      
      // If primary package is being removed, update primary_package_id
      if (formData.primary_package_id === packageId) {
        setFormData({
          ...formData,
          package_ids: newPackageIds,
          primary_package_id: newPackageIds.length > 0 ? newPackageIds[0] : ''
        });
        return;
      }
    }
    
    setFormData({
      ...formData,
      package_ids: newPackageIds
    });
  };
  
  const handlePrimaryPackageChange = (e) => {
    const packageId = parseInt(e.target.value);
    
    setFormData({
      ...formData,
      primary_package_id: packageId
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>
          Judul Promo<span className="required">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Deskripsi</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
        ></textarea>
      </div>
      
      <div className="form-group">
        <label>Syarat dan Ketentuan</label>
        <textarea
          name="terms"
          value={formData.terms}
          onChange={handleChange}
          rows="4"
        ></textarea>
        <p className="help-text">Tuliskan syarat dan ketentuan promo (opsional)</p>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>
            Periode Mulai<span className="required">*</span>
          </label>
          <div className="date-input">
            <Calendar size={18} />
            <input
              type="date"
              name="valid_from"
              value={formData.valid_from}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>
            Periode Selesai<span className="required">*</span>
          </label>
          <div className="date-input">
            <Calendar size={18} />
            <input
              type="date"
              name="valid_until"
              value={formData.valid_until}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>
      
      <div className="form-group">
        <label>
          Diskon (%)<span className="required">*</span>
        </label>
        <input
          type="number"
          name="discount_percent"
          value={formData.discount_percent}
          onChange={handleChange}
          min="1"
          max="100"
          required
        />
        <p className="help-text">Masukkan persentase diskon (1-100)</p>
      </div>
      
      <div className="form-group">
        <label>
          Pilih Paket<span className="required">*</span>
        </label>
        
        {isLoadingPackages ? (
          <p>Loading packages...</p>
        ) : availablePackages.length === 0 ? (
          <p>No packages available. Please add packages first.</p>
        ) : (
          <div className="package-selection">
            <div className="package-list">
              {availablePackages.map((pkg) => (
                <div key={pkg.id} className="package-item">
                  <input
                    type="checkbox"
                    id={`package-${pkg.id}`}
                    value={pkg.id}
                    checked={formData.package_ids.includes(pkg.id)}
                    onChange={handlePackageChange}
                  />
                  <label htmlFor={`package-${pkg.id}`}>{pkg.name}</label>
                </div>
              ))}
            </div>
          </div>
        )}
        <p className="help-text">Pilih satu atau lebih paket untuk promo ini</p>
      </div>
      
      {formData.package_ids.length > 0 && (
        <div className="form-group">
          <label>
            Paket Utama<span className="required">*</span>
          </label>
          <select
            name="primary_package_id"
            value={formData.primary_package_id}
            onChange={handlePrimaryPackageChange}
            required
          >
            <option value="">-- Pilih Paket Utama --</option>
            {availablePackages
              .filter(pkg => formData.package_ids.includes(pkg.id))
              .map(pkg => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name}
                </option>
              ))
            }
          </select>
          <p className="help-text">Paket utama akan digunakan untuk gambar dan detail pada halaman promo</p>
        </div>
      )}
      
      <div className="form-actions">
        <button
          type="submit"
          className="submit-button"
          disabled={isLoading || formData.package_ids.length === 0 || !formData.primary_package_id}
        >
          {isLoading ? 'Menyimpan...' : initialData ? 'Update Promo' : 'Tambah Promo'}
        </button>
      </div>
    </form>
  );
};

export default PromotionForm;