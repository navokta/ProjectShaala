// app/api/projects/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Project from '@/models/Project';

export async function GET(request) {
  try {
    // ✅ Connect to DB
    await dbConnect();

    const { searchParams } = new URL(request.url);

    // 🎯 Parse Query Params
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const minPrice = Number(searchParams.get('minPrice')) || 0;
    const maxPrice = Number(searchParams.get('maxPrice')) || 100000;
    const techStack = searchParams.get('techStack') || '';
    const sort = searchParams.get('sort') || '';

    // 🛠️ Build MongoDB Query
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) query.category = category;
    if (techStack) query.techStack = { $in: [techStack] };
    query.price = { $gte: minPrice, $lte: maxPrice };

    // 📊 Sorting Logic
    let sortOption = {};
    if (sort === 'downloads') {
      sortOption = { downloadCount: -1 }; // Highest first
    } else if (sort === 'rating') {
      sortOption = { rating: -1 };
    } else {
      sortOption = { createdAt: -1 }; // Default: newest
    }

    // 📥 Fetch Projects
    const projects = await Project.find(query).sort(sortOption).limit(20);

    // ✅ Success
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error('🚨 API Error:', error.message || error);
    return NextResponse.json(
      { error: 'Failed to fetch projects', details: error.message },
      { status: 500 }
    );
  }
}

// POST: Add new project
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const project = new Project(body);
    await project.save();

    return NextResponse.json(
      { message: 'Project added successfully!', project },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ POST Error:', error.message || error);
    return NextResponse.json(
      { error: 'Failed to add project', details: error.message },
      { status: 500 }
    );
  }
}