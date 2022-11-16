import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";
import React from "react";
import Search from "./Search";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import Navigation from "./components/Navigation";

export default function App() {
  return (
    <Router>
      <div>


        <Routes>
          <Route path="/search" element={<Search />} />
          <Route path="/" element={<Navigation />} />
        </Routes>
      </div>
    </Router>
  );
}