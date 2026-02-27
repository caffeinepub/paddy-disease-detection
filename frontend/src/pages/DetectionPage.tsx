import { useState } from 'react';
import { Sprout, ShieldCheck, Zap } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import DiseaseResult from '../components/DiseaseResult';
import { useImageUpload } from '../hooks/useImageUpload';
import { useDetectDisease } from '../hooks/useQueries';
import type { Disease } from '../backend';

const FEATURES = [
  {
    icon: Zap,
    title: 'Instant Analysis',
    desc: 'Get results in seconds',
  },
  {
    icon: ShieldCheck,
    title: '5 Diseases Covered',
    desc: 'Blast, Blight & more',
  },
  {
    icon: Sprout,
    title: 'Treatment Guidance',
    desc: 'Actionable recommendations',
  },
];

export default function DetectionPage() {
  const [detectedDisease, setDetectedDisease] = useState<Disease | null>(null);
  const [isInvalidImage, setIsInvalidImage] = useState(false);
  const imageUpload = useImageUpload();
  const detectMutation = useDetectDisease();

  const handleAnalyze = async () => {
    if (!imageUpload.base64) return;
    setIsInvalidImage(false);
    try {
      const result = await detectMutation.mutateAsync(imageUpload.base64);
      if (result.kind === 'invalid') {
        setIsInvalidImage(true);
      } else {
        setDetectedDisease(result.disease);
      }
    } catch (err) {
      // Error handled by mutation state
    }
  };

  const handleReset = () => {
    setDetectedDisease(null);
    setIsInvalidImage(false);
    imageUpload.reset();
    detectMutation.reset();
  };

  // Clear invalid image warning when user selects a new file
  const handleFileChange = (files: FileList | null) => {
    setIsInvalidImage(false);
    detectMutation.reset();
    imageUpload.handleFileChange(files);
  };

  const handleDrop = (e: React.DragEvent) => {
    setIsInvalidImage(false);
    detectMutation.reset();
    imageUpload.handleDrop(e);
  };

  return (
    <div className="min-h-[calc(100vh-140px)]">
      {/* Hero Banner */}
      <div className="relative w-full h-48 sm:h-64 overflow-hidden">
        <img
          src="/assets/generated/paddy-hero-banner.dim_1200x400.png"
          alt="Paddy rice field"
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest/40 via-forest/20 to-background" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg mb-2">
            Paddy Disease Detection
          </h2>
          <p className="text-sm sm:text-base text-white/90 drop-shadow max-w-md">
            Upload a photo of your rice crop and get instant disease diagnosis with treatment advice
          </p>
        </div>
      </div>

      {/* Feature Pills */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-center gap-6 flex-wrap">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-2 text-sm">
              <div className="w-7 h-7 rounded-full bg-forest/10 flex items-center justify-center">
                <Icon className="w-3.5 h-3.5 text-forest" />
              </div>
              <div>
                <span className="font-semibold text-foreground">{title}</span>
                <span className="text-muted-foreground ml-1 hidden sm:inline">— {desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        {!detectedDisease ? (
          <div className="flex flex-col items-center gap-8">
            {/* Step Indicator */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className={`flex items-center gap-1.5 ${imageUpload.previewUrl ? 'text-forest font-medium' : 'text-muted-foreground'}`}>
                <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${imageUpload.previewUrl ? 'bg-forest text-forest-foreground' : 'bg-muted text-muted-foreground'}`}>1</span>
                Upload Image
              </span>
              <span className="w-8 h-px bg-border" />
              <span className={`flex items-center gap-1.5 ${detectMutation.isPending ? 'text-amber-dark font-medium' : 'text-muted-foreground'}`}>
                <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${detectMutation.isPending ? 'bg-amber text-white' : 'bg-muted text-muted-foreground'}`}>2</span>
                Analyze
              </span>
              <span className="w-8 h-px bg-border" />
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center bg-muted text-muted-foreground">3</span>
                View Results
              </span>
            </div>

            <ImageUploader
              uploadState={imageUpload}
              onFileChange={handleFileChange}
              onDragOver={imageUpload.handleDragOver}
              onDragLeave={imageUpload.handleDragLeave}
              onDrop={handleDrop}
              onReset={handleReset}
              onAnalyze={handleAnalyze}
              isAnalyzing={detectMutation.isPending}
              isInvalidImage={isInvalidImage}
            />

            {/* Error State */}
            {detectMutation.isError && (
              <div className="w-full max-w-2xl bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3 text-sm text-destructive text-center">
                {detectMutation.error?.message || 'Detection failed. Please try again.'}
              </div>
            )}

            {/* Info Cards */}
            <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
              {[
                { name: 'Bacterial Blight', emoji: '🦠' },
                { name: 'Rice Blast', emoji: '💨' },
                { name: 'Brown Spot', emoji: '🟤' },
                { name: 'Sheath Blight', emoji: '🌿' },
                { name: 'Tungro Virus', emoji: '🔴' },
              ].slice(0, 3).map((d) => (
                <div key={d.name} className="bg-surface border border-border rounded-xl p-3 flex items-center gap-3">
                  <span className="text-xl">{d.emoji}</span>
                  <span className="text-sm font-medium text-foreground">{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <DiseaseResult
            disease={detectedDisease}
            imagePreviewUrl={imageUpload.previewUrl}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}
