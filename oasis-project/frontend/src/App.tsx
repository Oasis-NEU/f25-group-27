import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home.tsx';
import StreetViewApp from './pages/Game.tsx';
import './App.css'

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/game" element={<StreetViewApp/>}/>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App
