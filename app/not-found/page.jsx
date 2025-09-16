import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800 px-6">
      <h1 className="text-6xl font-bold text-orange-500">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
      <p className="mt-2 text-gray-600 text-center max-w-md">
        Oops! The page you are looking for doesn’t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
