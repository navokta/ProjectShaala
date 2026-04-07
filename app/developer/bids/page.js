import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { verifyAccessToken } from "@/lib/utils/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import Bid from "@/lib/models/Bid";
import Project from "@/lib/models/Project";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Clock, FileText, CheckCircle, XCircle } from "lucide-react";

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
  title: "My Bids | ProjectShaala",
  description: "View and track the status of your submitted project proposals.",
};

export default async function MyBidsPage() {
  const userId = await getUser();
  
  if (!userId) {
    redirect("/login");
  }

  await connectToDatabase();

  const bids = await Bid.find({ developer: userId })
    .populate({ path: "project", select: "title budgetType" })
    .sort({ createdAt: -1 })
    .lean();

  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Accepted</span>;
      case "rejected":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" /> Rejected</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Pending</span>;
    }
  };

  return (
    <>
      <Header userType="developer" isDashboard={false} />
      
      <main className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Bids</h1>
            <p className="mt-2 text-gray-600">Track and manage the proposals you have submitted to clients.</p>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {bids.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {bids.map((bid) => (
                  <li key={bid._id.toString()}>
                    <Link
                      href={`/developer/bids/${bid._id.toString()}`}
                      className="block hover:bg-gray-50 transition duration-150 ease-in-out px-4 py-5 sm:px-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-medium text-blue-600 truncate mr-2">
                            {bid.project?.title || "Deleted Project"}
                          </p>
                          {bid.isDirectHire && (
                             <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 border border-purple-200 shadow-sm mr-2">
                               Direct Hire Invitation
                             </span>
                          )}
                          {getStatusBadge(bid.status)}
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-sm leading-5 font-semibold text-gray-800">
                            ₹{bid.amount}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex sm:space-x-6">
                          <p className="flex items-center text-sm text-gray-500">
                            <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {bid.timeline} days
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 max-w-xl truncate">
                            <FileText className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {bid.proposal}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <span className="text-gray-400 text-xs">
                            Applied on {new Date(bid.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-16">
                <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No bids submitted yet</h3>
                <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                  You haven&apos;t placed any bids on projects yet. Browse open projects to find your next freelance opportunity.
                </p>
                <div className="mt-6">
                  <Link
                    href="/developer/projects"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Browse Projects
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
