import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './components/AdminDashboard';
import AdminPortfolio from './components/AdminPortfolio';
import AdminTestimonials from './components/AdminTestimonials';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const helloWorldApi = async () => {
    try {
      const response = await axios.get(`${API}/`);
      console.log(response.data.message);
    } catch (e) {
      console.error(e, `errored out requesting / api`);
    }
  };

  useEffect(() => {
    helloWorldApi();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center px-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <img 
              src="https://avatars.githubusercontent.com/in/1201222?s=120&u=2686cf91179bbafbc7a71bfbc43004cf9ae1acea&v=4" 
              alt="VertexTarget Logo"
              className="w-20 h-20 mx-auto rounded-full shadow-lg"
            />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            VertexTarget
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Portfolio & Testimonials Management Platform
          </p>
          
          <div className="space-y-4">
            <Link
              to="/admin"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              Acessar Admin Dashboard
            </Link>
            
            <p className="text-sm text-gray-500">
              Gerencie seus projetos e depoimentos de clientes
            </p>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-400">
              Sistema funcionando perfeitamente ✅
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="portfolio" element={<AdminPortfolio />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
