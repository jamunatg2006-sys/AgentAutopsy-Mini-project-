import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface JsonViewerProps {
  data: any;
  title?: string;
  maxHeight?: string;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({
  data,
  title,
  maxHeight = 'max-h-80',
}) => {
  const [copied, setCopied] = useState(false);

  const formattedJson = typeof data === 'string' 
    ? data 
    : JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    /* Dark JSON inspector panel using the design system palette */
    <div className="bg-[#0B1020] border border-[#25324E] rounded-xl overflow-hidden font-mono text-sm">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#171F35] border-b border-[#25324E] text-[#A7B0C5]">
        <span className="text-sm font-semibold tracking-wider uppercase text-[#F4F5FF]">
          {title || 'Payload Inspection'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-[#737F98] hover:text-[#42D9F5] transition-colors"
          title="Copy JSON"
        >
          {copied ? <Check className="w-4 h-4 text-[#4DDBA5]" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className={`p-4 overflow-auto ${maxHeight} text-[#A7B0C5] leading-relaxed select-text`}>
        <pre className="whitespace-pre-wrap break-words">{formattedJson || '{}'}</pre>
      </div>
    </div>
  );
};
