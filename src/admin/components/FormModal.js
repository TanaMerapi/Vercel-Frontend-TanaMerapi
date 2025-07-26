import React from 'react';
import './FormModal.scss';
import Modal from '../../shared/components/Modal';

const FormModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  submitText = 'Simpan',
  cancelText = 'Batal',
  isLoading = false
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <button 
            className="cancel-button" 
            onClick={onClose}
            disabled={isLoading}
            type="button"
          >
            {cancelText}
          </button>
          <button 
            className="submit-button" 
            type="submit"
            form="form-modal"
            disabled={isLoading}
          >
            {isLoading ? 'Menyimpan...' : submitText}
          </button>
        </>
      }
    >
      <form id="form-modal" onSubmit={handleSubmit} className="form-modal">
        {children}
      </form>
    </Modal>
  );
};

export default FormModal;