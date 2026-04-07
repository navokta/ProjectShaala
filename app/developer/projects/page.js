import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import { 
  Briefcase, 
  Clock, 
  MapPin, 
  DollarSign, 
  Search,
  Filter
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Browse Client Projects | ProjectShaala",
  description: "Find your next freelance opportunity. Browse open projects posted by clients on ProjectShaala.",
};

export default async function BrowseProjectsPage() {
  await connectToDatabase();

  // Fetch only open and public projects
  const projects = await Project.find({ status: "open", visibility: "public" })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <>
      <Header userType="developer" isDashboard={false} />
      
      <main className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Available Projects</h1>
              <p className="mt-2 text-gray-600">Find and bid on open projects from clients worldwide.</p>
            </div>
            
            {/* Simple Search / Filter Placeholder */}
            <div className="mt-4 md:mt-0 flex space-x-3">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border bg-white"
                  placeholder="Search projects..."
                />
              </div>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-2 text-gray-500" />
                Filters
              </button>
            </div>
          </div>

          {/* Projects List */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {projects.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {projects.map((project) => (
                  <li key={project._id.toString()}>
                    <Link
                      href={`/developer/projects/${project._id.toString()}`}
                      className="block hover:bg-blue-50/30 transition duration-150 ease-in-out"
                    >
                      <div className="px-4 py-6 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-xl font-semibold text-blue-600 truncate">
                            {project.title}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {project.category}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex sm:space-x-6">
                            <p className="flex items-center text-sm text-gray-500">
                              <DollarSign className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              {project.budgetType === "hourly" ? (
                                `₹${project.hourlyRate}/hr`
                              ) : (
                                `₹${project.budgetMin?.toLocaleString() || 0} - ₹${project.budgetMax?.toLocaleString() || 0}`
                              )}
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              {project.timeline}
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <Briefcase className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              Experience: {project.experienceLevel}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <span className="text-gray-400 text-xs">
                              Posted {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <p className="mt-4 text-sm text-gray-600 line-clamp-2">
                          {project.description}
                        </p>
                        
                        <div className="mt-4 flex flex-wrap gap-2">
                          {project.skills?.slice(0, 5).map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {skill}
                            </span>
                          ))}
                          {project.skills?.length > 5 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-50 text-gray-500">
                              +{project.skills.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-16">
                <Briefcase className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No open projects</h3>
                <p className="mt-1 text-sm text-gray-500">
                  There are currently no open projects available for bidding. Check back soon!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
