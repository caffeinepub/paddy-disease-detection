import type { ReactNode } from 'react';
import { Leaf, Heart } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const appId = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'paddy-disease-detection'
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-forest text-forest-foreground shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber/20 border border-amber/40">
            <img
              src="/assets/generated/paddy-plant-icon.dim_256x256.png"
              alt="Paddy Plant"
              className="w-7 h-7 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-forest-foreground leading-none">
              PaddyScan
            </h1>
            <p className="text-xs text-forest-foreground/70 mt-0.5">
              AI-Powered Rice Disease Detection
            </p>
          </div>
          <div className="ml-auto">
            <span className="inline-flex items-center gap-1.5 text-xs bg-amber/20 text-amber-light border border-amber/30 px-3 py-1 rounded-full font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-light animate-pulse" />
              Detection Active
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-forest-dark text-forest-foreground/60 py-6 mt-12">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-amber" />
            <span>© {new Date().getFullYear()} PaddyScan — Helping farmers protect their crops</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-amber fill-amber" />
            <span>using</span>
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber hover:text-amber-light transition-colors font-medium"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
