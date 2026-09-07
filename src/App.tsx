import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Header from "./components/Header";

const App: React.FC = () => {
  return (
    <div className="app-root">
      <Header />
    <main>
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
