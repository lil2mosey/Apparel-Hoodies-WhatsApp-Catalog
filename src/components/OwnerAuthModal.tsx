import React, { useState } from 'react';
import { Lock, KeyRound, ShieldAlert, CheckCircle2, X, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { MusoBrandLogo } from './MusoBrandLogo';

export interface OwnerPinFormProps {
  onSuccess: () => void;
  correctPin: string;
  onReturnToStore?: () => void;
}

export const OwnerPinForm: React.FC<OwnerPinFormProps> = ({
  onSuccess,
  correctPin,
  onReturnToStore,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showHint, setShowHint] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === correctPin || pinInput === '1234') {
      setErrorMsg('');
      onSuccess();
    } else {
      setErrorMsg('Incorrect owner PIN. Please try again or use the default hint: 1234');
    }
  };

  const handleNumpadClick = (digit: string) => {
    if (pinInput.length < 8) {
      setPinInput(prev => prev + digit);
      setErrorMsg('');
    }
  };

  const handleBackspace = () => {
    setPinInput(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* PIN Input field */}
        <div className="relative">
          <input
            id="owner-pin-input"
            type={showPin ? 'text' : 'password'}
            value={pinInput}
            onChange={(e) => {
              setPinInput(e.target.value);
              setErrorMsg('');
            }}
            maxLength={8}
            placeholder="Enter PIN (e.g. 1234)"
            autoFocus
            className="w-full text-center tracking-widest text-lg font-mono font-bold px-4 py-3 rounded-2xl bg-[#F9F8F3] dark:bg-[#12161c] border-2 border-[#dfd7c9] dark:border-[#2d3748] focus:border-neutral-900 dark:focus:border-white text-neutral-900 dark:text-white outline-hidden transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPin(!showPin)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
            tabIndex={-1}
          >
            {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Quick Numpad for Mobile / Touch */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((btn) => (
            <button
              key={btn}
              type="button"
              onClick={() => {
                if (btn === 'C') setPinInput('');
                else if (btn === '⌫') handleBackspace();
                else handleNumpadClick(btn);
              }}
              className="py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white text-sm font-bold transition-colors font-mono"
            >
              {btn}
            </button>
          ))}
        </div>

        <button
          id="owner-login-submit-btn"
          type="submit"
          disabled={!pinInput}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-black shadow-md transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Unlock Owner Studio</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Quick 1234 autofill / hint */}
      <div className="pt-2 border-t border-[#e5dfd3] dark:border-[#2d3748] text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              setPinInput('1234');
              setErrorMsg('');
            }}
            className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 transition-colors"
          >
            ⚡ Quick Fill Default PIN (1234)
          </button>
        </div>

        {onReturnToStore && (
          <div>
            <button
              type="button"
              onClick={onReturnToStore}
              className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 underline font-medium"
            >
              Return to Customer Storefront
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface OwnerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  correctPin: string;
}

export const OwnerAuthModal: React.FC<OwnerAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  correctPin,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="owner-auth-modal"
        className="relative w-full max-w-md bg-white dark:bg-[#1a202c] rounded-3xl shadow-2xl border border-[#dfd7c9] dark:border-[#2d3748] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5dfd3] dark:border-[#2d3748] bg-[#F9F8F3] dark:bg-[#12161c]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center shadow-xs">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-neutral-900 dark:text-white font-heading">
                Muso Owner Portal Access
              </h2>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Owner management, photos & catalog editor (/admin)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-full"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="text-center space-y-1.5">
            <div className="inline-flex p-3 rounded-2xl bg-[#EAE5DB] dark:bg-[#262e3b] border border-[#d8d0c3] dark:border-[#374151] mb-1">
              <KeyRound className="w-6 h-6 text-neutral-800 dark:text-neutral-200" />
            </div>
            <h3 className="text-base font-black text-neutral-900 dark:text-white font-heading">
              Enter Owner Passcode
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto">
              Access the private owner dashboard to upload photos, customize prices, and generate mockups.
            </p>
          </div>

          <OwnerPinForm
            onSuccess={() => {
              onSuccess();
              onClose();
            }}
            correctPin={correctPin}
          />
        </div>
      </div>
    </div>
  );
};
