// app/physna/[id]/page.tsx

import { getAccessToken } from '../../../lib/physna';
import { notFound } from 'next/navigation';

interface Props {
  params: { id: string };
}

export default async function ModelDetailPage({ params }: Props) {
  const id = params.id;
  const token = await getAccessToken();

const modelRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/physna/get-model?id=${id}`, {
  cache: 'no-store',
});

  if (!modelRes.ok) return notFound();
  const model = await modelRes.json();

const viewerRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/physna/get-viewer-file?id=${id}`, {
  cache: 'no-store',
});


  const viewerFile = viewerRes.ok ? (await viewerRes.json()).viewerFile : null;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">{model.fileName}</h1>

      {viewerFile ? (
        <iframe
          src={viewerFile}
          width="100%"
          height="600"
          allowFullScreen
          className="border rounded mb-6"
        />
      ) : (
        <p className="text-gray-500">⚠️ 3D Viewer is not available for this model.</p>
      )}

      <div className="text-sm text-gray-700">
        <p><strong>Created:</strong> {model.createdAt || '—'}</p>
        <p><strong>Type:</strong> {model.fileType || '—'}</p>
        <p><strong>Folder:</strong> {model.folderPath || '—'}</p>
      </div>
    </div>
  );
}
