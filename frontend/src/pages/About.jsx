import PageTitle from '../components/common/PageTitle';

export default function About() {
  return (
    <div className="container py-12">
      <PageTitle title="Tentang Kami" />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">About</h1>
        <p className="text-gray-600 mb-4">
          This project demonstrates React best practices including:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Organized folder structure</li>
          <li>Component-based architecture</li>
          <li>Modern React hooks</li>
          <li>Tailwind CSS for styling</li>
          <li>ESLint and Prettier for code quality</li>
          <li>Environment variable management</li>
        </ul>
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-gray-700">This is an additional section for more content.</p>
        </div>
      </div>
    </div>
  );
}
