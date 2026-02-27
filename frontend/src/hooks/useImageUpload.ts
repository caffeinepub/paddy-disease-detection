import { useState, useCallback, useRef } from 'react';

export interface ImageUploadState {
  file: File | null;
  previewUrl: string | null;
  base64: string | null;
  isDragging: boolean;
  error: string | null;
}

export function useImageUpload() {
  const [state, setState] = useState<ImageUploadState>({
    file: null,
    previewUrl: null,
    base64: null,
    isDragging: false,
    error: null,
  });

  const previewUrlRef = useRef<string | null>(null);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setState(prev => ({ ...prev, error: 'Please select a valid image file.' }));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setState(prev => ({ ...prev, error: 'Image must be smaller than 10MB.' }));
      return;
    }

    // Revoke previous URL
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const previewUrl = URL.createObjectURL(file);
    previewUrlRef.current = previewUrl;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Strip the data URL prefix to get pure base64
      const base64 = result.split(',')[1] || result;
      setState(prev => ({
        ...prev,
        file,
        previewUrl,
        base64,
        error: null,
      }));
    };
    reader.onerror = () => {
      setState(prev => ({ ...prev, error: 'Failed to read image file.' }));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    processFile(files[0]);
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, isDragging: true }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, isDragging: false }));
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, isDragging: false }));
    const files = e.dataTransfer.files;
    if (files.length > 0) processFile(files[0]);
  }, [processFile]);

  const reset = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setState({
      file: null,
      previewUrl: null,
      base64: null,
      isDragging: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    reset,
  };
}
