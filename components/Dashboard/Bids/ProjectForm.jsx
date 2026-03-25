// components/Dashboard/ProjectForm.jsx
"use client";

import { useState } from "react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

const categories = [
  "Web Development",
  "Mobile App",
  "UI/UX Design",
  "Backend/API",
  "Database",
  "DevOps",
  "AI/ML",
  "Blockchain",
  "Other",
];

const timelines = [
  "Less than 1 week",
  "1-2 weeks",
  "2-4 weeks",
  "1-2 months",
  "2+ months",
];

const experienceLevels = ["Beginner", "Intermediate", "Expert"];

const projectTypes = [
  "One-time project",
  "Ongoing collaboration",
  "Contract to hire",
];

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
  "Flutter",
  "Swift",
  "Kotlin",
  "Figma",
  "Adobe XD",
];

export default function ProjectForm({
  onSubmit,
  loading,
  initialData = null,
  isEdit = false,
}) {
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      description: "",
      category: "Web Development",
      skills: [],
      budgetType: "fixed",
      budgetMin: "",
      budgetMax: "",
      hourlyRate: "",
      timeline: "2-4 weeks",
      requirements: [""],
      deliverables: [""],
      experienceLevel: "Intermediate",
      projectType: "One-time project",
      visibility: "public",
    },
  );

  const [errors, setErrors] = useState({});
  const [newSkill, setNewSkill] = useState("");
  const [newRequirement, setNewRequirement] = useState("");
  const [newDeliverable, setNewDeliverable] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const addSkill = (skill) => {
    if (
      skill &&
      !formData.skills.includes(skill) &&
      formData.skills.length < 10
    ) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
    }
    setNewSkill("");
  };

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()],
      }));
      setNewRequirement("");
    }
  };

  const removeRequirement = (index) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const addDeliverable = () => {
    if (newDeliverable.trim()) {
      setFormData((prev) => ({
        ...prev,
        deliverables: [...prev.deliverables, newDeliverable.trim()],
      }));
      setNewDeliverable("");
    }
  };

  const removeDeliverable = (index) => {
    setFormData((prev) => ({
      ...prev,
      deliverables: prev.deliverables.filter((_, i) => i !== index),
    }));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill(newSkill.trim());
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (formData.title.length < 5)
      newErrors.title = "Title must be at least 5 characters";

    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (formData.description.length < 20)
      newErrors.description = "Description must be at least 20 characters";

    if (!formData.budgetMin || formData.budgetMin < 1000)
      newErrors.budgetMin = "Minimum budget must be at least ₹1,000";
    if (!formData.budgetMax || formData.budgetMax < formData.budgetMin)
      newErrors.budgetMax = "Maximum budget must be greater than minimum";

    if (
      formData.budgetType === "hourly" &&
      (!formData.hourlyRate || formData.hourlyRate < 100)
    ) {
      newErrors.hourlyRate = "Hourly rate must be at least ₹100";
    }

    if (formData.skills.length === 0)
      newErrors.skills = "At least one skill is required";
    if (formData.requirements.filter((r) => r.trim()).length === 0)
      newErrors.requirements = "At least one requirement is needed";
    if (formData.deliverables.filter((d) => d.trim()).length === 0)
      newErrors.deliverables = "At least one deliverable is needed";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      // 🔹 Transform formData to match backend expectations
      const payload = {
        // Basic fields
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        skills: formData.skills,

        // 💰 CRITICAL: Convert budget to single NUMBER field
        budget:
          formData.budgetType === "fixed"
            ? Number(formData.budgetMin) // Use min budget for fixed-price
            : Number(formData.hourlyRate), // Use hourly rate for hourly

        // Optional metadata (keep for frontend, backend can ignore)
        budgetType: formData.budgetType,
        budgetRange:
          formData.budgetType === "fixed"
            ? {
                min: Number(formData.budgetMin),
                max: Number(formData.budgetMax),
              }
            : undefined,

        // Other fields
        timeline: formData.timeline,
        requirements: formData.requirements.filter((r) => r.trim()),
        deliverables: formData.deliverables.filter((d) => d.trim()),
        experienceLevel: formData.experienceLevel,
        projectType: formData.projectType,
        visibility: formData.visibility,
        deadline: formData.deadline || null, // If you add a date picker later
      };

      console.log("📤 Final payload to backend:", payload); // 🔍 Debug
      onSubmit(payload);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-2xl p-8 space-y-8"
    >
      {/* Basic Information */}
      <div>
        <h3 className="font-poppins font-semibold text-gray-900 text-lg mb-4">
          Basic Information
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., E-commerce Website with Payment Gateway"
              className={`w-full px-4 py-3 text-black bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-inter ${errors.title ? "border-red-300" : "border-gray-200"}`}
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Describe your project in detail..."
              className={`w-full px-4 py-3 text-black bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-inter resize-none ${errors.description ? "border-red-300" : "border-gray-200"}`}
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 text-black py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-inter"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div>
        <h3 className="font-poppins font-semibold text-gray-900 text-lg mb-4">
          Required Skills *
        </h3>

        <div className="flex flex-wrap gap-2 mb-3">
          {formData.skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex text-black items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-900 rounded-xl text-sm"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="hover:bg-gray-200 text-black rounded-full p-0.5"
              >
                <XMarkIcon className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>

        {formData.skills.length < 10 && (
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              placeholder="Add skill..."
              className="flex-1 text-black px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-inter text-sm"
              list="skill-suggestions"
            />
            <button
              type="button"
              onClick={() => addSkill(newSkill.trim())}
              className="px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-white hover:text-gray-900 border-2 border-gray-900 transition-all"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
        )}

        <datalist id="skill-suggestions">
          {predefinedSkills
            .filter((s) => !formData.skills.includes(s))
            .map((skill) => (
              <option key={skill} value={skill} />
            ))}
        </datalist>

        {errors.skills && (
          <p className="text-red-600 text-sm mt-1">{errors.skills}</p>
        )}
      </div>

      {/* Budget & Timeline */}
      <div>
        <h3 className="font-poppins font-semibold text-gray-900 text-lg mb-4">
          Budget & Timeline
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget Type *
            </label>
            <select
              name="budgetType"
              value={formData.budgetType}
              onChange={handleChange}
              className="w-full px-4 text-black py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-inter"
            >
              <option value="fixed">Fixed Price</option>
              <option value="hourly">Hourly Rate</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeline *
            </label>
            <select
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              className="w-full text-black px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-inter"
            >
              {timelines.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {formData.budgetType === "fixed" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Budget (₹) *
              </label>
              <input
                type="number"
                name="budgetMin"
                value={formData.budgetMin}
                onChange={handleChange}
                placeholder="1000"
                min="1000"
                className={`w-full text-black px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-inter ${errors.budgetMin ? "border-red-300" : "border-gray-200"}`}
              />
              {errors.budgetMin && (
                <p className="text-red-600 text-sm mt-1">{errors.budgetMin}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Budget (₹) *
              </label>
              <input
                type="number"
                name="budgetMax"
                value={formData.budgetMax}
                onChange={handleChange}
                placeholder="50000"
                min="1000"
                className={`w-full text-black px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-inter ${errors.budgetMax ? "border-red-300" : "border-gray-200"}`}
              />
              {errors.budgetMax && (
                <p className="text-red-600 text-sm mt-1">{errors.budgetMax}</p>
              )}
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hourly Rate (₹) *
            </label>
            <input
              type="number"
              name="hourlyRate"
              value={formData.hourlyRate}
              onChange={handleChange}
              placeholder="500"
              min="100"
              className={`w-full text-black px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-inter ${errors.hourlyRate ? "border-red-300" : "border-gray-200"}`}
            />
            {errors.hourlyRate && (
              <p className="text-red-600 text-sm mt-1">{errors.hourlyRate}</p>
            )}
          </div>
        )}
      </div>

      {/* Requirements */}
      <div>
        <h3 className="font-poppins font-semibold text-gray-900 text-lg mb-4">
          Requirements *
        </h3>

        <div className="space-y-2 mb-3">
          {formData.requirements.map((req, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full flex-shrink-0" />
              <span className="flex-1 text-gray-600 font-inter">{req}</span>
              <button
                type="button"
                onClick={() => removeRequirement(index)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <XMarkIcon className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newRequirement}
            onChange={(e) => setNewRequirement(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addRequirement())
            }
            placeholder="Add a requirement..."
            className="flex-1 text-black px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-inter text-sm"
          />
          <button
            type="button"
            onClick={addRequirement}
            className="px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-white hover:text-gray-900 border-2 border-gray-900 transition-all"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>

        {errors.requirements && (
          <p className="text-red-600 text-sm mt-1">{errors.requirements}</p>
        )}
      </div>

      {/* Deliverables */}
      <div>
        <h3 className="font-poppins font-semibold text-gray-900 text-lg mb-4">
          Deliverables *
        </h3>

        <div className="space-y-2 mb-3">
          {formData.deliverables.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gray-900 rounded-full flex-shrink-0" />
              <span className="flex-1 text-gray-600 font-inter">{item}</span>
              <button
                type="button"
                onClick={() => removeDeliverable(index)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <XMarkIcon className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newDeliverable}
            onChange={(e) => setNewDeliverable(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addDeliverable())
            }
            placeholder="Add a deliverable..."
            className="flex-1 text-black px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-inter text-sm"
          />
          <button
            type="button"
            onClick={addDeliverable}
            className="px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-white hover:text-gray-900 border-2 border-gray-900 transition-all"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>

        {errors.deliverables && (
          <p className="text-red-600 text-sm mt-1">{errors.deliverables}</p>
        )}
      </div>

      {/* Experience Level & Project Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Experience Level *
          </label>
          <select
            name="experienceLevel"
            value={formData.experienceLevel}
            onChange={handleChange}
            className="w-full text-black px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-inter"
          >
            {experienceLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Type *
          </label>
          <select
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
            className="w-full text-black px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-inter"
          >
            {projectTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Visibility */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Visibility
        </label>
        <select
          name="visibility"
          value={formData.visibility}
          onChange={handleChange}
          className="w-full text-black px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-inter"
        >
          <option value="public">Public (Visible to all developers)</option>
          <option value="private">Private (Invite only)</option>
        </select>
      </div>

      {/* Submit Button */}
      <div className="pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gray-900 text-white rounded-xl font-poppins font-medium hover:bg-white hover:text-gray-900 border-2 border-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? isEdit
              ? "Updating..."
              : "Posting..."
            : isEdit
              ? "Update Project"
              : "Post Project"}
        </button>
      </div>
    </form>
  );
}
