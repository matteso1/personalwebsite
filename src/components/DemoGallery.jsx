import React, { useMemo } from 'react';

// Auto-import any audio files placed in src/assets/demos
// Supported: mp3, wav, ogg, m4a, webm
const importedDemoMap = import.meta.glob('../assets/demos/*.{mp3,wav,ogg,m4a,webm}', {
  eager: true,
  query: '?url',
  import: 'default',
});

function getFileNameFromUrl(url) {
  try {
    const parts = url.split('/');
    return decodeURIComponent(parts[parts.length - 1]);
  } catch {
    return url;
  }
}

export default function DemoGallery() {
  const importedDemos = useMemo(() => {
    return Object.values(importedDemoMap).map((url) => ({
      id: url,
      name: getFileNameFromUrl(url),
      url,
      source: 'repo',
    }));
  }, []);

  const demos = importedDemos;

  if (demos.length === 0) {
    return null;
  }

  return (
    <div>
      {/* Intentionally no explanatory copy here to keep it minimal */}

      <div className="grid sm:grid-cols-2 gap-4">
        {demos.map((d) => (
          <div key={d.id} className="rounded-xl border border-white/10 p-4 bg-white/5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium truncate pr-3">{d.name}</p>
              <span className="text-[10px] uppercase opacity-60">{d.source}</span>
            </div>
            <audio controls className="w-full">
              <source src={d.url} />
            </audio>
          </div>
        ))}
      </div>
    </div>
  );
}


