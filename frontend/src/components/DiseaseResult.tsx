import {
  CheckCircle2,
  Leaf,
  FlaskConical,
  RotateCcw,
  AlertTriangle,
  Zap,
  ShieldCheck,
  CloudSun,
  TrendingDown,
  Sprout,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Disease } from '../backend';

interface DiseaseResultProps {
  disease: Disease;
  imagePreviewUrl: string | null;
  onReset: () => void;
}

function getSeverityStyle(level: string): {
  badgeClass: string;
  dotClass: string;
  label: string;
} {
  const normalized = level.toLowerCase();
  if (normalized === 'critical') {
    return {
      badgeClass: 'bg-red-100 text-red-800 border-red-200',
      dotClass: 'bg-red-500',
      label: 'Critical',
    };
  }
  if (normalized === 'high') {
    return {
      badgeClass: 'bg-orange-100 text-orange-800 border-orange-200',
      dotClass: 'bg-orange-500',
      label: 'High',
    };
  }
  if (normalized === 'moderate') {
    return {
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
      dotClass: 'bg-amber-500',
      label: 'Moderate',
    };
  }
  return {
    badgeClass: 'bg-green-100 text-green-800 border-green-200',
    dotClass: 'bg-green-500',
    label: level || 'Low',
  };
}

export default function DiseaseResult({ disease, imagePreviewUrl, onReset }: DiseaseResultProps) {
  const severityStyle = getSeverityStyle(disease.severityLevel || '');

  // Parse treatment into steps
  const treatmentSteps = disease.treatment
    .split(/[.;]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Detection Success Banner */}
      <div className="flex items-center gap-3 bg-forest/10 border border-forest/20 rounded-xl px-4 py-3">
        <CheckCircle2 className="w-5 h-5 text-forest shrink-0" />
        <p className="text-sm font-medium text-forest-dark">
          Disease detected successfully from your crop image
        </p>
      </div>

      {/* Quick Actions Banner — urgent amber callout */}
      {disease.quickActions && disease.quickActions.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl px-4 py-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-amber-dark shrink-0" />
            <h3 className="text-sm font-bold text-amber-dark uppercase tracking-wider">
              Immediate Actions Required
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {disease.quickActions.map((action, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 bg-amber/20 border border-amber/40 text-amber-dark text-xs font-semibold px-3 py-1.5 rounded-full"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-dark shrink-0" />
                {action}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Main Result Card */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        {/* Disease Header */}
        <div className="bg-gradient-to-r from-forest to-forest-dark p-6 text-forest-foreground">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber" />
                <span className="text-xs font-medium text-amber uppercase tracking-wider">
                  Detected Disease
                </span>
              </div>
              <h2 className="text-2xl font-bold text-forest-foreground leading-tight">
                {disease.name}
              </h2>
            </div>
            {/* Severity Badge from backend data */}
            {disease.severityLevel && (
              <span
                className={`shrink-0 mt-1 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${severityStyle.badgeClass}`}
              >
                <span className={`w-2 h-2 rounded-full ${severityStyle.dotClass}`} />
                {severityStyle.label} Severity
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Image + Description Row */}
          <div className="flex gap-4">
            {imagePreviewUrl && (
              <div className="shrink-0">
                <img
                  src={imagePreviewUrl}
                  alt="Analyzed crop"
                  className="w-24 h-24 rounded-xl object-cover border border-border"
                />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-4 h-4 text-forest" />
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                  About this Disease
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {disease.description}
              </p>
            </div>
          </div>

          {/* Yield Impact */}
          {disease.yieldImpact && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <TrendingDown className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-0.5">
                  Yield Impact
                </p>
                <p className="text-sm text-red-800 leading-relaxed">{disease.yieldImpact}</p>
              </div>
            </div>
          )}

          <Separator />

          {/* Treatment Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FlaskConical className="w-4 h-4 text-amber-dark" />
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Treatment Recommendations
              </h3>
            </div>
            <ul className="space-y-3">
              {treatmentSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-amber/20 text-amber-dark text-xs font-bold flex items-center justify-center mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-sm text-foreground leading-relaxed">{step}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Fertilizer Recommendations */}
          {disease.fertilizers && disease.fertilizers.length > 0 && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sprout className="w-4 h-4 text-forest" />
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                    Fertilizer Recommendations
                  </h3>
                </div>
                <div className="grid gap-2">
                  {disease.fertilizers.map((fertilizer, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-forest/5 border border-forest/15 rounded-lg px-4 py-3"
                    >
                      <span className="shrink-0 w-7 h-7 rounded-full bg-forest/15 text-forest text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <p className="text-sm text-foreground font-medium">{fertilizer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Prevention Tips */}
          {disease.preventionTips && disease.preventionTips.length > 0 && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="w-4 h-4 text-forest-light" />
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                    Prevention Tips
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  {disease.preventionTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground leading-relaxed">{tip}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* Seasonal Advisory */}
          {disease.seasonalAdvice && (
            <>
              <Separator />
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <CloudSun className="w-4 h-4 text-amber-dark" />
                  <h3 className="text-sm font-semibold text-amber-dark uppercase tracking-wide">
                    Seasonal & Weather Advisory
                  </h3>
                </div>
                <p className="text-sm text-amber-dark/90 leading-relaxed">
                  {disease.seasonalAdvice}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Farmer Help Tips Footer Card */}
      <div className="bg-forest/5 border border-forest/20 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-forest-dark uppercase tracking-wide mb-3 flex items-center gap-2">
          <Leaf className="w-4 h-4" />
          General Farmer Guidance
        </h3>
        <div className="grid sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <span className="text-forest font-bold shrink-0">•</span>
            <span>Consult your local agricultural extension officer for field-specific advice.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-forest font-bold shrink-0">•</span>
            <span>Keep a crop diary to track disease occurrences and treatment outcomes.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-forest font-bold shrink-0">•</span>
            <span>Always follow label instructions when applying pesticides or fungicides.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-forest font-bold shrink-0">•</span>
            <span>Regularly scout fields (at least twice a week) during the growing season.</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <Button
          onClick={onReset}
          variant="outline"
          className="gap-2 border-forest/30 text-forest hover:bg-forest/10 hover:border-forest/50 rounded-xl px-8 font-semibold"
        >
          <RotateCcw className="w-4 h-4" />
          Scan Another Image
        </Button>
      </div>
    </div>
  );
}
