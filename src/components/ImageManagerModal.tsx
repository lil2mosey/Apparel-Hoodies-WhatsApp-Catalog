import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Folder, Check, UploadCloud, Sparkles, Copy, Trash2, ArrowUpCircle } from 'lucide-react';
import { ALL_IMAGE_ASSETS, getCustomPhotoOverrides, saveCustomPhotoOverride, ImageAssetMeta } from '../assets/images';
import { COMMON_COLORS } from '../data/products';
import { ProductVisual } from './ProductVisual';
import { ColorOption } from '../types';

interface ImageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImageManagerModal: React.FC<ImageManagerModalProps> = ({ isOpen, onClose }) => {
  const [selectedAsset, setSelectedAsset] = useState<ImageAssetMeta>(ALL_IMAGE_ASSETS[0]);
  const [previewColor, setPreviewColor] = useState<ColorOption>(COMMON_COLORS.maroon || Object.values(COMMON_COLORS)[0]);
  const [previewText, setPreviewText] = useState<string>('MUSO');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<Record<string, string>>(() => getCustomPhotoOverrides());
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleSelectAsset = (asset: ImageAssetMeta) => {
    setSelectedAsset(asset);
    setUploadStatus(null);
  };

  // Helper to compress and convert file to data URL
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP, or SVG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (!result) return;

      // If image is larger than 1.5MB, resize via canvas to save memory
      const img = new Image();
      img.onload = () => {
        const maxWidth = 1200;
        const maxHeight = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.85);
            saveCustomPhotoOverride(selectedAsset.key, compressed);
            setOverrides(getCustomPhotoOverrides());
            setUploadStatus(`Uploaded and replaced ${selectedAsset.fileName} successfully!`);
            return;
          }
        }

        saveCustomPhotoOverride(selectedAsset.key, result);
        setOverrides(getCustomPhotoOverrides());
        setUploadStatus(`Uploaded and replaced ${selectedAsset.fileName} successfully!`);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    // reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleClearPhoto = () => {
    saveCustomPhotoOverride(selectedAsset.key, '');
    setOverrides(getCustomPhotoOverrides());
    setUploadStatus(`Reset ${selectedAsset.fileName} to default garment visual.`);
  };

  const handleCopyPath = (filePath: string) => {
    navigator.clipboard.writeText(filePath);
    setCopiedFile(filePath);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const hasUploadedPhoto = !!overrides[selectedAsset.key];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="image-manager-modal"
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-900 text-white">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-600 text-white shadow-sm">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Image Assets Manager</h2>
                <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  /src/assets/images/
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Upload real apparel photos or preview vector mockups for your catalog
              </p>
            </div>
          </div>
          <button
            id="close-image-manager-btn"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 overflow-hidden flex-1">
          {/* Left Column: List of all images in the single folder */}
          <div className="md:col-span-5 border-r border-neutral-200 overflow-y-auto p-4 space-y-2 bg-neutral-50/50">
            <div className="flex items-center justify-between px-1 pb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                Apparel Items ({ALL_IMAGE_ASSETS.length})
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">/src/assets/images/*</span>
            </div>

            <div className="space-y-1.5">
              {ALL_IMAGE_ASSETS.map((asset) => {
                const isSelected = selectedAsset.key === asset.key;
                const isCustomUploaded = !!overrides[asset.key];

                return (
                  <button
                    key={asset.id}
                    id={`asset-btn-${asset.key}`}
                    type="button"
                    onClick={() => handleSelectAsset(asset)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-white border-emerald-600 shadow-sm ring-2 ring-emerald-600/10'
                        : 'bg-white/70 border-neutral-200 hover:border-neutral-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-500'
                        }`}
                      >
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-neutral-900 truncate">{asset.name}</p>
                        <p className="text-[10px] font-mono text-neutral-500 truncate">{asset.fileName}</p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5">
                      {isCustomUploaded && (
                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-sm">
                          Custom Photo
                        </span>
                      )}
                      <span className="text-[10px] font-medium text-neutral-400 uppercase">{asset.category}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Asset Preview & Direct File Upload */}
          <div className="md:col-span-7 p-6 overflow-y-auto space-y-6">
            {/* Asset Header Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {selectedAsset.category}
                </span>
                <h3 className="text-base font-extrabold text-neutral-900 mt-1">{selectedAsset.name}</h3>
                <p className="text-xs text-neutral-500">{selectedAsset.description}</p>
              </div>

              <button
                type="button"
                onClick={() => handleCopyPath(`/src/assets/images/${selectedAsset.fileName}`)}
                className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1.5 rounded-lg transition-colors shrink-0"
                title="Copy relative file path"
              >
                {copiedFile === `/src/assets/images/${selectedAsset.fileName}` ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Path Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-neutral-500" />
                    <span>{selectedAsset.fileName}</span>
                  </>
                )}
              </button>
            </div>

            {/* Live Visual Renderer Preview */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80 flex flex-col items-center space-y-4">
              <div className="w-full max-w-xs aspect-square flex items-center justify-center">
                <ProductVisual
                  category={selectedAsset.category}
                  imageType={selectedAsset.key}
                  color={previewColor}
                  customText={previewText}
                  size="xl"
                />
              </div>

              {/* Live Color Switcher Preview (when using vector mockup) */}
              {!hasUploadedPhoto && (
                <div className="w-full space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                      Test Color Swatch: <span className="text-neutral-900">{previewColor.name}</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.values(COMMON_COLORS).slice(0, 10).map((col) => (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() => setPreviewColor(col)}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${
                          previewColor.name === col.name ? 'border-emerald-600 scale-110 shadow-xs' : 'border-white'
                        }`}
                        style={{ backgroundColor: col.hex }}
                        title={col.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Live Text Customization Preview */}
              {!hasUploadedPhoto && (
                <div className="w-full space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    Test Live Name Print:
                  </span>
                  <input
                    type="text"
                    value={previewText}
                    onChange={(e) => setPreviewText(e.target.value)}
                    placeholder="e.g. MUSO"
                    className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-bold text-neutral-900 uppercase bg-white outline-hidden focus:border-emerald-600"
                  />
                </div>
              )}
            </div>

            {/* Direct Upload Photo Section */}
            <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-neutral-900 flex items-center gap-1.5">
                    <UploadCloud className="w-4 h-4 text-emerald-600" />
                    Upload Apparel Photo
                  </h4>
                  <p className="text-[11px] text-neutral-600 mt-0.5">
                    Replace mockup for <strong>{selectedAsset.name}</strong> with a real photo from your device
                  </p>
                </div>
                {hasUploadedPhoto && (
                  <button
                    type="button"
                    onClick={handleClearPhoto}
                    className="text-[11px] text-red-600 hover:text-red-700 font-bold flex items-center gap-1 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg border border-red-200 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Reset to Mockup
                  </button>
                )}
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                className="hidden"
                id="file-upload-input"
              />

              {/* Drag and Drop Zone with Upload Button */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all flex flex-col items-center justify-center gap-2 ${
                  isDragging
                    ? 'border-emerald-600 bg-emerald-100/70 scale-[0.99]'
                    : 'border-emerald-300 hover:border-emerald-600 bg-white/80 hover:bg-white'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                  <ArrowUpCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-900">
                    Click to browse or drag & drop photo here
                  </p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">
                    Supports PNG, JPG, WEBP, or SVG
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="mt-1 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  Upload Photo
                </button>
              </div>

              {/* Status Message */}
              {uploadStatus && (
                <div className="p-2.5 rounded-lg bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{uploadStatus}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between text-xs text-neutral-500">
          <span>All assets managed in <code>/src/assets/images/</code></span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

