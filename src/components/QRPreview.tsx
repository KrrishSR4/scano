import { useRef, useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { QRTemplate, TextStyle } from '@/types/qr-templates';

interface QRPreviewProps {
  value: string;
  template: QRTemplate;
  textStyle: TextStyle;
  previewRef: React.RefObject<HTMLDivElement>;
}

const QRPreview = ({ value, template, textStyle, previewRef }: QRPreviewProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValueRef = useRef(value);
  const prevTemplateRef = useRef(template.id);

  useEffect(() => {
    if (prevValueRef.current !== value || prevTemplateRef.current !== template.id) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      prevValueRef.current = value;
      prevTemplateRef.current = template.id;
      return () => clearTimeout(timer);
    }
  }, [value, template.id]);

  const qrSize = 220;

  // For gradient, we need to create an SVG gradient overlay
  const gradientId = `qr-gradient-${template.id}`;

  return (
    <div className="flex flex-col items-center">
      <div
        ref={previewRef}
        className={`relative p-6 rounded-2xl transition-all duration-300 ${
          isAnimating ? 'animate-scale-in' : ''
        }`}
        style={{ backgroundColor: template.bgColor }}
      >
        {/* Gradient overlay for templates with gradients */}
        {template.gradient && (
          <svg width="0" height="0" className="absolute">
            <defs>
              <linearGradient
                id={gradientId}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
                gradientTransform={`rotate(${template.gradient.rotation || 0})`}
              >
                <stop offset="0%" stopColor={template.gradient.colors[0]} />
                <stop offset="100%" stopColor={template.gradient.colors[1]} />
              </linearGradient>
            </defs>
          </svg>
        )}

        <div className="relative">
          <QRCodeCanvas
            value={value || 'https://lovable.dev'}
            size={qrSize}
            fgColor={template.gradient ? template.gradient.colors[0] : template.fgColor}
            bgColor={template.bgColor}
            level="H"
            marginSize={2}
            style={{
              borderRadius: template.cornerRadius || 0,
            }}
          />
          
          {/* Gradient mask overlay */}
          {template.gradient && (
            <div
              className="absolute inset-0 pointer-events-none mix-blend-multiply"
              style={{
                background: `linear-gradient(${template.gradient.rotation || 135}deg, ${template.gradient.colors[0]}, ${template.gradient.colors[1]})`,
                borderRadius: template.cornerRadius || 0,
              }}
            />
          )}
        </div>

        {/* Text below QR */}
        {textStyle.text && (
          <p
            className="text-center mt-4 font-medium"
            style={{
              fontFamily: textStyle.fontFamily,
              color: textStyle.color,
              fontSize: `${textStyle.fontSize}px`,
            }}
          >
            {textStyle.text}
          </p>
        )}
      </div>

      {/* Decorative elements */}
      <div className="mt-4 flex items-center gap-2 text-muted-foreground text-sm">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
        <span>Live Preview</span>
      </div>
    </div>
  );
};

export default QRPreview;
