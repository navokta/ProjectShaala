import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/utils/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import Bid from "@/lib/models/Bid";
import Project from "@/lib/models/Project";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronLeft, Info, CheckCircle, XCircle, Clock, Link as LinkIcon } from "lucide-react";

async function getUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) return null;
    const decoded = verifyAccessToken(token);
    return decoded?.userId ? decoded.userId : null;
  } catch (err) {
    return null;
  }
}

export const metadata = {
  title: "Bid Details | ProjectShaala",
  description: "View the details of your submitted project proposal.",
};

export default async function BidDetailsPage({ params }) {
  const userId = await getUser();
  if (!userId) {
    redirect("/login");
  }

  const { id } = await params;

  await connectToDatabase();

  const bid = await Bid.findById(id).populate("project").lean();

  if (!bid) {
    notFound();
  }

  // Verify Ownership
  if (bid.developer.toString() !== userId) {
    // If the currently authenticated developer doesn't own this bid:
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center border border-red-100">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">You do not have permission to view this proposal.</p>
          <Link
            href="/developer/bids"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition"
          >
            Back to My Bids
          </Link>
        </div>
      </div>
    );
  }

  const projectInfo = bid.project;

  const getStatusDisplay = (status) => {
    switch (status) {
      case "accepted":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-800",
          icon: <CheckCircle className="w-6 h-6 text-green-500 mr-2" />,
          title: "Bid Accepted",
          desc: "Congratulations! The client has accepted your proposal. They will contact you shortly to begin the project."
        };
      case "rejected":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-800",
          icon: <XCircle className="w-6 h-6 text-red-500 mr-2" />,
          title: "Bid Declined",
          desc: "Unfortunately, the client decided to go in a different direction for this project."
        };
      default:
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          text: "text-yellow-800",
          icon: <Clock className="w-6 h-6 text-yellow-500 mr-2" />,
          title: "Bid Pending",
          desc: "Your proposal is currently being reviewed by the client."
        };
    }
  };

  const statusInfo = getStatusDisplay(bid.status);

  return (
    <>
      <Header userType="developer" isDashboard={false} />
      <main className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link href="/developer/bids" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 mb-6">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to My Bids
          </Link>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            {/* Status Banner */}
            <div className={`${statusInfo.bg} border-b ${statusInfo.border} px-4 py-5 sm:px-6 flex items-start`}>
              {statusInfo.icon}
              <div>
                <h3 className={`text-lg font-medium ${statusInfo.text}`}>
                  {statusInfo.title}
                </h3>
                <p className={`mt-1 text-sm ${statusInfo.text} opacity-90`}>
                  {statusInfo.desc}
                </p>
              </div>
            </div>

            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Proposal Details</h1>
              <p className="text-sm text-gray-500">
                Submitted on {new Date(bid.createdAt).toLocaleDateString()} at {new Date(bid.createdAt).toLocaleTimeString()}
              </p>
            </div>

            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                <div className="bg-gray-50 px-4 py-5 rounded-lg border border-gray-100 flex flex-col justify-center">
                  <dt className="text-sm font-medium text-gray-500 mb-1">Your Bid Amount</dt>
                  <dd className="text-2xl font-semibold text-gray-900">₹{bid.amount}</dd>
                </div>
                
                <div className="bg-gray-50 px-4 py-5 rounded-lg border border-gray-100 flex flex-col justify-center">
                  <dt className="text-sm font-medium text-gray-500 mb-1">Estimated Timeline</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{bid.timeline} Days</dd>
                </div>

                <div className="bg-gray-50 px-4 py-5 rounded-lg border border-gray-100 flex flex-col justify-center">
                  <dt className="text-sm font-medium text-gray-500 mb-1">Original Project Budget</dt>
                  <dd className="text-lg font-medium text-gray-700">
                    {projectInfo ? (
                      projectInfo.budgetType === "hourly" ? `₹${projectInfo.hourlyRate}/hr` : `₹${projectInfo.budgetMin?.toLocaleString()} - ₹${projectInfo.budgetMax?.toLocaleString()}`
                    ) : (
                      "N/A"
                    )}
                  </dd>
                </div>
              </div>

              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 items-center flex">
                  <Info className="w-5 h-5 text-blue-500 mr-2" />
                  Cover Letter / Proposal
                </h3>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <p className="text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                    {bid.proposal}
                  </p>
                </div>
              </div>
            </div>
            
            {projectInfo && (
              <div className="bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Related Project</h4>
                  <p className="font-medium text-gray-900 mt-1">{projectInfo.title}</p>
                </div>
                <Link
                  href={`/developer/projects/${projectInfo._id.toString()}`}
                  className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                >
                  <LinkIcon className="w-4 h-4 mr-2 text-gray-400" />
                  View Original Project
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
