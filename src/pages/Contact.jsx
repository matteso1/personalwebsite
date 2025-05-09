export default function Contact() {
  return (
    <section className="max-w-2xl mx-auto py-20 px-6 text-center">
      <h2 className="text-4xl font-heading font-bold mb-6">Get in Touch</h2>
      <p className="text-lg mb-4">
        Follow on Instagram:{' '}
        <a
          href="https://instagram.com/yoitsnils"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-semibold"
        >
          @yoitsnils
        </a>
      </p>
      <p className="text-lg">
        Or shoot me an email:{' '}
        <a
          href="mailto:sendbeats2nils@gmail.com"
          className="text-primary hover:underline font-semibold"
        >
          sendbeats2nils@gmail.com
        </a>
      </p>
    </section>
  );
}