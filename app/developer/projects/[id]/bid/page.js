import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BidForm from "./BidForm";

export default async function BidPage({ params }) {
  const { id } = await params;
  
  await connectToDatabase();
  const project = await Project.findById(id).lean();

  if (!project || project.status !== "open") {
    notFound();
  }

  // Pass necessary project info to the client component
  const projectInfo = {
    id: project._id.toString(),
    title: project.title,
    budgetType: project.budgetType,
    hourlyRate: project.hourlyRate,
    budgetMin: project.budgetMin,
    budgetMax: project.budgetMax,
  };

  return (
    <>
      <Header userType="developer" isDashboard={false} />
      <main className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <BidForm project={projectInfo} />
        </div>
      </main>
      <Footer />
    </>
  );
}
