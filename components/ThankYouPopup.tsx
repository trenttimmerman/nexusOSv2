import React, { useEffect, useState } from 'react';
import type { EmailSettings } from '../lib/emailService';

interface ThankYouPopupProps {
  isOpen: boolean;
  onClose: () => void;
  settings: EmailSettings;
}

export default function ThankYouPopup({ isOpen, onClose, settings }: ThankYouPopupProps) {
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(null);
      return;
    }

    // Start auto-close countdown if enabled
    if (settings.thank_you_auto_close && settings.thank_you_auto_close_delay > 0) {
      setCountdown(settings.thank_you_auto_close_delay);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            onClose();
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen, settings.thank_you_auto_close, settings.thank_you_auto_close_delay, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleButtonClick = () => {
    if (settings.thank_you_button_link) {
      window.location.href = settings.thank_you_button_link;
    } else {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full max-w-md rounded-xl shadow-2xl animate-in zoom-in duration-300"
        style={{
          backgroundColor: settings.thank_you_bg_color || '#ffffff',
          color: settings.thank_you_text_color || '#1f2937',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
          style={{ color: settings.thank_you_text_color || '#1f2937' }}
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: settings.thank_you_button_bg_color || '#10b981',
                opacity: 0.1,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-8 h-8"
                style={{ color: settings.thank_you_button_bg_color || '#10b981' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h2
            className="text-2xl font-bold mb-3"
            style={{ color: settings.thank_you_text_color || '#1f2937' }}
          >
            {settings.thank_you_heading || 'Thank You!'}
          </h2>

          {/* Message */}
          <p
            className="text-base mb-6 opacity-80"
            style={{ color: settings.thank_you_text_color || '#1f2937' }}
          >
            {settings.thank_you_message || 'You\'ve successfully subscribed to our newsletter.'}
          </p>

          {/* Button */}
          <button
            onClick={handleButtonClick}
            className="px-6 py-3 rounded-lg font-medium transition-all hover:shadow-lg hover:scale-105"
            style={{
              backgroundColor: settings.thank_you_button_bg_color || '#10b981',
              color: settings.thank_you_button_text_color || '#ffffff',
            }}
          >
            {settings.thank_you_button_text || 'Continue'}
          </button>

          {/* Auto-close countdown */}
          {countdown !== null && countdown > 0 && (
            <p
              className="mt-4 text-sm opacity-60"
              style={{ color: settings.thank_you_text_color || '#1f2937' }}
            >
              Closing in {countdown}s
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
