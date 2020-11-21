import React, { useState, useEffect } from "react";
import algoliasearch from "algoliasearch/lite";
import {
  InstantSearch,
  Configure,
  Hits,
  connectSearchBox,
} from "react-instantsearch-dom";

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

  // const searchClient = algoliasearch(
  //   process.env.APP_KEY,
  //   process.env.SEARCH_ONLY_KEY
  // );

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
      {/* <input
        className="bg-gray-200 h-10 px-4  text-xs lg:text-lg w-full rounded-lg placeholder-gray-700 lg:-mt-1"
        type="text"
        placeholder="Macbook Pro 2020"
      />
      <span className="flex items-center absolute right-0 inset-y-0 mr-0 sm:mr-3 text-base">
        <i className="fa fa-search text-black" />
      </span> */}

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
