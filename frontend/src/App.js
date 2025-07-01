import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import Methodology from "./components/Methodology";
import AIDemo from "./components/AIDemo";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import { Toaster } from "./components/ui/toaster";

// Navigation Component
const Navigation = () => {
  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">VT</span>
            </div>
            <span className="text-white font-bold text-lg">VERTEX TARGET</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection('services')} className="text-gray-300 hover:text-purple-400 transition-colors">
              Serviços
            </button>
            <button onClick={() => scrollToSection('portfolio')} className="text-gray-300 hover:text-purple-400 transition-colors">
              Portfólio
            </button>
            <button onClick={() => scrollToSection('methodology')} className="text-gray-300 hover:text-purple-400 transition-colors">
              Metodologia
            </button>
            <button onClick={() => scrollToSection('ai-demo')} className="text-gray-300 hover:text-purple-400 transition-colors">
              IA Demo
            </button>
            <button onClick={() => scrollToSection('contact')} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all">
              Contato
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Main Homepage Component
const Homepage = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <Hero />
      <Services />
      <Portfolio />
      <Methodology />
      <AIDemo />
      <Testimonials />
      <Contact />
    </div>
  );
};

// Main App Component
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;