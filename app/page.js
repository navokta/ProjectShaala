import Header from '@/components/Header';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="pt-16"> {/* Offset for sticky header */}
        <h1>Welcome to the site</h1>
      </main>
    </>
  );
}