import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Header from "./components/Header";

const App: React.FC = () => {
  return (
    <div className="app-root">
      <Header />
    <main className="container">
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="*" element={<NotFound />} />
    </Routes>


     </main>


  );
};

export default App;
