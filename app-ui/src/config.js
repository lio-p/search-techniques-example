import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";

const connector = new AppSearchAPIConnector({
  searchKey:
    process.env.REACT_APP_AS_SEARCH_KEY,
  engineName: process.env.REACT_APP_SEARCH_ENGINE_NAME || "products",
  endpointBase:
    process.env.REACT_APP_AS_URL,
});

export const config = {
  alwaysSearchOnInitialLoad: false,
  trackUrlState: false,
  debug: true,
  searchQuery: {
    search_fields: {
      // specify the fields you want to search on
      name: {}
    },
    result_fields: {
      name: {
        raw: {},
        snippet: {
          size: 100,
          fallback: true
        }
      },
      image: { raw: {} },
      price: { raw: {} },
     
      manufacturer: { raw: {} },
      department: { raw: {} },
      
      description: {
        raw: {},
        snippet: {
          size: 1000,
          fallback: true
        }
      }
     
    },
    facets: {
      department: {
        type: "value",
        size: 250
      },
      price_discount: { type: "value" },
      rating: {
        type: "range",
        ranges: [
          { from: 1, name: "★☆☆☆☆ & Up" },
          { from: 2, name: "★★☆☆☆ & Up" },
          { from: 3, name: "★★★☆☆ & Up" },
          { from: 4, name: "★★★★☆ & Up" },
          { from: 5, name: "★★★★★" }
        ]
      },
      price: {
        type: "range",
        ranges: [
          { from: 0, to: 25, name: "Under $25" },
          { from: 25, to: 50, name: "$25 to $50" },
          { from: 50, to: 100, name: "$50 to $100" },
          { from: 100, to: 200, name: "$100 to $200" },
          { from: 200, name: "$200 & Above" }
        ]
      },
      shipping: {
        type: "range",
        ranges: [{ to: 0.01, name: "Free shipping" }]
      },
     
    }
    
  },
  autocompleteQuery: {
    results: {
      resultsPerPage: 5,
      result_fields: {
        name: {
          snippet: {
            size: 100,
            fallback: true
          }
        }
        
      }
    },
    suggestions: {
      types: {
        documents: {
          fields: ["name", "description"]
        }
      },
      size: 5
    }
  },
  apiConnector: connector
};

export const SORT_OPTIONS = [
  {
    name: "Relevance",
    value: []
  },
  {
    name: "Price: Low to High",
    value: [
      {
        field: "price",
        direction: "asc"
      }
    ]
  },
  {
    name: "Price: High to Low",
    value: [
      {
        field: "price",
        direction: "desc"
      }
    ]
  },
  {
    name: "Rating",
    value: [
      {
        field: "rating",
        direction: "desc"
      }
    ]
  }
];
