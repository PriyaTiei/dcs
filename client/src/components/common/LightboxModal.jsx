import React, { useEffect } from 'react';
import { TbX, TbChevronLeft, TbChevronRight } from 'react-icons/tb';

export const LightboxModal = ({
  isOpen,
  onClose,
  images = [],
  currentIndex = 0,
  onNext,
  onPrev,
  title,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose?.();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || images.length === 0) return null;

  const currentImg = images[currentIndex] || images[0];
  const src = typeof currentImg === 'string' ? currentImg : currentImg?.url || currentImg?.src;
  const caption = typeof currentImg === 'object' ? currentImg?.filename || currentImg?.caption : '';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
      onClick={onClose}
    >
      {/* Top Controls */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '24px',
          right: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#ffffff',
          zIndex: 10,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: '16px', fontWeight: '600' }}>
          {title || 'Visual Inspection Evidence'}
          {images.length > 1 && (
            <span style={{ fontSize: '13px', color: '#94a3b8', marginLeft: '10px' }}>
              ({currentIndex + 1} / {images.length})
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          <TbX size={20} />
        </button>
      </div>

      {/* Image Preview Container */}
      <div
        style={{
          position: 'relative',
          maxWidth: '90vw',
          maxHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {images.length > 1 && onPrev && (
          <button
            onClick={onPrev}
            style={{
              position: 'absolute',
              left: '-50px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <TbChevronLeft size={24} />
          </button>
        )}

        <img
          src={src}
          alt={caption || 'Inspection Preview'}
          style={{
            maxWidth: '100%',
            maxHeight: '75vh',
            objectFit: 'contain',
            borderRadius: '8px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          }}
        />

        {images.length > 1 && onNext && (
          <button
            onClick={onNext}
            style={{
              position: 'absolute',
              right: '-50px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <TbChevronRight size={24} />
          </button>
        )}
      </div>

      {caption && (
        <div
          style={{
            marginTop: '16px',
            color: '#e2e8f0',
            fontSize: '14px',
            fontWeight: '500',
            textAlign: 'center',
          }}
        >
          {caption}
        </div>
      )}
    </div>
  );
};

export default LightboxModal;
