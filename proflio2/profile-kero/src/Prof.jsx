import React from "react";

const Prof = () => {
  const projects = [
    {
      title: "E-Commerce App",
      desc: "Fully responsive online store built with React and Tailwind CSS featuring a functional cart system.",
      tech: ["React", "Tailwind CSS", "JavaScript"],
      link: "#"
    },
    {
      title: "Weather Dashboard",
      desc: "Real-time weather application displaying forecasts using live weather API integration.",
      tech: ["React", "REST API", "CSS3"],
      link: "#"
    },
    {
      title: "Admin Dashboard",
      desc: "Modern and clean analytical dashboard interface for managing users and data visualization.",
      tech: ["React", "Tailwind CSS", "Vite"],
      link: "#"
    }
  ];
  const skills = [
    "React.js", 
    "JavaScript (ES6+)", 
    "Tailwind CSS", 
    "HTML5 / CSS3", 
    "Git & GitHub", 
    "REST APIs", 
    "Responsive Design",
    "Vite"
  ];
  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8">

          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Build Modern Websites{" "}
              <span className="text-blue-600">Faster</span>
            </h1>

            <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto md:mx-0">
              Learn React and Tailwind CSS step by step and create beautiful,
              responsive websites with ease.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition">
                Get Started
              </button>

              <button className="border border-gray-300 hover:border-blue-600 hover:text-amber-600 px-6 py-3 rounded-lg font-medium transition">
                Learn More
              </button>
            </div>
          </div>


          <div className="flex justify-center md:flex-1">
            <div className="w-80 h-80 bg-amber-100 rounded-2xl shadow-lg p-6">
              <img
                src="https://cdn.corenexis.com/f/MjoCJ4M7gt9.jpeg"
                alt="Profile"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>

        </div>
      </section>
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Technologies & Skills</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {skills.map((skill, index) => (
              <span key={index} className="bg-amber-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition duration-300 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{project.desc}</p>
                <div className="flex gap-2 flex-wrap mb-6">
                  {project.tech.map((t, i) => (
                    <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <a href={project.link} className="text-blue-600 font-semibold text-sm hover:underline inline-flex items-center gap-1">
                View Project &rarr;
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Prof;