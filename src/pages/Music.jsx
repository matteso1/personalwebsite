export default function Music() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-6">Featured Track</h2>
      <iframe
        src="https://open.spotify.com/embed/track/25FM9yX68IPzFi7FDea91n"
        width="100%"
        height="380"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
      <p className="mt-4">
        More at{' '}
        <a
          href="https://open.spotify.com/artist/2qpBZGqFiVcsYEaJkBahMo"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-500 hover:underline"
        >
          my Spotify artist page
        </a>
        .
      </p>
    </section>
  );
}