import React, { useState } from "react";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch, Configure } from "react-instantsearch-dom";

import { useHistory } from "react-router-dom";

import AutoComplete from "./AutoComplete";

const Search = () => {
  const history = useHistory();

  const algoliaClient = algoliasearch(
    process.env.APP_KEY,
    process.env.SEARCH_ONLY_KEY,
    {
      _useRequestCache: true,
    }
  );

  const searchClient = {
    search(requests) {
      const shouldSearch = requests.some(
        ({ params: { query } }) => query !== ""
      );
      if (shouldSearch) {
        return algoliaClient.search(requests);
      }
      return Promise.resolve({
        results: [{ hits: [] }],
      });
    },
    searchForFacetValues: algoliaClient.searchForFacetValues,
  };

  const [query, setQuery] = useState("");

  const onSuggestionSelected = (e, { suggestion }) => {
    if (e.key === "Enter") {
      const path = `/posts/${suggestion.objectID}`;
      setQuery("");
      history.push(path);
    }
  };

  const onSuggestionCleared = () => {
    setQuery("");
  };

  return (
    <>
      <InstantSearch
        indexName={process.env.INDEX_NAME}
        searchClient={searchClient}
      >
        <Configure hitsPerPage={5} />

        <AutoComplete
          onSuggestionSelected={onSuggestionSelected}
          onSuggestionCleared={onSuggestionCleared}
          query={query}
        />
      </InstantSearch>
    </>
  );
};

export default Search;
