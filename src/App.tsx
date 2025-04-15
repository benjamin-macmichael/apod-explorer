import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Apod from './components/Apod/Apod';
import SearchApod from './components/SearchApod/SearchApod';
import NASA_News_All from './components/NewsCardsAll/NewsCardsAll';
import Navbar from './components/Navbar/Navbar';

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Apod />} />
        <Route path="search" element={<SearchApod />} />
        <Route path="news-all" element={<NASA_News_All />} />
      </Route>
    </Routes>
  );
}

export default App;
