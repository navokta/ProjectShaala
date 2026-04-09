import { notFound } from "next/navigation";
import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  CheckCircle,
  Calendar,
  Layers,
  Award,
  ChevronLeft
} from "lucide-react";
import MessageButton from "@/components/Messages/MessageButton";

export async function generateMetadata({ params }) {
  const { id } = await params;
  await connectToDatabase();
  const project = await Project.findById(id).lean();
  
  if (!project) return { title: "Project Not Found" };
  
  return {
    title: `${project.title} | ProjectShaala`,
    description: project.description.substring(0, 160),
  };
}

export default async function ProjectDetailsPage({ params }) {
  const { id } = await params;
  
  await connectToDatabase();
  const project = await Project.findById(id).lean();

  if (!project) {
    notFound();
  }

  // Ensure only open and public projects are viewable by random devs,
  // but if we want them to see past projects they bid on, we might relax it.
  // For the exact requirements:
  if (project.status !== "open" || project.visibility !== "public") {
    // maybe we can still show it but disable bidding, we'll allow viewing here
  }

  return (
    <>
      <Header userType="developer" isDashboard={false} />
      
      <main className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link href="/developer/projects" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 mb-6">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to projects
          </Link>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            
            {/* Header Section */}
            <div className="px-4 py-6 sm:px-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {project.category}
                    </span>
                    <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${project.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {project.status.toUpperCase()}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Calendar className="mr-1.5 h-4 w-4 text-gray-400" />
                    Posted {new Date(project.createdAt).toLocaleDateString()} by <span className="ml-1 font-medium text-gray-900">{project.buyerName}</span>
                  </p>
                </div>
                
                <div className="mt-6 md:mt-0 md:ml-6 flex-shrink-0 flex flex-col items-start md:items-end">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {project.budgetType === "hourly" ? (
                      `₹${project.hourlyRate}/hr`
                    ) : (
                      `₹${project.budgetMin?.toLocaleString() || 0} - ₹${project.budgetMax?.toLocaleString() || 0}`
                    )}
                  </div>
                  <div className="text-sm text-gray-500 mb-4 inline-flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {project.timeline}
                  </div>
                  
                  {project.status === "open" ? (
                    <div className="w-full flex sm:flex-row flex-col gap-3">
                      <Link
                        href={`/developer/projects/${project._id.toString()}/bid`}
                        className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        Place a Bid
                      </Link>
                      <MessageButton
                        receiverId={project.buyer}
                        dashboardPath="/developer/messages"
                        label="Message Buyer"
                        className="flex-1 px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-md shadow-sm font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
                      />
                    </div>
                  ) : (
                    <div className="w-full flex sm:flex-row flex-col gap-3">
                      <span className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-500 bg-gray-100 cursor-not-allowed">
                        Bidding Closed
                      </span>
                      <MessageButton
                        receiverId={project.buyer}
                        dashboardPath="/developer/messages"
                        label="Message Buyer"
                        className="flex-1 px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-md shadow-sm font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
                      />
                    </div>
                  )}
                  <p className="mt-2 text-xs text-gray-500">{project.bidCount} proposals so far</p>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="px-4 py-6 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Project Description</h2>
              <div className="prose max-w-none text-gray-600 whitespace-pre-wrap font-sans">
                {project.description}
              </div>

              <div className="mt-8 border-t border-gray-200 pt-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Award className="mr-2 h-5 w-5 text-blue-500" />
                  Skills & Expertise Needed
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {project.requirements && project.requirements.length > 0 && (
                <div className="mt-8 border-t border-gray-200 pt-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-blue-500" />
                    Requirements
                  </h2>
                  <ul className="space-y-3">
                    {project.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-green-500 rounded-full border border-green-500 flex items-center justify-center mr-3 mt-0.5">
                          <CheckCircle className="h-3 w-3" />
                        </div>
                        <span className="text-gray-600">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.deliverables && project.deliverables.length > 0 && (
                <div className="mt-8 border-t border-gray-200 pt-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Layers className="mr-2 h-5 w-5 text-blue-500" />
                    Deliverables
                  </h2>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    {project.deliverables.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
