import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";

const connector = new ElasticsearchAPIConnector({
  apiKey: process.env.REACT_APP_ES_API_KEY,
  cloud: {
    id:  process.env.REACT_APP_CLOUD_ID
  },
  index: "search-products"
});

export const config = {
  debug: false,
  alwaysSearchOnInitialLoad: false,
  trackUrlState: true,
  autocompleteQuery: {
    results: {
      resultsPerPage: 5,
      result_fields: {
        // specify the fields you want from the index to display the results
        image: { raw: {} },
        name: { snippet: { size: 100, fallback: true } },
        url: { raw: {} }
      },
      search_fields: {
        // specify the fields you want to search on
        name: {}
      }
    },
    suggestions: {
      types: {
        popularQueries: {
          search_fields: {
            "name.suggest": {} // fields used to query
          },
          result_fields: {
            name: {
              raw: {}
            },
            "category.name": {
              raw: {}
            }
          },
          index: "suggest",
          queryType: "results"
        }
      },
      size: 5
    }
  },
  apiConnector: connector
};
