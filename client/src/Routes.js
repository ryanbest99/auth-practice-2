import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Signup from "./pages/signup/Signup";

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <Route exact path="/signup" component={Signup} />
      </Switch>
    </Router>
  );
};

export default Routes;
