// components/DevDashboard/SkillsSection.jsx
"use client";

import { useState } from "react";
import { PencilIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

const predefinedSkills = [
  "React",
  "Node.js",
  "MongoDB",
  "TypeScript",
  "Next.js",
  "Tailwind CSS",
  "Socket.IO",
  "Express.js",
  "PostgreSQL",
  "Redis",
  "AWS",
  "Docker",
  "GraphQL",
  "Python",
  "Django",
  "Vue.js",
  "Angular",
  "React Native",
];

export default function SkillsSection({ skills, onSkillUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [localSkills, setLocalSkills] = useState(skills || []);

  const addSkill = (skill) => {
    if (skill && !localSkills.includes(skill) && localSkills.length < 10) {
      const updated = [...localSkills, skill];
      setLocalSkills(updated);
      if (onSkillUpdate) onSkillUpdate(updated);
    }
    setNewSkill("");
  };

  const removeSkill = (skillToRemove) => {
    const updated = localSkills.filter((s) => s !== skillToRemove);
    setLocalSkills(updated);
    if (onSkillUpdate) onSkillUpdate(updated);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill(newSkill.trim());
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-900 transition-all">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-poppins font-semibold text-gray-900 text-lg">
          Skills & Expertise
        </h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-1 text-sm text-gray-900 hover:underline font-inter"
        >
          <PencilIcon className="w-4 h-4" />
          {isEditing ? "Done" : "Edit"}
        </button>
      </div>

      {/* Skills Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {localSkills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-900 rounded-xl text-sm font-inter"
          >
            {skill}
            {isEditing && (
              <button
                onClick={() => removeSkill(skill)}
                className="ml-1 p-0.5 hover:bg-gray-200 rounded-full transition-colors"
                aria-label={`Remove ${skill}`}
              >
                <XMarkIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </span>
        ))}

        {isEditing && localSkills.length < 10 && (
          <div className="relative">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add skill..."
              className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-inter
                focus:outline-none focus:ring-2 focus:ring-gray-900 w-32"
              list="skill-suggestions"
            />
            <datalist id="skill-suggestions">
              {predefinedSkills
                .filter((s) => !localSkills.includes(s))
                .map((skill) => (
                  <option key={skill} value={skill} />
                ))}
            </datalist>
          </div>
        )}
      </div>

      {localSkills.length === 0 && (
        <p className="text-gray-500 font-inter text-sm">No skills added yet</p>
      )}

      {isEditing && (
        <p className="text-xs text-gray-500 mt-3">
          Press Enter to add • Max 10 skills • Choose from suggestions
        </p>
      )}
    </div>
  );
}
