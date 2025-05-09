export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 py-4">
      <div className="max-w-4xl mx-auto text-center text-sm">
        © {new Date().getFullYear()} Nils Matteson. All rights reserved.
      </div>
    </footer>
  );
}