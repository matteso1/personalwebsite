export default function Music() {
  return (
    <section className="max-w-3xl mx-auto py-20 px-6">
      <h2 className="text-4xl font-heading font-bold mb-6">Featured Track</h2>
      <div className="rounded-lg shadow-lg overflow-hidden mb-6">
        <iframe
          src="https://open.spotify.com/embed/track/25FM9yX68IPzFi7FDea91n"
          width="100%"
          height="380"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen"
          loading="lazy"
        ></iframe>
      </div>
      <p className="text-lg">
        More at{' '}
        <a
          href="https://open.spotify.com/artist/2qpBZGqFiVcsYEaJkBahMo"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          my Spotify artist page
        </a>
        .
      </p>
    </section>
  );
}