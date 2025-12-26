import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Download, Link2, Sparkles, QrCode } from 'lucide-react';
import { QRTemplate, TextStyle, QR_TEMPLATES } from '@/types/qr-templates';
import TemplateSelector from '@/components/TemplateSelector';
import TextCustomizer from '@/components/TextCustomizer';
import QRPreview from '@/components/QRPreview';
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
  const [isGenerated, setIsGenerated] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    if (!url.trim()) {
      toast.error('Please enter a URL or text');
      return;
    }
    setIsGenerated(true);
    toast.success('QR Code generated successfully!');
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;

    try {
      const dataUrl = await toPng(previewRef.current, {
        quality: 1,
        pixelRatio: 3,
        backgroundColor: selectedTemplate.bgColor,
      });

      const link = document.createElement('a');
      link.download = `qr-code-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('QR Code downloaded!');
    } catch (error) {
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

                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  disabled={!isGenerated}
                  className={`w-full ${isGenerated ? 'btn-primary' : 'btn-secondary opacity-50 cursor-not-allowed'}`}
                >
                  <Download size={18} />
                  Download PNG
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
