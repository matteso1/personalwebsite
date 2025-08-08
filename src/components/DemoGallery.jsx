import React, { useMemo, useState } from 'react';

// Auto-import any audio files placed in src/assets/demos
// Supported: mp3, wav, ogg, m4a, webm
const importedDemoMap = import.meta.glob('../assets/demos/*.{mp3,wav,ogg,m4a,webm}', {
  eager: true,
  as: 'url',
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

  const [localDemos, setLocalDemos] = useState([]);

  const handlePickLocal = (e) => {
    const files = Array.from(e.target.files || []);
    const accepted = files.filter((f) => /\.(mp3|wav|ogg|m4a|webm)$/i.test(f.name));
    const newItems = accepted.map((file) => ({
      id: URL.createObjectURL(file),
      name: file.name,
      url: URL.createObjectURL(file),
      source: 'local',
    }));
    setLocalDemos((prev) => [...prev, ...newItems]);
    e.target.value = '';
  };

  const demos = [...importedDemos, ...localDemos];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <label className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-medium cursor-pointer hover:-translate-y-0.5 transition-all">
          <input
            type="file"
            accept="audio/*"
            multiple
            className="hidden"
            onChange={handlePickLocal}
          />
          <span>Add local demos (preview only)</span>
        </label>
        <span className="text-xs opacity-70">
          Files placed in <code className="opacity-90">src/assets/demos</code> are auto-listed after build.
        </span>
      </div>

      {demos.length === 0 ? (
        <div className="rounded-2xl border border-white/10 p-6 bg-white/5">
          <p className="text-sm opacity-80">
            No demos yet. Drop files above for a local preview, or commit audio files to
            <span className="mx-1 font-semibold">src/assets/demos</span> and redeploy.
          </p>
        </div>
      ) : (
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
      )}
    </div>
  );
}


