import React from 'react';
import {
  BrowserRouter as Router,
  Link,
  Route,
} from 'react-router-dom'
import Fib from './Fib'
import './App.css';
import { OtherPage } from './OtherPage'

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Welcome to Fib Calculator</h1>
          <div className="App-links">
            <Link to="/">Home</Link>
            <Link to="/otherpage">Other Page</Link>
          </div>
        </header>
        <div>
          <Route exact path="/" component={ Fib }/>
          <Route path="/otherpage" component={ OtherPage }/>
        </div>
      </div>
    </Router>
  );
}

export default App;
