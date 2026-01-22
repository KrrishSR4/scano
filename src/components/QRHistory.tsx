import { History, X, Clock, Trash2 } from 'lucide-react';
import { QRHistoryItem, QR_TEMPLATES, TextStyle } from '@/types/qr-templates';
import { formatDistanceToNow } from 'date-fns';

interface QRHistoryProps {
  history: QRHistoryItem[];
  onSelect: (item: QRHistoryItem) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

const QRHistory = ({ history, onSelect, onRemove, onClear }: QRHistoryProps) => {
  if (history.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-foreground font-medium">
          <History size={18} className="text-primary" />
          <span>Recent QR Codes</span>
        </div>
        <div className="text-center py-8 text-muted-foreground text-sm">
          <Clock size={32} className="mx-auto mb-2 opacity-50" />
          <p>No history yet</p>
          <p className="text-xs mt-1">Generated QR codes will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-foreground font-medium">
          <History size={18} className="text-primary" />
          <span>Recent QR Codes</span>
        </div>
        <button
          onClick={onClear}
          className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
        >
          <Trash2 size={12} />
          Clear All
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {history.map((item) => {
          const template = QR_TEMPLATES.find((t) => t.id === item.templateId);
          return (
            <div
              key={item.id}
              className="group flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => onSelect(item)}
            >
              {/* Color preview */}
              <div
                className="w-8 h-8 rounded-md flex-shrink-0 border border-border"
                style={{
                  backgroundColor: template?.bgColor || '#fff',
                  boxShadow: `inset 0 0 0 8px ${template?.fgColor || '#000'}`,
                }}
              />
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-foreground">
                  {item.value}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                  {item.textStyle.text && ` • "${item.textStyle.text}"`}
                </p>
              </div>

              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(item.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QRHistory;
