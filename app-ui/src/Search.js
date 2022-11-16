import React from "react";
// import "@elastic/eui/dist/eui_theme_light.css";

import {
    SearchProvider,

} from "@elastic/react-search-ui";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import { config } from "./config";
import Navigation from "./components/Navigation";
import Result from "./components/Result";


export default function Search() {

    return (
        <React.Fragment>
            <Navigation />
            <SearchProvider config={config}>
                <Result />
            </SearchProvider>
        </React.Fragment>
    );
}
