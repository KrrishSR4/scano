import { useState, useRef } from 'react';
import { toPng, toSvg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { Download, Link2, Sparkles, QrCode } from 'lucide-react';
import { QRTemplate, TextStyle, ExportSettings, QRHistoryItem, QR_TEMPLATES } from '@/types/qr-templates';
import TemplateSelector from '@/components/TemplateSelector';
import TextCustomizer from '@/components/TextCustomizer';
import QRPreview from '@/components/QRPreview';
import ExportOptions from '@/components/ExportOptions';
import QRHistory from '@/components/QRHistory';
import { useQRHistory } from '@/hooks/useQRHistory';
import { toast } from 'sonner';

const Index = () => {
  const [url, setUrl] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<QRTemplate>(QR_TEMPLATES[0]);
  const [textStyle, setTextStyle] = useState<TextStyle>({
    text: '',
    fontFamily: 'DM Sans',
    color: '#1a1a1a',
    fontSize: 16,
  });
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    format: 'png',
    width: 512,
    height: 512,
  });
  const [isGenerated, setIsGenerated] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const { history, saveToHistory, removeFromHistory, clearHistory } = useQRHistory();

  const handleGenerate = () => {
    if (!url.trim()) {
      toast.error('Please enter a URL or text');
      return;
    }
    setIsGenerated(true);
    saveToHistory(url, selectedTemplate.id, textStyle);
    toast.success('QR Code generated successfully!');
  };

  const handleHistorySelect = (item: QRHistoryItem) => {
    setUrl(item.value);
    const template = QR_TEMPLATES.find((t) => t.id === item.templateId);
    if (template) {
      setSelectedTemplate(template);
    }
    setTextStyle(item.textStyle);
    setIsGenerated(true);
    toast.success('QR Code restored from history');
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;

    try {
      const scale = exportSettings.width / 220; // 220 is the base QR size
      const pixelRatio = Math.max(scale, 2);

      if (exportSettings.format === 'png') {
        const dataUrl = await toPng(previewRef.current, {
          quality: 1,
          pixelRatio,
          backgroundColor: selectedTemplate.bgColor,
          width: previewRef.current.offsetWidth,
          height: previewRef.current.offsetHeight,
        });

        // Create a canvas to resize
        const img = new Image();
        img.src = dataUrl;
        await new Promise((resolve) => (img.onload = resolve));

        const canvas = document.createElement('canvas');
        canvas.width = exportSettings.width;
        canvas.height = exportSettings.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = selectedTemplate.bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          const size = Math.min(exportSettings.width, exportSettings.height);
          const x = (exportSettings.width - size) / 2;
          const y = (exportSettings.height - size) / 2;
          ctx.drawImage(img, x, y, size, size);
        }

        const link = document.createElement('a');
        link.download = `qr-code-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png', 1);
        link.click();
        toast.success('PNG downloaded!');
      } else if (exportSettings.format === 'svg') {
        const dataUrl = await toSvg(previewRef.current, {
          backgroundColor: selectedTemplate.bgColor,
        });

        const link = document.createElement('a');
        link.download = `qr-code-${Date.now()}.svg`;
        link.href = dataUrl;
        link.click();
        toast.success('SVG downloaded!');
      } else if (exportSettings.format === 'pdf') {
        const dataUrl = await toPng(previewRef.current, {
          quality: 1,
          pixelRatio: 3,
          backgroundColor: selectedTemplate.bgColor,
        });

        const pdf = new jsPDF({
          orientation: exportSettings.width > exportSettings.height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [exportSettings.width, exportSettings.height],
        });

        const size = Math.min(exportSettings.width, exportSettings.height) * 0.8;
        const x = (exportSettings.width - size) / 2;
        const y = (exportSettings.height - size) / 2;

        pdf.setFillColor(selectedTemplate.bgColor);
        pdf.rect(0, 0, exportSettings.width, exportSettings.height, 'F');
        pdf.addImage(dataUrl, 'PNG', x, y, size, size);
        pdf.save(`qr-code-${Date.now()}.pdf`);
        toast.success('PDF downloaded!');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download QR code');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl gradient-primary">
              <QrCode className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">QR Generator</h1>
              <p className="text-xs text-muted-foreground">Create beautiful QR codes</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Controls */}
          <div className="space-y-6 animate-fade-in">
            {/* URL Input Card */}
            <div className="qr-card">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <Link2 size={18} className="text-primary" />
                  <span>Enter URL or Text</span>
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com or any text..."
                    className="input-modern pr-4"
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  className="btn-primary w-full"
                >
                  <Sparkles size={18} />
                  Generate QR Code
                </button>
              </div>
            </div>

            {/* Template Selection Card */}
            <div className="qr-card">
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onSelectTemplate={setSelectedTemplate}
              />
            </div>

            {/* Text Customizer Card */}
            <div className="qr-card">
              <TextCustomizer
                textStyle={textStyle}
                onTextChange={setTextStyle}
              />
            </div>

            {/* Export Options Card */}
            <div className="qr-card">
              <ExportOptions
                settings={exportSettings}
                onSettingsChange={setExportSettings}
              />
            </div>

            {/* History Card */}
            <div className="qr-card">
              <QRHistory
                history={history}
                onSelect={handleHistorySelect}
                onRemove={removeFromHistory}
                onClear={clearHistory}
              />
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:sticky lg:top-24 h-fit animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="qr-card">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">Preview</h3>
                  {isGenerated && (
                    <span className="px-2 py-1 text-xs rounded-full bg-accent text-accent-foreground">
                      Ready
                    </span>
                  )}
                </div>

                {/* QR Preview */}
                <div className="flex justify-center py-8 bg-muted/30 rounded-xl">
                  <QRPreview
                    value={url || 'https://lovable.dev'}
                    template={selectedTemplate}
                    textStyle={textStyle}
                    previewRef={previewRef}
                  />
                </div>

                {/* Export Info */}
                <div className="text-center text-xs text-muted-foreground">
                  Export: {exportSettings.width} × {exportSettings.height}px • {exportSettings.format.toUpperCase()}
                </div>

                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  disabled={!isGenerated}
                  className={`w-full ${isGenerated ? 'btn-primary' : 'btn-secondary opacity-50 cursor-not-allowed'}`}
                >
                  <Download size={18} />
                  Download {exportSettings.format.toUpperCase()}
                </button>

                {!isGenerated && (
                  <p className="text-xs text-center text-muted-foreground">
                    Enter a URL and click Generate to enable download
                  </p>
                )}
              </div>
            </div>

            {/* Tips Card */}
            <div className="mt-4 p-4 rounded-xl bg-accent/50 border border-accent">
              <h4 className="text-sm font-medium text-accent-foreground mb-2">Pro Tips</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Use shorter URLs for cleaner QR codes</li>
                <li>• High contrast templates scan better</li>
                <li>• Add text to make your QR more engaging</li>
                <li>• SVG format scales infinitely without quality loss</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="container max-w-6xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          Create stunning QR codes in seconds
        </div>
      </footer>
    </div>
  );
};

export default Index;
