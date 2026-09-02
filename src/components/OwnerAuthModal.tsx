import React, { useState } from 'react';
import { Lock, KeyRound, ShieldAlert, CheckCircle2, X, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import { MusoBrandLogo } from './MusoBrandLogo';

// =========================================================================
// 1. FIRST-TIME PASSLOCK SETUP FORM
// =========================================================================
export interface OwnerSetupPasslockFormProps {
  onSetPasslock: (newPin: string) => void;
  onReturnToStore?: () => void;
}

export const OwnerSetupPasslockForm: React.FC<OwnerSetupPasslockFormProps> = ({
  onSetPasslock,
  onReturnToStore,
}) => {
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPins, setShowPins] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeField, setActiveField] = useState<'new' | 'confirm'>('new');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length < 4) {
      setErrorMsg('Your passlock must be at least 4 digits or characters for security.');
      return;
    }
    if (newPin !== confirmPin) {
      setErrorMsg('The passlocks do not match. Please verify and re-type.');
      return;
    }
    setErrorMsg('');
    onSetPasslock(newPin);
  };

  const handleNumpadClick = (digit: string) => {
    if (activeField === 'new') {
      if (newPin.length < 8) {
        setNewPin(prev => prev + digit);
        setErrorMsg('');
      }
    } else {
      if (confirmPin.length < 8) {
        setConfirmPin(prev => prev + digit);
        setErrorMsg('');
      }
    }
  };

  const handleBackspace = () => {
    if (activeField === 'new') {
      setNewPin(prev => prev.slice(0, -1));
    } else {
      setConfirmPin(prev => prev.slice(0, -1));
    }
    setErrorMsg('');
  };

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-3.5 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed font-medium">
          <strong>First-Time Security Setup:</strong> Create your private master passlock. You will use this key whenever you access the Gryson Owner Studio.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* New PIN Input */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
            Create Master Passlock (Min 4 digits):
          </label>
          <div className="relative">
            <input
              id="owner-setup-new-pin"
              type={showPins ? 'text' : 'password'}
              value={newPin}
              onFocus={() => setActiveField('new')}
              onChange={(e) => {
                setNewPin(e.target.value);
                setErrorMsg('');
              }}
              maxLength={8}
              placeholder="Enter new passlock (e.g. 8492)"
              autoFocus
              className={`w-full tracking-widest text-base font-mono font-bold px-4 py-3 rounded-2xl bg-[#F9F8F3] dark:bg-[#12161c] border-2 ${
                activeField === 'new'
                  ? 'border-neutral-900 dark:border-white ring-2 ring-neutral-900/10'
                  : 'border-[#dfd7c9] dark:border-[#2d3748]'
              } text-neutral-900 dark:text-white outline-hidden transition-all`}
            />
            <button
              type="button"
              onClick={() => setShowPins(!showPins)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              tabIndex={-1}
            >
              {showPins ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm PIN Input */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
            Confirm Master Passlock:
          </label>
          <div className="relative">
            <input
              id="owner-setup-confirm-pin"
              type={showPins ? 'text' : 'password'}
              value={confirmPin}
              onFocus={() => setActiveField('confirm')}
              onChange={(e) => {
                setConfirmPin(e.target.value);
                setErrorMsg('');
              }}
              maxLength={8}
              placeholder="Re-enter same passlock"
              className={`w-full tracking-widest text-base font-mono font-bold px-4 py-3 rounded-2xl bg-[#F9F8F3] dark:bg-[#12161c] border-2 ${
                activeField === 'confirm'
                  ? 'border-neutral-900 dark:border-white ring-2 ring-neutral-900/10'
                  : 'border-[#dfd7c9] dark:border-[#2d3748]'
              } text-neutral-900 dark:text-white outline-hidden transition-all`}
            />
          </div>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Quick Numpad for Mobile / Touch Devices */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-neutral-500 dark:text-neutral-400">
            <span>Keypad ({activeField === 'new' ? 'Typing Passlock' : 'Confirming Passlock'})</span>
            <button
              type="button"
              onClick={() => setActiveField(activeField === 'new' ? 'confirm' : 'new')}
              className="text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              Switch to {activeField === 'new' ? 'Confirm' : 'New'} Field
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((btn) => (
              <button
                key={btn}
                type="button"
                onClick={() => {
                  if (btn === 'C') {
                    if (activeField === 'new') setNewPin('');
                    else setConfirmPin('');
                  } else if (btn === '⌫') {
                    handleBackspace();
                  } else {
                    handleNumpadClick(btn);
                  }
                }}
                className="py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white text-sm font-bold transition-colors font-mono"
              >
                {btn}
              </button>
            ))}
          </div>
        </div>

        <button
          id="owner-create-passlock-btn"
          type="submit"
          disabled={newPin.length < 4 || confirmPin.length < 4}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-black shadow-md transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>Save Passlock & Enter Owner Studio</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {onReturnToStore && (
        <div className="pt-2 border-t border-[#e5dfd3] dark:border-[#2d3748] text-center">
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
  );
};

// =========================================================================
// 2. UNLOCK PASSLOCK FORM (SUBSEQUENT SESSIONS)
// =========================================================================
export interface OwnerPinFormProps {
  onSuccess: () => void;
  correctPin: string;
  onReturnToStore?: () => void;
  onResetSetup?: () => void;
}

export const OwnerPinForm: React.FC<OwnerPinFormProps> = ({
  onSuccess,
  correctPin,
  onReturnToStore,
  onResetSetup,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === correctPin) {
      setErrorMsg('');
      onSuccess();
    } else {
      setErrorMsg('Incorrect owner passlock. Please check and try again.');
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
            placeholder="Enter Owner Passlock"
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

      {/* Footer Navigation */}
      <div className="pt-2 border-t border-[#e5dfd3] dark:border-[#2d3748] flex flex-col items-center justify-center gap-2 text-center">
        {onReturnToStore && (
          <button
            type="button"
            onClick={onReturnToStore}
            className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 underline font-medium"
          >
            Return to Customer Storefront
          </button>
        )}

        {onResetSetup && (
          <button
            type="button"
            onClick={onResetSetup}
            className="text-[11px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors flex items-center gap-1 mt-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset passlock setup on this device</span>
          </button>
        )}
      </div>
    </div>
  );
};

// =========================================================================
// 3. OWNER AUTH MODAL (POPUP WRAPPER)
// =========================================================================
interface OwnerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  correctPin: string;
  isPinCreated: boolean;
  onSetPasslock: (newPin: string) => void;
  onResetSetup?: () => void;
}

export const OwnerAuthModal: React.FC<OwnerAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  correctPin,
  isPinCreated,
  onSetPasslock,
  onResetSetup,
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
                Muso Owner Studio Access
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
              {isPinCreated ? 'Enter Owner Passcode' : 'Create Master Passlock'}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto">
              {isPinCreated
                ? 'Access the private owner dashboard to upload photos, customize prices, and generate mockups.'
                : 'Set up your secret passlock before entering Muso Studio for the first time.'}
            </p>
          </div>

          {isPinCreated ? (
            <OwnerPinForm
              onSuccess={() => {
                onSuccess();
                onClose();
              }}
              correctPin={correctPin}
              onResetSetup={onResetSetup}
            />
          ) : (
            <OwnerSetupPasslockForm
              onSetPasslock={(pin) => {
                onSetPasslock(pin);
                onSuccess();
                onClose();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
