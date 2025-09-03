// app/api/projects/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // Your MongoDB connection utility
import Project from '@/models/Project'; // Your Mongoose model

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const minPrice = Number(searchParams.get('minPrice')) || 0;
    const maxPrice = Number(searchParams.get('maxPrice')) || 100000;
    const techStack = searchParams.get('techStack') || '';

    // Build MongoDB query
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) query.category = category;
    if (techStack) query.techStack = { $in: [techStack] };

    query.price = { $gte: minPrice, $lte: maxPrice };

    const projects = await Project.find(query).limit(20);
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}