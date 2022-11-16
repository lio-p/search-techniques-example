import React, { useState, useEffect } from "react";
import { useSearchParams } from 'react-router-dom';
import {
    withSearch,
    ErrorBoundary,
    Facet,
    Results,
    PagingInfo,
    ResultsPerPage,
    Paging
} from "@elastic/react-search-ui";
import {
    useNavigate,
} from 'react-router-dom';
import { Layout, SingleLinksFacet } from "@elastic/react-search-ui-views";



const fetchDidYouMeanSuggestion = async (query) => {
    const response = await fetch('/api/suggest', {
        method: 'POST',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(query)
    })
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
}

function Result({ wasSearched, addFilter, totalResults, setSearchTerm }) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [suggestion, setSuggestion] = useState("")

    const navigateSuggest = (query) => {
        window.location.href = "/search?q=" + query;
    }


    useEffect(() => {
        
       
        if (searchParams.get('q')) {
            setSearchTerm(searchParams.get('q'))
            fetchDidYouMeanSuggestion({ query: searchParams.get('q') }).then(res => {
                setSuggestion(res.body?.suggest?.simple_phrase[0]?.options[0]?.text)
            })
                .catch(err => console.log(err));
        }
        if (searchParams.get('category')) {
            addFilter("department", [searchParams.get('category')], "all")
        }
    }, [searchParams]);

    return (
        wasSearched &&
        <div className="result">
            <ErrorBoundary>
                {totalResults == 0 && <span>No results to show{suggestion ? <>, did you mean <span style={{ cursor: "pointer", color: "blue" }} onClick={() => navigateSuggest(suggestion)}>{suggestion}</span>?</> : "."}</span>}

                <Layout
                    sideContent={
                        <div>
                            <Facet
                                field={"department"}
                                label="Category"
                                filterType="all"
                                isFilterable={true}
                            />
                            <Facet
                                field="rating"
                                label="Rating"
                                view={SingleLinksFacet}
                            />
                            <Facet
                                field="manufacturer"
                                label="Manufacturer"
                                isFilterable={true}
                            />
                            <Facet field="price" label="Price" filterType="any" />
                            <Facet field="shipping" label="Shipping" />
                        </div>
                    }
                    bodyContent={
                        <Results
                            // resultView={CustomResultView}
                            titleField="name"
                            urlField="url"
                            thumbnailField="image"
                            shouldTrackClickThrough={true}
                        />
                    }
                    bodyHeader={
                        <React.Fragment>
                            {wasSearched && <PagingInfo />}
                            {wasSearched && <ResultsPerPage />}
                        </React.Fragment>
                    }
                    bodyFooter={<Paging />}
                />
            </ErrorBoundary>
        </div>

    );
}

export default withSearch(({ wasSearched, addFilter, totalResults, setSearchTerm }) => ({
    wasSearched, addFilter, totalResults, setSearchTerm
}))(Result);
