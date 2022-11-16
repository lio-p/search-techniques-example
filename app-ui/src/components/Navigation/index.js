import { SearchProvider, SearchBox } from "@elastic/react-search-ui";
import { config } from "./config";
import React from "react";
import {
  useNavigate,
  createSearchParams,
} from 'react-router-dom';

function getDisplayField(suggestion, autocompleteSuggestions, suggestionType) {
  return suggestion.result[autocompleteSuggestions[suggestionType].displayField]?.raw;
}


function getCategoryField(suggestion, autocompleteSuggestions, suggestionType) {
  return suggestion.result[autocompleteSuggestions[suggestionType].categoryField]?.raw?.name;
}

function AutocompleteView({
  autocompleteSuggestions,
  autocompletedSuggestions,
  className,
  getItemProps,
  getMenuProps
}) {
  let index = 0;
  return (
    <div
      {...getMenuProps({
        className: ["sui-search-box__autocomplete-container", className].join(
          " "
        )
      })}
    >
      <div className="flex">
        {!!autocompleteSuggestions &&
          Object.entries(autocompletedSuggestions).map(
            ([suggestionType, suggestions]) => {
              return (
                <React.Fragment key={suggestionType}>
                  {suggestions.length > 0 && (
                    <ul className="sui-search-box__suggestion-list">
                      {suggestions.slice(0, 1).map((suggestion) => {
                        index++;
                        const suggestionValue = getDisplayField(suggestion, autocompleteSuggestions, suggestionType)
                        const suggestionScope = getCategoryField(suggestion, autocompleteSuggestions, suggestionType)
                        return (
                          <li
                            {...getItemProps({
                              key: suggestionValue,
                              index: index - 1,
                              item: {
                                suggestion: suggestionValue,
                                ...suggestion.result
                              }
                            })}
                          >
                            <span>{suggestionValue}</span>
                            <ul><span style={{ marginLeft: "20px" }}>in {suggestionScope}</span></ul>
                          </li>
                        );
                      })}
                      {suggestions.slice(1).map((suggestion) => {
                        index++;
                        const suggestionValue = getDisplayField(suggestion, autocompleteSuggestions, suggestionType)

                        return (
                          <li
                            {...getItemProps({
                              key: suggestionValue,
                              index: index - 1,
                              item: {
                                suggestion: suggestionValue
                              }
                            })}
                            data-transaction-name="query suggestion"
                          >
                            <span>{suggestionValue}</span>
                          </li>
                        );


                      })}
                    </ul>
                  )}
                </React.Fragment>
              );
            }
          )}
      </div>
    </div>
  );
}

function Navigation(props) {
  const navigate = useNavigate();
  return (
    <div className="navigation">

      <SearchProvider
        config={{
          ...config,
          trackUrlState: true
        }}
      >
        <div className="flex-auto py-2 flex justify-self-start">
          <SearchBox
            onSelectAutocomplete={(suggestion, config, defaultHandler) => {
              // eslint-disable-next-line
              if (suggestion.category?.raw?.name)
                window.location.href = "/search?q=" + suggestion.name.raw + "&category=" + suggestion.category.raw.name; 
              else 
                window.location.href = "/search?q=" + suggestion.name.raw
            }}
            onSubmit={(searchTerm) => {
              // eslint-disable-next-line no-debugger
              window.location.href = "/search?q=" + searchTerm
            }}

            autocompleteSuggestions={{
              popularQueries: {
                sectionTitle: "Popular queries",
                queryType: "results",
                displayField: "name",
                categoryField: "category"
              }
            }}
            autocompleteView={AutocompleteView}
          />
        </div>
      </SearchProvider>
    </div>

  );
}

export default Navigation;
