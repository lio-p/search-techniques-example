import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";
import React from "react";
import Search from "./Search";
import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  SearchBox,
  Results,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting,
  WithSearch
} from "@elastic/react-search-ui";
import {
  BooleanFacet,
  Layout,
  SingleLinksFacet,
  SingleSelectFacet
} from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import Navigation from "./components/Navigation";


const connector = new AppSearchAPIConnector({
  searchKey: "search-7zo9g4e7rws2hcypfb7s5em4",
  engineName: "products",
  endpointBase: "https://test-blog.ent.us-central1.gcp.cloud.es.io:9243"
});

const config = {
  alwaysSearchOnInitialLoad: true,
  apiConnector: connector,
  hasA11yNotifications: true,
  searchQuery: {
    result_fields: {
      name: { raw: {} }
    },
    search_fields: {
      name: {}
    },
    disjunctiveFacets: [""],
    facets: {}
  }
};

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