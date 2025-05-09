export default function Contact() {
  return (
    <section className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
      <p className="mb-4">
        Follow on Instagram: {' '}
        <a
          href="https://instagram.com/yoitsnils"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-500 hover:underline"
        >
          @yoitsnils
        </a>
      </p>
      <p>
        Or shoot me an email:{' '}
        <a
          href="mailto:sendbeats2nils@gmail.com"
          className="text-blue-500 hover:underline"
        >
          sendbeats2nils@gmail.com
        </a>
      </p>
    </section>
  );
}