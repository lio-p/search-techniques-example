import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";

const connector = new ElasticsearchAPIConnector({
  apiKey: "VnZkVWlZTUJGMkt4RzY4TTk3LVo6ZjcwaFg5UXVRQS1VUVJnc1B3XzR6dw==",
  cloud: {
    id: "test-blog:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvOjQ0MyRjNzQ4ZWVjNTFjNjU0NDhhYmQzYmY2Nzc3NTA2YjUyOCQ4YWUwMTM3NjkyMjA0NzA0YmI2MzEwMWMzMjk2Njk2Ng=="
  },
  index: "search-products"
});

export const config = {
  alwaysSearchOnInitialLoad: false,
  trackUrlState: false,
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
