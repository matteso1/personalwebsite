export default function Home() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-extrabold mb-4">Nils Matteson</h1>
      <p className="mb-6">Music in progress. Featured on a new track. Stay tuned.</p>
      <div className="mb-8">
        <iframe
          src="https://open.spotify.com/embed/track/25FM9yX68IPzFi7FDea91n"
          width="100%"
          height="80"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
      </div>
      <a
        href="https://open.spotify.com/artist/2qpBZGqFiVcsYEaJkBahMo"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
      >
        Listen on Spotify
      </a>
    </section>
  );
}