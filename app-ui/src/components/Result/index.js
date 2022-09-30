import React, { useEffect } from "react";
import { useSearchParams } from 'react-router-dom';
import {
    withSearch,
    ErrorBoundary,
    Facet,
    Results,
    PagingInfo,
    ResultsPerPage,
    Paging,
    Sorting
} from "@elastic/react-search-ui";
import { Layout, SingleLinksFacet } from "@elastic/react-search-ui-views";

function Result({ wasSearched, addFilter }) {
    const [searchParams] = useSearchParams();
    useEffect(() => {
        if (searchParams.get('category')) addFilter("department", [searchParams.get('category')], "all")
    }, [searchParams]);

    return (
        <div className="result">
            <ErrorBoundary>
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

export default withSearch(({ wasSearched, addFilter }) => ({
    wasSearched, addFilter
}))(Result);
