import { QRTemplate, QR_TEMPLATES } from '@/types/qr-templates';

interface TemplateSelectorProps {
  selectedTemplate: QRTemplate;
  onSelectTemplate: (template: QRTemplate) => void;
}

const TemplateSelector = ({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">Choose Template</h3>
      <div className="grid grid-cols-3 gap-3">
        {QR_TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className={`template-btn ${selectedTemplate.id === template.id ? 'active' : ''}`}
          >
            <div
              className="aspect-square rounded-lg flex items-center justify-center relative overflow-hidden"
              style={{ backgroundColor: template.bgColor }}
            >
              {/* Mini QR preview representation */}
              <div className="grid grid-cols-4 gap-0.5 p-2">
                {Array.from({ length: 16 }).map((_, i) => {
                  const showDot = [0, 1, 2, 4, 6, 8, 9, 10, 12, 13, 15].includes(i);
                  return (
                    <div
                      key={i}
                      className={`w-2 h-2 transition-all ${
                        template.style === 'dots' ? 'rounded-full' : 'rounded-sm'
                      }`}
                      style={{
                        backgroundColor: showDot 
                          ? template.gradient 
                            ? template.gradient.colors[0] 
                            : template.fgColor 
                          : 'transparent',
                      }}
                    />
                  );
                })}
              </div>
            </div>
            <p className="text-xs text-center mt-1.5 font-medium text-foreground/80 truncate">
              {template.name}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
