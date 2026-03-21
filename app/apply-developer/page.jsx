import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApplyDeveloperForm from '@/components/ApplyDeveloperForm';

export default function ApplyDeveloperPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <ApplyDeveloperForm />
        </div>
      </main>
      <Footer />
    </>
  );
}