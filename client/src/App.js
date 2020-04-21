import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect,
} from "react-router-dom";

import UserList from "./components/UserList";
import LoginForm from "./components/LoginForm";
import "./App.scss";

function App() {
  return (
    <Router>
      <main className="App">
        <Switch>
          <Route exact path="/users" component={UserList} />
          <Route exact path="/register" component={LoginForm} />
          <Route exact path="/login" component={LoginForm} />
          <Redirect to="/login" />
        </Switch>
      </main>
    </Router>
  );
}

export default App;
