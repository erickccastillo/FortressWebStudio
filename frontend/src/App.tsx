import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Header from "./components/Header";

const App: React.FC = () => {
  return (
    // Agregamos flex y flex-col para que el Header y el Main se acomoden bien
    <div className="flex flex-col min-h-screen w-full bg-[#050810]">
      <Header />
      
      {/* Quitamos la altura fija y el overflow interno */}
      <main className="flex-grow w-full custom-scroll">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;