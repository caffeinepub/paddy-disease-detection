# Specification

## Summary
**Goal:** Extend PaddyScan's disease result view with richer agronomic data and farmer-focused UI components, including fertilizer recommendations, prevention tips, seasonal advisory, severity/impact summary, and quick action tips.

**Planned changes:**
- Add new fields to each of the five backend disease records (`fertilizers`, `preventionTips`, `seasonalAdvice`, `severityLevel`, `yieldImpact`, `quickActions`) and expose them via existing query functions
- Add a "Fertilizer Recommendations" section to the DiseaseResult component displaying fertilizer name and application guidance as styled cards
- Add a "Prevention Tips" section to DiseaseResult showing disease-specific tips as checklist-style items with a leaf or checkmark icon
- Add a "Seasonal Advisory" card to the disease result view showing seasonal farming advice for the detected disease
- Add a "Disease Severity & Impact" panel with a color-coded severity badge (green/amber/red) and a yield impact description
- Add a "Quick Actions" callout banner in the result view with 2–3 urgent action chips styled in amber/warning tones

**User-visible outcome:** After a disease is detected, farmers see a comprehensive result page with fertilizer guidance, prevention tips, seasonal advice, severity level, yield impact, and immediate action steps — all styled consistently with the existing agricultural theme.
