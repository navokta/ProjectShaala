// components/Project/ProjectCard.jsx
"use client";

import {
  StarIcon,
  ShoppingCartIcon,
  EyeIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/solid";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function ProjectCard({ project }) {
  return (
    <div className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-900 hover:shadow-xl transition-all duration-300">
      {/* Project Thumbnail */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        <img
          src={project.thumbnail || "/placeholder-project.jpg"}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-poppins font-semibold rounded-full border border-gray-200">
            {project.category}
          </span>
        </div>

        {/* Tech Stack Badge */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="absolute bottom-3 left-3 flex gap-1">
            {project.techStack.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-900/90 backdrop-blur-sm text-white text-xs font-sans font-medium rounded-md"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 3 && (
              <span className="px-2 py-1 bg-gray-800/90 backdrop-blur-sm text-white text-xs font-sans font-medium rounded-md">
                +{project.techStack.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Project Info */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-poppins text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-gray-700 transition-colors">
          {project.title}
        </h3>

        {/* Description */}
        <p className="font-sans text-sm text-gray-600 mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Stats Row */}
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <StarIcon className="w-4 h-4 text-amber-400" />
            <span className="font-sans text-sm font-bold text-gray-900">
              {project.rating}
            </span>
            <span className="font-sans text-xs text-gray-500">
              ({project.reviews})
            </span>
          </div>

          {/* Views */}
          <div className="flex items-center gap-1 text-gray-500">
            <EyeIcon className="w-4 h-4" />
            <span className="font-sans text-xs">{project.views}</span>
          </div>

          {/* Sales */}
          <div className="flex items-center gap-1 text-gray-500">
            <ShoppingCartIcon className="w-4 h-4" />
            <span className="font-sans text-xs">{project.sales} sold</span>
          </div>
        </div>

        {/* Developer Info */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={project.developer.avatar || "/default-avatar.jpg"}
            alt={project.developer.name}
            className="w-8 h-8 rounded-full border border-gray-200"
          />
          <div className="flex-1 min-w-0">
            <p className="font-sans text-sm font-medium text-gray-900 truncate">
              {project.developer.name}
            </p>
            <p className="font-sans text-xs text-gray-500">
              {project.developer.level}
            </p>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-poppins text-2xl font-bold text-gray-900">
                ₹{project.price}
              </span>
              {project.originalPrice && (
                <span className="font-sans text-sm text-gray-400 line-through">
                  ₹{project.originalPrice}
                </span>
              )}
            </div>
            {project.discount && (
              <span className="font-sans text-xs text-emerald-600 font-medium">
                {project.discount}% OFF
              </span>
            )}
          </div>

          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-poppins font-semibold rounded-xl border-2 border-gray-900 hover:bg-white hover:text-gray-900 transition-all duration-300 group/btn">
            View Details
            <ArrowRightIcon className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
