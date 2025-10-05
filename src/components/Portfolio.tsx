'use client';

import { useState } from 'react';

export default function Portfolio() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const projects = [
    { id: 1, title: "Commercial Plaza Sealcoating", image: "/images/project1.jpg" },
    { id: 2, title: "Shopping Center Line Striping Before", image: "/images/project2.jpg" },
    { id: 3, title: "Shopping Center Line Striping After", image: "/images/project3.jpg" },
    { id: 4, title: "ADA Handicap Striping", image: "/images/project4.jpg" },
    { id: 5, title: "Storage Facility Sealing & Striping Before", image: "/images/project5.jpg" },
    { id: 6, title: "Storage Facility Sealing & Striping After", image: "/images/project6.jpg" },
  ];

  return (
    <>
      <section id="portfolio" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-brand-navy">Portfolio</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            See our quality work and successful project completions
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition"
                onClick={() => setSelectedImage(project.image)}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-brand-navy bg-opacity-0 group-hover:bg-opacity-70 transition flex items-center justify-center">
                  <span className="text-white text-lg font-bold opacity-0 group-hover:opacity-100 transition">
                    View Project
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-3">
                  <p className="text-sm font-medium">{project.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              className="absolute top-4 right-4 text-white text-4xl font-bold hover:text-brand-gold transition z-10"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
            <img
              src={selectedImage}
              alt="Project"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
}
