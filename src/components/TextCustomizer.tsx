import { TextStyle, FONT_OPTIONS, TEXT_PRESETS } from '@/types/qr-templates';
import { Type, Palette } from 'lucide-react';

interface TextCustomizerProps {
  textStyle: TextStyle;
  onTextChange: (style: TextStyle) => void;
}

const TextCustomizer = ({ textStyle, onTextChange }: TextCustomizerProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Type size={16} />
        Add Text Below QR
      </h3>
      
      {/* Text input */}
      <input
        type="text"
        value={textStyle.text}
        onChange={(e) => onTextChange({ ...textStyle, text: e.target.value })}
        placeholder="Enter text (e.g., Scan Me)"
        className="input-modern text-sm"
        maxLength={50}
      />

      {/* Text presets */}
      <div className="flex flex-wrap gap-2">
        {TEXT_PRESETS.map((preset) => (
          <button
            key={preset}
            onClick={() => onTextChange({ ...textStyle, text: preset })}
            className={`px-3 py-1.5 text-xs rounded-full transition-all ${
              textStyle.text === preset
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-muted'
            }`}
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Font and color options */}
      <div className="grid grid-cols-2 gap-3">
        {/* Font selector */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Font</label>
          <select
            value={textStyle.fontFamily}
            onChange={(e) => onTextChange({ ...textStyle, fontFamily: e.target.value })}
            className="input-modern text-sm py-2"
          >
            {FONT_OPTIONS.map((font) => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>
        </div>

        {/* Color picker */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground flex items-center gap-1">
            <Palette size={12} />
            Color
          </label>
          <div className="relative">
            <input
              type="color"
              value={textStyle.color}
              onChange={(e) => onTextChange({ ...textStyle, color: e.target.value })}
              className="w-full h-10 rounded-xl cursor-pointer border border-border"
            />
          </div>
        </div>
      </div>

      {/* Font size slider */}
      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground">
          Size: {textStyle.fontSize}px
        </label>
        <input
          type="range"
          min="12"
          max="32"
          value={textStyle.fontSize}
          onChange={(e) => onTextChange({ ...textStyle, fontSize: Number(e.target.value) })}
          className="w-full accent-primary"
        />
      </div>
    </div>
  );
};

export default TextCustomizer;
