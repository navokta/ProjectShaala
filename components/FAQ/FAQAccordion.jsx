// components/FAQ/FAQAccordion.jsx
"use client";

import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

export default function FAQAccordion({
  activeCategory,
  searchQuery,
  openQuestions,
  onToggleQuestion,
}) {
  const faqData = {
    general: [
      {
        question: "What is ProjectShaala?",
        answer:
          "ProjectShaala is a dynamic marketplace where clients hire skilled developers to build web, app, and software projects. We connect project owners with talented developers, enabling collaboration and project execution with secure payments and built-in protection.",
      },
      {
        question: "How do I get started?",
        answer:
          "Simply sign up for a free account, complete your profile, and you're ready to go! Clients can post projects, and developers can browse and bid on projects that match their skills.",
      },
      {
        question: "Is ProjectShaala free to use?",
        answer:
          "Yes! Creating an account and browsing is completely free. We only charge a 2% platform fee when a project is successfully completed and payment is released.",
      },
      {
        question: "Can I use ProjectShaala from anywhere?",
        answer:
          "Absolutely! ProjectShaala is accessible worldwide. However, payment methods may vary by region. We support multiple currencies and payment gateways.",
      },
    ],
    developers: [
      {
        question: "How do I become a developer on ProjectShaala?",
        answer:
          "Click on 'Become a Developer' and submit your application with your portfolio, skills, and experience. Our team reviews applications within 2-3 business days.",
      },
      {
        question: "How much can I earn?",
        answer:
          "Earnings vary based on your skills, experience, and project complexity. Our developers earn anywhere from ₹20,000 to ₹2,00,000+ per month. You keep 98% of your earnings after our 2% platform fee.",
      },
      {
        question: "Can I work with other developers?",
        answer:
          "Yes! You can create teams, invite other developers, and collaborate on projects. Payments can be split automatically among team members based on your agreement.",
      },
      {
        question: "How do I receive payments?",
        answer:
          "Payments are released to your ProjectShaala wallet once the client approves your work. You can then withdraw to your bank account via Razorpay within 24-48 hours.",
      },
      {
        question: "What if a client doesn't approve my work?",
        answer:
          "Our dispute resolution team will review the project. If you've delivered as promised, we'll release your payment within 7 days even if the client is unresponsive.",
      },
    ],
    clients: [
      {
        question: "How do I post a project?",
        answer:
          "After signing up, go to your dashboard and click 'Post Project'. Fill in the project details, budget, timeline, and required skills. Your project will be visible to developers within minutes.",
      },
      {
        question: "How do I choose the right developer?",
        answer:
          "Review developer profiles, portfolios, ratings, and reviews. You can also chat with developers before hiring to discuss your project requirements.",
      },
      {
        question: "What if I'm not satisfied with the work?",
        answer:
          "You can request revisions during the project. If the final delivery doesn't meet agreed requirements, our dispute team will help resolve the issue fairly.",
      },
      {
        question: "Can I hire the same developer again?",
        answer:
          "Absolutely! You can directly invite developers you've worked with before for new projects. Many clients build long-term relationships with their favorite developers.",
      },
    ],
    payments: [
      {
        question: "What payment methods are accepted?",
        answer:
          "We accept Razorpay, UPI, Credit/Debit Cards, Net Banking, and Wallets. International clients can pay via PayPal and international cards.",
      },
      {
        question: "When is payment released to the developer?",
        answer:
          "Payment is held in escrow and only released when you confirm project completion. This ensures you receive quality work before the developer gets paid.",
      },
      {
        question: "What is the platform fee?",
        answer:
          "We charge a 2% platform fee on the total project value. This fee is deducted from the developer's earnings, not added to your cost.",
      },
      {
        question: "Can I get a refund?",
        answer:
          "Refunds are evaluated case-by-case. If a project cannot be completed due to developer issues, you may be eligible for a full or partial refund.",
      },
      {
        question: "Are there any hidden charges?",
        answer:
          "No hidden charges whatsoever. The 2% platform fee is the only charge. No monthly fees, no subscription costs, no surprises.",
      },
    ],
    security: [
      {
        question: "Is my payment secure?",
        answer:
          "Yes! We use industry-standard encryption and secure payment gateways (Razorpay). Your payment information is never stored on our servers.",
      },
      {
        question: "How is my data protected?",
        answer:
          "We use SSL encryption, secure databases, and follow best practices for data protection. Your personal and project information is kept confidential.",
      },
      {
        question: "What if there's a dispute?",
        answer:
          "Our dedicated dispute resolution team reviews all conflicts fairly. We examine project requirements, deliverables, and communication to make informed decisions.",
      },
      {
        question: "Can I trust the developers?",
        answer:
          "All developers go through a verification process. You can also check their ratings, reviews, and portfolio before hiring. Our payment protection ensures you only pay for satisfactory work.",
      },
    ],
    support: [
      {
        question: "How can I contact support?",
        answer:
          "You can reach us via email (support@projectshaala.com), phone (+91 98765 43210), or through the contact form. We respond within 24 hours.",
      },
      {
        question: "What are your support hours?",
        answer:
          "Our support team is available Monday to Saturday, 9 AM to 6 PM IST. For urgent issues, you can call our support line during business hours.",
      },
      {
        question: "Do you offer phone support?",
        answer:
          "Yes, phone support is available for premium users and urgent project-related issues. Check your dashboard for the support number.",
      },
      {
        question: "Where can I find tutorials?",
        answer:
          "Visit our Help Center and Blog for detailed tutorials, guides, and tips on using ProjectShaala effectively.",
      },
    ],
  };

  // Filter FAQs based on category and search
  const getFilteredFAQs = () => {
    let FAQs = [];

    if (activeCategory === "all") {
      FAQs = Object.entries(faqData).flatMap(([category, items]) =>
        items.map((item) => ({ ...item, category })),
      );
    } else {
      FAQs =
        faqData[activeCategory]?.map((item) => ({
          ...item,
          category: activeCategory,
        })) || [];
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      FAQs = FAQs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query),
      );
    }

    return FAQs;
  };

  const filteredFAQs = getFilteredFAQs();

  if (filteredFAQs.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <QuestionMarkCircleIcon className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="font-poppins text-xl font-bold text-gray-900 mb-2">
          No results found
        </h3>
        <p className="font-sans text-gray-600 mb-6">
          Try adjusting your search or browse all categories.
        </p>
        <button
          onClick={() => {
            onCategoryChange("all");
            searchQuery && onSearchChange("");
          }}
          className="px-6 py-3 bg-gray-900 text-white font-poppins font-semibold rounded-xl hover:bg-gray-800 transition-colors"
        >
          View All FAQs
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Results Count */}
      <div className="mb-6 flex items-center justify-between">
        <p className="font-sans text-gray-600">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {filteredFAQs.length}
          </span>{" "}
          questions
          {searchQuery && (
            <span>
              {" "}
              for "<span className="text-gray-900">{searchQuery}</span>"
            </span>
          )}
        </p>
      </div>

      {/* FAQ Items */}
      {filteredFAQs.map((faq, index) => {
        const globalIndex = `${faq.category}-${index}`;
        const isOpen = openQuestions.includes(globalIndex);

        return (
          <div
            key={globalIndex}
            className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-400 transition-colors duration-300"
          >
            <button
              onClick={() => onToggleQuestion(globalIndex)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isOpen
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {isOpen ? (
                    <MinusIcon className="w-5 h-5" />
                  ) : (
                    <PlusIcon className="w-5 h-5" />
                  )}
                </div>
                <span className="font-poppins font-semibold text-gray-900 text-lg pr-4">
                  {faq.question}
                </span>
              </div>
            </button>

            {isOpen && (
              <div className="px-6 pb-6 pt-2">
                <div className="ml-12">
                  <p className="font-sans text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                  {/* Category Tag */}
                  <div className="mt-4">
                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 text-xs font-sans font-medium rounded-full capitalize">
                      {faq.category}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
