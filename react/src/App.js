import './App.css';
import './styles.css';
import Autocomplete from './AutoComplete';
import movieList from './movieList';

/*
    <body>
      <div id="header">
        <h1>Movie Recommender System</h1>
        <h2>Enter a movie here..</h2>
      </div>
      <div id="content">
        <Autocomplete suggestions={movieList}/>
      </div>
    </body>
*/


function App() {
  return (
      <div id="doc" className="yui-t7">
        <div id="hd">
          <div id="header">
            <h1><a href="http://localhost:3000">Movie Recommender System</a></h1>
          </div>
        </div>
        <div id="bd">
          <div id="yui-main">
            <div className="yui-b">
              <div className="yui-g">
                <Autocomplete suggestions={movieList}/>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default App;
