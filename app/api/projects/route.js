// app/api/projects/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Project from '@/models/Project';

// GET: Fetch projects with filters (already implemented)
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const minPrice = Number(searchParams.get('minPrice')) || 0;
    const maxPrice = Number(searchParams.get('maxPrice')) || 100000;
    const techStack = searchParams.get('techStack') || '';

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

    const projects = await Project.find(query).limit(20);
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST: Add a new project
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
    console.error('Error adding project:', error);
    return NextResponse.json(
      { error: 'Failed to add project' },
      { status: 500 }
    );
  }
}