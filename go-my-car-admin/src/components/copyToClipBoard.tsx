import { useState } from 'react';
import Toast from './toast/commonToast';

const CopyToClipboard = ({ text, textStyle = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // Reset after 1.5s
    Toast('info', 'Copied to clipboard', '', 1000);
  };

  return (
    <span
      className={`${textStyle} cursor-pointer ${
        copied ? 'cursor-default' : 'hover:underline'
      }`}
      onClick={handleCopy}
    >
      {text}
    </span>
  );
};

export default CopyToClipboard;
