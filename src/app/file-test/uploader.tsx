'use client';

import { useState } from 'react';
import { uploadFile } from '@/actions/file';
//import { toast } from "sonner";

type UploaderProps = {
  path: string
}

export default function Uploader({path}:UploaderProps) {

  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      action={async (fd: FormData) => {
        setSubmitting(true);
        setStatus('Uploading…');
        try {
          
          fd.set("path", path);

          const result = await uploadFile(fd);
          setStatus(`Uploaded ${result.filename} (${result.bytes} bytes)`);
          // `this` is not the form here, so reset via element id or ref:
          (document.getElementById('upload-form') as HTMLFormElement)?.reset();
        } catch (err: any) {
          setStatus(`Error: ${err?.message ?? String(err)}`);
        } finally {
          setSubmitting(false);
        }
      }}
      id="upload-form"
    >
      <input name="file" type="file" required />
      <button type="submit" disabled={submitting}>
        {submitting ? 'Uploading…' : 'Upload'}
      </button>
      {status && <p>{status}</p>}
    </form>
  );
}
