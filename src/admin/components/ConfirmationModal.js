import React from 'react';
import './ConfirmationModal.scss';
import Modal from '../../shared/components/Modal';
import { AlertTriangle } from 'lucide-react';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi',
  message = 'Apakah Anda yakin ingin melanjutkan?',
  confirmText = 'Ya',
  cancelText = 'Batal',
  isLoading = false
}) => {
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
          >
            {cancelText}
          </button>
          <button 
            className="confirm-button" 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Mohon tunggu...' : confirmText}
          </button>
        </>
      }
    >
      <div className="confirmation-content">
        <div className="icon-container">
          <AlertTriangle size={40} />
        </div>
        <p className="confirmation-message">{message}</p>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;