// src/pages/Music.jsx
import React from 'react';

const MusicCard = ({ title, description, spotifyId, index }) => {
  return (
    <div className="bg-secondary rounded-lg overflow-hidden shadow-lg">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="bg-dark text-accent font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">
            {index}
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-gray-300 mb-4">{description}</p>
        <iframe
          src={`https://open.spotify.com/embed/track/${spotifyId}`}
          width="100%"
          height="80"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen"
          loading="lazy"
          title={`Spotify Player - ${title}`}
        ></iframe>
      </div>
    </div>
  );
};

const Music = () => {
  // Sample track data
  const tracks = [
    {
      id: 1,
      title: "What Do You Dream About?",
      description: "My latest release exploring themes of aspiration and imagination.",
      spotifyId: "25FM9yX68IPzFi7FDea91n"
    },
    {
      id: 2,
      title: "Night Vision",
      description: "A deep dive into nocturnal soundscapes and late-night reflections.",
      spotifyId: "25FM9yX68IPzFi7FDea91n"
    },
    {
      id: 3,
      title: "Quantum Theory",
      description: "Experimental track blending electronic beats with abstract concepts.",
      spotifyId: "25FM9yX68IPzFi7FDea91n"
    }
  ];

  return (
    <div>
      {/* Header Section */}
      <section className="py-20 bg-gradient-to-b from-black to-dark">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            My Music
          </h1>
          <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
            Listen to my latest tracks and releases
          </p>
        </div>
      </section>

      {/* Featured Track */}
      <section className="py-16 bg-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8">
            Featured Track
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://open.spotify.com/embed/track/25FM9yX68IPzFi7FDea91n"
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen"
                loading="lazy"
                title="Spotify Player - Featured Track"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Track List */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8">
            All Tracks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks.map(track => (
              <MusicCard
                key={track.id}
                title={track.title}
                description={track.description}
                spotifyId={track.spotifyId}
                index={track.id}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Releases */}
      <section className="py-16 bg-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8">
            Upcoming Album
          </h2>
          <div className="bg-secondary p-8 rounded-lg">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/3 aspect-square bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-accent">Coming Soon</span>
              </div>
              <div className="w-full md:w-2/3">
                <h3 className="text-2xl font-bold text-white mb-4">Debut Album in Progress</h3>
                <p className="text-gray-300 mb-4">
                  I'm currently working on my debut album, which will be released later this year. The album features a collection of tracks that represent my artistic journey so far.
                </p>
                <p className="text-gray-300">
                  Follow me on Spotify and social media to be the first to know when it drops!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Music;