import PageTitle from '../components/common/PageTitle';

export default function Home() {
  return (
    <div className="container py-12">
      <PageTitle title="Beranda" />
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to React Best Practices
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A well-structured React project following modern best practices
        </p>
        <button className="btn">
          Get Started
        </button>
      </div>
    </div>
  );
}
