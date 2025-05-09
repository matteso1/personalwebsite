export default function NotFound() {
  return (
    <section className="max-w-2xl mx-auto py-20 px-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
      <p>
        Oops! The page you’re looking for doesn’t exist.{' '}
        <a href="/" className="text-primary hover:underline">
          Go back home
        </a>
        .
      </p>
    </section>
  );
}
