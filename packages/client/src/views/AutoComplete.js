import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Highlight, connectAutoComplete } from "react-instantsearch-dom";
import AutoSuggest from "react-autosuggest";
import PropTypes from "prop-types";

const AutoComplete = (props) => {
  console.log({ query: props.query });
  const { currentRefinement, hits, onSuggestionSelected } = props;
  const [value, setValue] = useState(currentRefinement);

  const onChange = (_, { newValue }) => {
    if (!newValue) props.onSuggestionCleared();
    setValue(newValue);
  };

  const onSuggestionsFetchRequested = ({ value: v }) => {
    props.refine(v);
  };

  const onSuggestionsClearRequested = () => {
    props.refine();
  };

  const getSuggestionValue = (hit) => {
    //  Todo price might be added
    return hit.title;
  };

  const renderSuggestion = (hit) => {
    return (
      <Link to={`/posts/${hit.objectID}`}>
        <Highlight attribute="title" hit={hit} tagName="mark" />
      </Link>
    );
  };

  const inputProps = {
    placeholder: "Search for a book...",
    onChange,
    value,
  };

  return (
    <AutoSuggest
      suggestions={hits}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      onSuggestionSelected={onSuggestionSelected}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
    />
  );
};

AutoComplete.propTypes = {
  hits: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentRefinement: PropTypes.string.isRequired,
  refine: PropTypes.func.isRequired,
  onSuggestionSelected: PropTypes.func.isRequired,
  onSuggestionCleared: PropTypes.func.isRequired,
};

export default connectAutoComplete(AutoComplete);
