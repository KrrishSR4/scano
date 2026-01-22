import { FileImage, FileCode, FileText } from 'lucide-react';
import { ExportSettings, EXPORT_DIMENSIONS } from '@/types/qr-templates';

interface ExportOptionsProps {
  settings: ExportSettings;
  onSettingsChange: (settings: ExportSettings) => void;
}

const ExportOptions = ({ settings, onSettingsChange }: ExportOptionsProps) => {
  const formats = [
    { id: 'png' as const, label: 'PNG', icon: FileImage },
    { id: 'svg' as const, label: 'SVG', icon: FileCode },
    { id: 'pdf' as const, label: 'PDF', icon: FileText },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-foreground font-medium">
        <FileImage size={18} className="text-primary" />
        <span>Export Options</span>
      </div>

      {/* Format Selection */}
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Format</label>
        <div className="grid grid-cols-3 gap-2">
          {formats.map((format) => {
            const Icon = format.icon;
            const isSelected = settings.format === format.id;
            return (
              <button
                key={format.id}
                onClick={() => onSettingsChange({ ...settings, format: format.id })}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <Icon size={16} />
                <span className="text-sm font-medium">{format.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dimension Selection */}
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Dimensions</label>
        <div className="grid grid-cols-2 gap-2">
          {EXPORT_DIMENSIONS.map((dim) => {
            const isSelected = settings.width === dim.width && settings.height === dim.height;
            return (
              <button
                key={dim.label}
                onClick={() => onSettingsChange({ ...settings, width: dim.width, height: dim.height })}
                className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                {dim.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Dimensions */}
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Custom Size (px)</label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            min={64}
            max={4096}
            value={settings.width}
            onChange={(e) => {
              const value = Math.max(64, Math.min(4096, parseInt(e.target.value) || 512));
              onSettingsChange({ ...settings, width: value, height: value });
            }}
            className="input-modern text-center"
            placeholder="Width"
          />
          <span className="text-muted-foreground">×</span>
          <input
            type="number"
            min={64}
            max={4096}
            value={settings.height}
            onChange={(e) => {
              const value = Math.max(64, Math.min(4096, parseInt(e.target.value) || 512));
              onSettingsChange({ ...settings, height: value });
            }}
            className="input-modern text-center"
            placeholder="Height"
          />
        </div>
      </div>
    </div>
  );
};

export default ExportOptions;
