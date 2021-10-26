import React, { Component, Fragment } from "react";
import './styles.css'

const URL = "http://127.0.0.1:8000/movieapi/listSimilarMovies/"; //django service url

class Autocomplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: "",
      selectedMovie: "",
      similarMovies: [],
      links: [],
      showSimilars: false,
    };
  }

  async httpGet(name) {
    var movieName = name;
    var url = URL + movieName;

    fetch(url)
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      this.setState({
        activeSuggestion: 0,
        filteredSuggestions: [],
        showSuggestions: false,
        userInput: json.selectedMovie,
        selectedMovie: json.selectedMovie,
        similarMovies: json.similarMovies,
        links: json.links,
        showSimilars: true,
      });
    })
    .catch((error) => {
      console.error(error);
    });
    
  }


  onChange = e => {
    const { suggestions } = this.props;
    const userInput = e.currentTarget.value;

    const filteredSuggestions = suggestions.filter(
      suggestion =>
        suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );
  
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
      userInput: e.currentTarget.value,
      selectedMovie: "",
      similarMovies: [],
      links: [],
      showSimilars: false,
    });

  };

  onClick = e => {
    this.httpGet(e.currentTarget.innerText);
  };

  onKeyDown = e => {
    const { activeSuggestion, filteredSuggestions } = this.state;
  
    if (e.keyCode === 13) {
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: filteredSuggestions[activeSuggestion]
      });
    } else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }
      this.setState({ activeSuggestion: activeSuggestion - 1 });
    }
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }
      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }
  };

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput,
        selectedMovie,
        similarMovies,
        links,
        showSimilars,
      }
    } = this;
  
    let suggestionsListComponent;
  
    if (showSuggestions && userInput) {
        if (filteredSuggestions.length) {
          suggestionsListComponent = (
            <ul class="suggestions">
              {filteredSuggestions.map((suggestion, index) => {
                let className;
      
                // Flag the active suggestion with a class
                if (index === activeSuggestion) {
                  className = "suggestion-active";
                }
                return (
                  <li className={className} key={suggestion} onClick={onClick}>
                    {suggestion}
                  </li>
                );
              })}
            </ul>
          );
        } else {
          suggestionsListComponent = (
            <div class="no-suggestions">
              <em>No suggestions available.</em>
            </div>
          );
        }
    }

    let similarListComponent;

    if (showSimilars) {
      similarListComponent = (
        <div>
        <h2> {selectedMovie}</h2>
        <ul>
          {similarMovies.map((movie, index) => {
                    return (
                        <li key={movie}>
                            <a href={links[index]} target="_blank" rel="noreferrer">{movie}</a>
                        </li>
                    );
                })}
        </ul>
        </div>
      )
    }

    return (
        <Fragment>
          <div className="yui-u first">
            <div className="content">
              Enter a movie here..
              <input id='inputMovie' type="text" onChange={onChange} onKeyDown={onKeyDown} value={userInput}/>
              {suggestionsListComponent}
            </div>
          </div>
          <div className="yui-u">
            <div className="content">
              {similarListComponent}
            </div>
          </div>
        </Fragment>
      );
  }
}
  
export default Autocomplete;
