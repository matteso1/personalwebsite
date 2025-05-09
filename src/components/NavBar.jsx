import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { pathname } = useLocation();
  const linkClass = (path) =>
    `px-3 py-2 rounded ${pathname === path ? 'bg-gray-200 dark:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">Nils Matteson</Link>
        <div className="flex space-x-2">
          <Link to="/" className={linkClass('/')}>Home</Link>
          <Link to="/music" className={linkClass('/music')}>Music</Link>
          <Link to="/contact" className={linkClass('/contact')}>Contact</Link>
        </div>
      </div>
    </nav>
  );
}
