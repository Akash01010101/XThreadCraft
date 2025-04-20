"use client";

import { useState, useEffect } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { createPortal } from 'react-dom';
import PricingPage from '../app/Pricing/page';

interface TurnstileWrapperProps {
  children: React.ReactNode;
}

export function TurnstileWrapper({ children }: TurnstileWrapperProps) {
  const [verified, setVerified] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [verificationCount, setVerificationCount] = useState(0);
  const [showPricing, setShowPricing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchVerificationCount = async () => {
      try {
        const response = await fetch('/api/chat-usage/verification-count');
        const data = await response.json();
        setVerificationCount(data.count || 0);
        setIsPaid(data.isPaid || false);
      } catch (error) {
        console.error('Error fetching verification count:', error);
      }
    };
    fetchVerificationCount();
  }, []);

  const handleSuccess = async (token: string) => {
    try {
      const response = await fetch('/api/verify-turnstile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      if (response.status === 403 || verificationCount > 2 && !isPaid ) {
        setShowPricing(true);
      } else if (data.success) {
        setVerified(true);
        setVerificationCount(prev => prev + 1);
      } else {
        setShowError(true);
        setErrorMessage(data.error + (data.details ? `: ${data.details}` : '') || 'Verification failed');
      }
    } catch (error) {

      setShowError(true);
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative">
      {!verified && (
        <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center z-10 border border-gray-200 dark:border-gray-700">
          <div className="p-8 max-w-md w-full mx-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Please Verify to Access Chat</h2>
            <div className="flex justify-center">
              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAABAEkEFDDIn7oklG'}
                onSuccess={handleSuccess}
                onError={() => {
                  setShowError(true);
                  setErrorMessage('Error loading captcha');
                }}
              />
            </div>
            {showError && (
              <div className="mt-4 text-red-500">
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      )}
      {showPricing && mounted && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl w-full mx-4 overflow-y-auto max-h-[90vh] border border-gray-200 dark:border-gray-700">
            <PricingPage />
            <button
              onClick={() => setShowPricing(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>,
        document.body
      )}
      {children}
    </div>
  );
}