// app/how-it-works/page.jsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  CurrencyRupeeIcon,
  CodeBracketIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

export const metadata = {
  title: "How It Works - ProjectShaala",
  description:
    "Learn how ProjectShaala connects clients with skilled developers. Post a project, get bids, hire, and collaborate – all in one platform.",
};

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        {/* Hero Section */}
        <section className="bg-gray-50 border-b border-gray-200 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-poppins text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How ProjectShaala Works
            </h1>
            <p className="font-sans text-gray-600 text-lg max-w-2xl mx-auto">
              A simple, secure platform that connects businesses with talented
              developers. Post your project, get competitive bids, and start
              building.
            </p>
          </div>
        </section>

        {/* For Clients Section */}
        <section className="py-20 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-poppins text-3xl font-bold text-gray-900 mb-2">
              For Clients
            </h2>
            <p className="font-sans text-gray-500">
              From idea to delivery – we make hiring developers easy
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-4">
                <DocumentTextIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-poppins text-xl font-semibold text-gray-900 mb-2">
                1. Post Your Project
              </h3>
              <p className="font-sans text-gray-600">
                Describe your requirements, budget, timeline, and skills
                needed. Our form guides you through every detail.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-4">
                <UserGroupIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-poppins text-xl font-semibold text-gray-900 mb-2">
                2. Receive Bids
              </h3>
              <p className="font-sans text-gray-600">
                Skilled developers will submit proposals with their approach,
                timeline, and price. Review their profiles and ratings.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-4">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-poppins text-xl font-semibold text-gray-900 mb-2">
                3. Hire & Collaborate
              </h3>
              <p className="font-sans text-gray-600">
                Chat, share files, and track progress in our secure workspace.
                Milestones keep everyone on the same page.
              </p>
            </div>
          </div>
        </section>

        {/* For Developers Section */}
        <section className="bg-gray-50 border-y border-gray-200 py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-poppins text-3xl font-bold text-gray-900 mb-2">
                For Developers
              </h2>
              <p className="font-sans text-gray-500">
                Find projects you love and earn money doing what you do best
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-4">
                  <MagnifyingGlassIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-poppins text-xl font-semibold text-gray-900 mb-2">
                  1. Browse Projects
                </h3>
                <p className="font-sans text-gray-600">
                  Explore open projects that match your skills. Filter by
                  budget, category, timeline, and experience level.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-4">
                  <CodeBracketIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-poppins text-xl font-semibold text-gray-900 mb-2">
                  2. Submit a Bid
                </h3>
                <p className="font-sans text-gray-600">
                  Write a compelling proposal, set your price and timeline.
                  Showcase your expertise to win the project.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-4">
                  <CurrencyRupeeIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-poppins text-xl font-semibold text-gray-900 mb-2">
                  3. Get Paid
                </h3>
                <p className="font-sans text-gray-600">
                  Deliver high‑quality work on time. Get paid securely via
                  escrow – funds are released only when you deliver.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose ProjectShaala */}
        <section className="py-20 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-poppins text-3xl font-bold text-gray-900 mb-2">
              Why Choose ProjectShaala?
            </h2>
            <p className="font-sans text-gray-500">
              Built for trust, transparency, and success
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-gray-700" />
              </div>
              <h3 className="font-poppins font-semibold text-gray-900">
                Secure Escrow
              </h3>
              <p className="font-sans text-gray-500 text-sm">
                Payments are held securely and released upon completion.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChatBubbleLeftRightIcon className="w-8 h-8 text-gray-700" />
              </div>
              <h3 className="font-poppins font-semibold text-gray-900">
                In‑App Messaging
              </h3>
              <p className="font-sans text-gray-500 text-sm">
                Communicate directly, no need to share personal email/phone.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RocketLaunchIcon className="w-8 h-8 text-gray-700" />
              </div>
              <h3 className="font-poppins font-semibold text-gray-900">
                Dispute Resolution
              </h3>
              <p className="font-sans text-gray-500 text-sm">
                Fair mediation ensures both parties are protected.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DocumentTextIcon className="w-8 h-8 text-gray-700" />
              </div>
              <h3 className="font-poppins font-semibold text-gray-900">
                Milestone Payments
              </h3>
              <p className="font-sans text-gray-500 text-sm">
                Break large projects into smaller, manageable payments.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-900 text-white py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-poppins text-3xl md:text-4xl font-bold mb-4">
              Ready to start your next project?
            </h2>
            <p className="font-sans text-gray-300 mb-8 text-lg">
              Join thousands of businesses and developers using ProjectShaala.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/projects"
                className="inline-block bg-white text-gray-900 font-poppins font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition"
              >
                Explore Projects
              </Link>
              <Link
                href="/signup"
                className="inline-block bg-transparent border-2 border-white text-white font-poppins font-semibold px-8 py-3 rounded-xl hover:bg-white hover:text-gray-900 transition"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}