// components/Terms/TermsContent.jsx
"use client";

import { useEffect } from "react";
import TermsSection from "./TermsSection";

export default function TermsContent({ activeSection, onSectionChange }) {
  // Scroll to section when activeSection changes
  useEffect(() => {
    const element = document.getElementById(activeSection);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeSection]);

  const termsData = {
    introduction: {
      title: "1. Introduction",
      content: `
        <p>Welcome to ProjectShaala ("Platform", "we", "us", "our"). These Terms of Service ("Terms") govern your access to and use of the ProjectShaala website, applications, and services (collectively, the "Service").</p>
        
        <p>By accessing or using ProjectShaala, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Service.</p>
        
        <h4>What is ProjectShaala?</h4>
        <p>ProjectShaala is a marketplace platform that connects clients ("Buyers") who need software development work with skilled developers ("Sellers") who can complete such work. We facilitate transactions, provide collaboration tools, and ensure secure payments through our escrow system.</p>
        
        <h4>Who Can Use ProjectShaala?</h4>
        <p>You must be at least 18 years old to use ProjectShaala. By using our Service, you represent and warrant that you meet this age requirement.</p>
      `,
    },
    account: {
      title: "2. Account Terms",
      content: `
        <h4>Account Creation</h4>
        <p>To use ProjectShaala, you must create an account. You agree to:</p>
        <ul>
          <li>Provide accurate, current, and complete information during registration</li>
          <li>Maintain and promptly update your account information</li>
          <li>Keep your password secure and confidential</li>
          <li>Notify us immediately of any unauthorized access</li>
        </ul>
        
        <h4>Account Responsibilities</h4>
        <p>You are responsible for all activities that occur under your account. We are not liable for any loss or damage arising from unauthorized use of your account.</p>
        
        <h4>Developer Verification</h4>
        <p>Developers must submit an application and be approved by our team before they can bid on projects. We reserve the right to reject any application at our discretion.</p>
        
        <h4>One Account Per User</h4>
        <p>You may maintain only one account unless explicitly authorized by us. Multiple accounts may result in suspension or termination.</p>
      `,
    },
    "user-conduct": {
      title: "3. User Conduct",
      content: `
        <h4>Prohibited Activities</h4>
        <p>You agree NOT to:</p>
        <ul>
          <li>Post false, misleading, or deceptive content</li>
          <li>Harass, abuse, or harm another person</li>
          <li>Share confidential information without authorization</li>
          <li>Circumvent our payment system or fee structure</li>
          <li>Use automated systems to access the Service (bots, scrapers)</li>
          <li>Post spam, advertisements, or promotional content outside designated areas</li>
          <li>Engage in any illegal or fraudulent activities</li>
        </ul>
        
        <h4>Project Requirements</h4>
        <p>Buyers must provide clear, accurate project descriptions. Developers must deliver work as agreed upon in the project terms.</p>
        
        <h4>Communication Guidelines</h4>
        <p>All communication between users should be professional and respectful. We monitor communications for safety and may review messages in case of disputes.</p>
      `,
    },
    "intellectual-property": {
      title: "4. Intellectual Property",
      content: `
        <h4>Platform Ownership</h4>
        <p>ProjectShaala, including its design, features, content, and code, is owned by us and protected by copyright, trademark, and other intellectual property laws.</p>
        
        <h4>User Content</h4>
        <p>You retain ownership of content you post on ProjectShaala. However, by posting content, you grant us a license to use, display, and distribute that content on our platform.</p>
        
        <h4>Project Deliverables</h4>
        <p>Ownership of project deliverables is determined by the agreement between Buyer and Developer. We recommend clearly defining intellectual property rights in your project contract.</p>
        
        <h4>DMCA Compliance</h4>
        <p>If you believe your intellectual property has been infringed, please contact us at <strong>legal@projectshaala.com</strong> with detailed information about the infringement.</p>
      `,
    },
    "fees-payment": {
      title: "5. Fees & Payment",
      content: `
        <h4>Platform Fee</h4>
        <p>ProjectShaala charges a 2% platform fee on all completed projects. This fee is deducted from the Developer's earnings.</p>
        
        <h4>Payment Processing</h4>
        <p>All payments are processed through our secure payment gateway (Razorpay). We accept:</p>
        <ul>
          <li>Credit/Debit Cards</li>
          <li>UPI</li>
          <li>Net Banking</li>
          <li>Digital Wallets</li>
        </ul>
        
        <h4>Escrow System</h4>
        <p>Buyer payments are held in escrow and only released to Developers when the project is completed and approved. This protects both parties.</p>
        
        <h4>Withdrawal</h4>
        <p>Developers can withdraw earnings to their bank account within 24-48 hours after payment is released. Minimum withdrawal amount is ₹500.</p>
        
        <h4>Taxes</h4>
        <p>Users are responsible for reporting and paying any applicable taxes on their earnings. ProjectShaala does not withhold taxes unless required by law.</p>
      `,
    },
    refunds: {
      title: "6. Refund Policy",
      content: `
        <h4>Refund Eligibility</h4>
        <p>Refunds are evaluated on a case-by-case basis. You may be eligible for a refund if:</p>
        <ul>
          <li>The Developer fails to deliver the project</li>
          <li>The delivered work does not meet agreed requirements</li>
          <li>There is fraudulent activity</li>
        </ul>
        
        <h4>Refund Process</h4>
        <p>To request a refund:</p>
        <ol>
          <li>Contact the Developer first to resolve the issue</li>
          <li>If unresolved, file a dispute through our platform</li>
          <li>Our team will review and make a decision within 7-10 business days</li>
        </ol>
        
        <h4>Non-Refundable Situations</h4>
        <p>Refunds are typically NOT granted for:</p>
        <ul>
          <li>Change of mind after project completion</li>
          <li>Minor issues that can be resolved through revisions</li>
          <li>Disputes filed more than 30 days after project completion</li>
        </ul>
        
        <h4>Platform Fee Refunds</h4>
        <p>If a full refund is issued to the Buyer, the platform fee will also be refunded to the Developer.</p>
      `,
    },
    disputes: {
      title: "7. Dispute Resolution",
      content: `
        <h4>Dispute Process</h4>
        <p>If a dispute arises between Buyer and Developer:</p>
        <ol>
          <li><strong>Direct Communication:</strong> Both parties should first attempt to resolve the issue directly</li>
          <li><strong>Mediation:</strong> If unresolved, either party can request mediation through ProjectShaala</li>
          <li><strong>Arbitration:</strong> Our team will review evidence and make a binding decision</li>
        </ol>
        
        <h4>Evidence Required</h4>
        <p>When filing a dispute, provide:</p>
        <ul>
          <li>Project requirements and agreements</li>
          <li>Communication records</li>
          <li>Deliverables and work submissions</li>
          <li>Any other relevant documentation</li>
        </ul>
        
        <h4>Decision Timeline</h4>
        <p>Our team aims to resolve disputes within 7-10 business days. Complex cases may take longer.</p>
        
        <h4>Binding Decision</h4>
        <p>ProjectShaala's decision in dispute resolution is final and binding on both parties.</p>
      `,
    },
    liability: {
      title: "8. Limitation of Liability",
      content: `
        <h4>No Warranty</h4>
        <p>ProjectShaala is provided "as is" without warranties of any kind, either express or implied.</p>
        
        <h4>Limitation of Damages</h4>
        <p>To the maximum extent permitted by law, ProjectShaala shall not be liable for:</p>
        <ul>
          <li>Indirect, incidental, or consequential damages</li>
          <li>Loss of profits, data, or business opportunities</li>
          <li>Personal injury or property damage</li>
          <li>Any damages exceeding the amount you paid to use the Service</li>
        </ul>
        
        <h4>Third-Party Services</h4>
        <p>We are not responsible for the quality, safety, or legality of third-party services accessed through our platform.</p>
        
        <h4>Force Majeure</h4>
        <p>We are not liable for delays or failures caused by events beyond our reasonable control (natural disasters, war, government actions, etc.).</p>
      `,
    },
    termination: {
      title: "9. Termination",
      content: `
        <h4>Account Termination by User</h4>
        <p>You may close your account at any time through your account settings. All pending projects must be completed or resolved before termination.</p>
        
        <h4>Account Termination by ProjectShaala</h4>
        <p>We reserve the right to suspend or terminate your account if you:</p>
        <ul>
          <li>Violate these Terms of Service</li>
          <li>Engage in fraudulent or illegal activities</li>
          <li>Receive multiple negative reviews or complaints</li>
          <li>Fail to complete projects without valid reason</li>
        </ul>
        
        <h4>Effect of Termination</h4>
        <p>Upon termination:</p>
        <ul>
          <li>Your right to use the Service immediately ceases</li>
          <li>Pending payments will be processed according to project status</li>
          <li>We may retain your information as required by law</li>
        </ul>
        
        <h4>Appeal Process</h4>
        <p>If your account is terminated, you may appeal the decision by contacting support@projectshaala.com within 14 days.</p>
      `,
    },
    privacy: {
      title: "10. Privacy Policy",
      content: `
        <h4>Data Collection</h4>
        <p>We collect information you provide (name, email, payment details) and information automatically collected (usage data, device information).</p>
        
        <h4>How We Use Your Data</h4>
        <p>Your data is used to:</p>
        <ul>
          <li>Provide and improve our Service</li>
          <li>Process payments and transactions</li>
          <li>Communicate with you about your account</li>
          <li>Ensure platform security and prevent fraud</li>
        </ul>
        
        <h4>Data Sharing</h4>
        <p>We do not sell your personal data. We may share data with:</p>
        <ul>
          <li>Payment processors (for transactions)</li>
          <li>Service providers (for platform operations)</li>
          <li>Legal authorities (when required by law)</li>
        </ul>
        
        <h4>Your Rights</h4>
        <p>You have the right to access, correct, or delete your personal data. Contact privacy@projectshaala.com for data requests.</p>
        
        <p><strong>For complete details, please read our <a href="/privacy" className="text-gray-900 underline font-medium">Privacy Policy</a>.</strong></p>
      `,
    },
    changes: {
      title: "11. Changes to Terms",
      content: `
        <h4>Updates to Terms</h4>
        <p>We may update these Terms from time to time. When we do, we will:</p>
        <ul>
          <li>Post the updated Terms on this page</li>
          <li>Update the "Last Updated" date</li>
          <li>Notify users of significant changes via email</li>
        </ul>
        
        <h4>Acceptance of Changes</h4>
        <p>Continued use of ProjectShaala after changes constitutes acceptance of the new Terms. If you do not agree, you must stop using the Service.</p>
        
        <h4>Review Frequency</h4>
        <p>We recommend reviewing these Terms periodically, especially before starting new projects or transactions.</p>
      `,
    },
    contact: {
      title: "12. Contact Information",
      content: `
        <h4>General Inquiries</h4>
        <p><strong>Email:</strong> support@projectshaala.com</p>
        <p><strong>Phone:</strong> +91 98765 43210</p>
        <p><strong>Hours:</strong> Monday - Saturday, 9 AM - 6 PM IST</p>
        
        <h4>Legal Matters</h4>
        <p><strong>Email:</strong> legal@projectshaala.com</p>
        <p><strong>Address:</strong> Tech Park, Bangalore, Karnataka, India</p>
        
        <h4>Privacy Concerns</h4>
        <p><strong>Email:</strong> privacy@projectshaala.com</p>
        
        <h4>Response Time</h4>
        <p>We aim to respond to all inquiries within 24 hours during business days.</p>
      `,
    },
    "governing-law": {
      title: "13. Governing Law",
      content: `
        <h4>Jurisdiction</h4>
        <p>These Terms are governed by the laws of India, without regard to conflict of law principles.</p>
        
        <h4>Dispute Venue</h4>
        <p>Any legal disputes arising from these Terms shall be resolved in the courts of Bangalore, Karnataka, India.</p>
        
        <h4>Arbitration</h4>
        <p>Before filing a lawsuit, parties agree to attempt good-faith negotiation and mediation through ProjectShaala's dispute resolution process.</p>
        
        <h4>Class Action Waiver</h4>
        <p>You agree to resolve disputes on an individual basis and waive any right to participate in class action lawsuits.</p>
        
        <h4>Severability</h4>
        <p>If any provision of these Terms is found invalid, the remaining provisions shall remain in full force and effect.</p>
      `,
    },
  };

  return (
    <div className="space-y-12">
      {Object.entries(termsData).map(([key, section]) => (
        <TermsSection
          key={key}
          id={key}
          title={section.title}
          content={section.content}
          isActive={activeSection === key}
        />
      ))}

      {/* Acceptance Notice */}
      <div className="mt-16 p-6 bg-gray-50 border border-gray-200 rounded-2xl">
        <h4 className="font-poppins font-bold text-gray-900 mb-3">
          Acknowledgment
        </h4>
        <p className="font-sans text-gray-600 leading-relaxed">
          By using ProjectShaala, you acknowledge that you have read,
          understood, and agree to be bound by these Terms of Service. If you do
          not agree to these terms, please discontinue use of our platform
          immediately.
        </p>
      </div>
    </div>
  );
}
