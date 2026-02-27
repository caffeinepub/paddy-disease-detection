import { useRef } from 'react';
import { Upload, ImageIcon, X, Microscope, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ImageUploadState } from '../hooks/useImageUpload';

interface ImageUploaderProps {
  uploadState: ImageUploadState;
  onFileChange: (files: FileList | null) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onReset: () => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  isInvalidImage?: boolean;
}

export default function ImageUploader({
  uploadState,
  onFileChange,
  onDragOver,
  onDragLeave,
  onDrop,
  onReset,
  onAnalyze,
  isAnalyzing,
  isInvalidImage = false,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { previewUrl, file, isDragging, error } = uploadState;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!previewUrl ? (
        /* Drop Zone */
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200
            flex flex-col items-center justify-center gap-5 p-12
            ${isDragging
              ? 'border-amber bg-amber/10 scale-[1.01]'
              : 'border-forest/30 bg-surface hover:border-amber/60 hover:bg-amber/5'
            }
          `}
        >
          <div className={`
            w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200
            ${isDragging ? 'bg-amber/20' : 'bg-forest/10'}
          `}>
            <Upload className={`w-9 h-9 transition-colors ${isDragging ? 'text-amber' : 'text-forest'}`} />
          </div>

          <div className="text-center">
            <p className="text-lg font-semibold text-foreground mb-1">
              {isDragging ? 'Drop your image here' : 'Upload a paddy crop image'}
            </p>
            <p className="text-sm text-muted-foreground">
              Drag & drop or <span className="text-forest font-medium underline underline-offset-2">click to browse</span>
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Supports JPG, PNG, WEBP · Max 10MB
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onFileChange(e.target.files)}
          />
        </div>
      ) : (
        /* Image Preview */
        <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-sm">
          <div className="relative">
            <img
              src={previewUrl}
              alt="Selected crop"
              className="w-full max-h-80 object-cover"
            />
            <button
              onClick={onReset}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full">
              <ImageIcon className="w-3.5 h-3.5" />
              <span className="truncate max-w-[200px]">{file?.name}</span>
            </div>
          </div>

          <div className="p-4 flex items-center justify-between gap-4 bg-card">
            <div>
              <p className="text-sm font-medium text-foreground">Image ready for analysis</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {file ? `${(file.size / 1024).toFixed(0)} KB · ${file.type.split('/')[1].toUpperCase()}` : ''}
              </p>
            </div>
            <Button
              onClick={onAnalyze}
              disabled={isAnalyzing}
              className="bg-forest hover:bg-forest-dark text-forest-foreground font-semibold px-6 rounded-xl gap-2 shrink-0"
            >
              {isAnalyzing ? (
                <>
                  <span className="w-4 h-4 border-2 border-forest-foreground/30 border-t-forest-foreground rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Microscope className="w-4 h-4" />
                  Detect Disease
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Invalid image warning */}
      {isInvalidImage && (
        <div className="mt-4 flex items-center gap-3 bg-amber/10 border border-amber/40 rounded-xl px-4 py-3">
          <AlertTriangle className="w-5 h-5 text-amber-dark shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-dark">Upload a valid paddy disease image</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Please upload a clear photo of a paddy rice leaf for accurate disease detection.
            </p>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-3 text-sm text-destructive text-center">{error}</p>
      )}
    </div>
  );
}
