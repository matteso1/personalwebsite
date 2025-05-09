export default function NotFound() {
  return (
    <section className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
      <p>
        Oops! The page you’re looking for doesn’t exist.{' '}
        <a href="/" className="text-blue-500 hover:underline">
          Go back home
        </a>
        .
      </p>
    </section>
  );
}
