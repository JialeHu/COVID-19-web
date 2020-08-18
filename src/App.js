import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
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
  const [isLoggedIn, setLoggedIn] = useState(false);

  function checkLoggedIn() {
    fetch("/isLoggedIn", {method: "POST"}).then(res => {
      console.log(res);
      console.log(res.json());
      if (res.status === 200) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
  }
  checkLoggedIn();

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} />

      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/doc">
          <Doc />
        </Route>
        <Route exact path="/signup">
          {isLoggedIn ? <Redirect to="/" /> : <Signup />}
        </Route>
        <Route exact path="/login">
          {isLoggedIn ? <Redirect to="/" /> : <Login />}
        </Route>
        <Route exact path="/account">
          {isLoggedIn ? <Account /> : <Redirect to="/" />}
        </Route>
        {/* <Route path="*" component={() => <Redirect to="/" />} /> */}
      </Switch>

      <Footer />
    </Router>
  );
}

export default App;
