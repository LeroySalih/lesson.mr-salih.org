'use client';

import { downloadAllAsZip } from '@/actions/file';

function b64ToBlob(base64: string, contentType: string) {
  const byteChars = atob(base64);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) byteNumbers[i] = byteChars.charCodeAt(i);
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
}

export function DownloadAllButton() {
  async function handleClick() {
    const res = await downloadAllAsZip('uploads.zip');
    const blob = b64ToBlob(res.base64, res.contentType);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = res.filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return <button onClick={handleClick}>Download all as ZIP</button>;
}
