import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold tracking-wide">
          Kero<span className="text-blue-500">.Devolper</span>
        </div>
        <div className="flex gap-6 text-sm font-medium text-gray-300">
          <a href="#about" className="hover:text-blue-500 transition">About</a>
          <a href="#skills" className="hover:text-blue-500 transition">Skills</a>
          <a href="#projects" className="hover:text-blue-500 transition">Projects</a>
          <a href="#contact" className="hover:text-blue-500 transition">Contact</a>
        </div>
      </div>
    </nav>
  );
};
const Hero = () => {
  return (
    <section id="about" className="bg-gray-900 text-white py-20 px-6 border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 text-center md:text-left">
          <span className="bg-amber-500/10 text-blue-500 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
             I hope to became a Frontend React Developer
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mt-4 mb-6 leading-tight">
  Engineering Scalable <br />
  <span className="text-blue-500">Web Architectures</span>
</h1>
          <p className="text-gray-400 text-lg mb-8 max-w-xl">
            Passionate about building responsive, high-performance web applications with React, Tailwind CSS, and REST APIs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a href="#projects" className="bg-blue-500 hover:bg-blue-600 text-gray-900 font-bold px-6 py-3 rounded-lg transition text-center">
              View Work
            </a>
            <a href="#contact" className="border border-gray-700 hover:border-amber-500 text-gray-300 px-6 py-3 rounded-lg font-medium transition text-center">
              Get In Touch
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="w-72 h-72 md:w-80 md:h-80 bg-gradient-to-tr from-blue-500 to-yellow-300 rounded-2xl rotate-3 p-2 shadow-2xl">
            <img 
              src="https://cdn.corenexis.com/f/MjoCJ4M7gt9.jpeg" 
              alt="Kero Profile" 
              className="w-full h-full object-cover rounded-xl -rotate-3 hover:rotate-0 transition duration-300"/>
          </div>
        </div>
      </div>
    </section>
  );
};
const Skills = () => {
  const skillList = [
    { name: 'React.js', level: 'Advanced' },
    { name: 'JavaScript (ES6+)', level: 'Advanced' },
    { name: 'Tailwind CSS', level: 'Intermediate' },
    { name: 'REST APIs & Axios', level: 'Intermediate' },
    { name: 'HTML5 / CSS3', level: 'Expert' },
    { name: 'Git & GitHub', level: 'Intermediate' },
    { name: 'Data Base', level: 'Intermediate' }
  ];
  return (
    <section id="skills" className="py-20 bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Technical Skills</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {skillList.map((skill, index) => (
            <div key={index} className="bg-gray-900 border border-gray-800 p-5 rounded-xl hover:border-blue-500/50 transition">
              <h3 className="font-bold text-lg mb-1">{skill.name}</h3>
              <p className="text-bule-500 text-xs font-semibold">{skill.level}</p>
            </div>
          ))}
        </div>
     </div>
    </section>
  );
};
const LiveProjects = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/posts?_limit=3')
      .then((res) => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <section id="projects" className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Featured Live Data</h2>
          <p className="text-gray-400 text-sm">Fetched dynamically via Axios from external REST API</p>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading projects...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post.id} className="bg-gray-950 border border-gray-800 p-6 rounded-xl flex flex-col justify-between hover:shadow-xl transition">
                <div>
                  <span className="text-blue-500 text-xs font-mono">API Item #{post.id}</span>
                  <h3 className="text-xl font-bold mt-2 mb-3 capitalize text-gray-100">{post.title.slice(0, 25)}...</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">{post.body}</p>
                </div>
                <button className="text-blue-500 font-semibold text-sm hover:underline text-left">
                  Explore Details &rarr;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
const ContactForm = () => {
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!msg) return;

    axios.post('https://jsonplaceholder.typicode.com/posts', { message: msg })
      .then(() => {
        setSent(true);
        setMsg('');
      });
  };

  return (
    <section id="contact" className="py-20 bg-gray-950 text-white border-t border-gray-800">
      <div className="max-w-xl mx-auto px-6 text-center">
       <h2 className="text-3xl font-bold mb-4 text-blue-500">Send a Message</h2>
        <p className="text-gray-400 text-sm mb-8">Let's build something awesome together!</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Write your message here..."
            className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-blue-500"
            rows="4"
          ></textarea>
          <button type="submit" className="w-full bg-blue-500 text-gray-900 font-bold py-3 rounded-xl hover:bg-blue-600 transition">
            Send Message
          </button>
        </form>

        {sent && <p className="mt-4 text-green-400 text-sm font-medium">Message sent successfully via Axios!</p>}
      </div>
    </section>
  );
};
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-500 text-center py-6 text-xs border-t border-gray-800">
      © 2026 Kero Built with React, Tailwind CSS & Axios.
    </footer>
  );
};
export default function App() {
  return (
    <div className="min-h-screen font-sans bg-gray-900 selection:bg-blue-500 selection:text-gray-900">
      <Navbar />
      <Hero />
      <Skills />
      <LiveProjects />
      <ContactForm />
      <Footer />
    </div>
  );
}
