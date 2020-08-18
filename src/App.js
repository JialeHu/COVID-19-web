import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Doc from "./pages/Doc";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";

function App() {
  const [isLoggedin, setLoggedin] = useState(false);

  function checkLoggedIn(setLoggedin) {
    fetch("/isLoggedIn", {method: "POST"}).then(res => {
      if (res.status === 200) {
        setLoggedin(true);
      } else {
        setLoggedin(false);
      }
    });
  }
  checkLoggedIn(setLoggedin);

  return (
    <Router>
      <Header loggedin={isLoggedin} />

      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/doc">
          <Doc />
        </Route>
        <Route exact path="/signup">
          {isLoggedin ? <Redirect to="/" /> : <Signup />}
        </Route>
        <Route exact path="/login">
          {isLoggedin ? <Redirect to="/" /> : <Login />}
        </Route>
        <Route exact path="/account">
          {isLoggedin ? <Account /> : <Redirect to="/" />}
        </Route>
        {/* <Route path="*" component={() => <Redirect to="/" />} /> */}
      </Switch>

      <Footer />
    </Router>
  );
}

export default App;
