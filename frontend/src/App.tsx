import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';
import { Layout } from "./components/Layout";
import { LoadingScreen } from "./components/LoadingScreen";
import { Dashboard } from "./pages/Dashboard";
import { Workflows } from "./pages/Workflows";
import { GraphView } from "./pages/GraphView";
import { Logs } from "./pages/Logs";
import { Analytics } from "./pages/Analytics";
import { Settings } from "./pages/Settings";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/workflows" element={<Workflows />} />
          <Route path="/graph" element={<GraphView />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}


export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hackathon demo artificial dramatic boot sequence
    const timer = setTimeout(() => setLoading(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <div className="dark">
        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingScreen key="loading" />
          ) : (
            <AnimatedRoutes key="app" />
          )}
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}
