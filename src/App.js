import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import User from './components/users/User';
import Search from './components/users/Search';
import Alert from './components/layout/Alert';
import About from './components/pages/About';
import axios from 'axios';
import './App.css';

class App extends Component {
  state = {
    users: [],
    user: {},
    loading: false,
    alert: null,
  };

  // Search Github users
  searchUsers = (text) => {
    this.state.alert !== null && this.setState({ alert: null });
    this.setState({ loading: true });
    axios
      .get(
        `https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
      )
      .then((res) => {
        this.setState({ users: res.data.items, loading: false });
      });
  };

  // Get Github user details
  getUser = (username) => {
    this.setState({ loading: true });
    axios
      .get(
        `https://api.github.com/users/${username}?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
      )
      .then((res) => {
        this.setState({ user: res.data, loading: false });
      });
  };

  // Clear users from state
  clearUsers = () => this.setState({ users: [], loading: false });

  // Set alert if no characters entered in search input
  setAlert = (msg, type) => {
    this.setState({ alert: { msg, type } });
  };

  render() {
    const { users, user, loading } = this.state;

    return (
      <Router>
        <div className='App'>
          <Navbar />
          <div className='container'>
            <Alert alert={this.state.alert} />
            <Switch>
              <Route
                exact
                path='/'
                render={(props) => {
                  return (
                    <Fragment>
                      <Search
                        searchUsers={this.searchUsers}
                        clearUsers={this.clearUsers}
                        showClear={users.length > 0 ? true : false}
                        setAlert={this.setAlert}
                      />
                      <Users loading={loading} users={users} />
                    </Fragment>
                  );
                }}
              />
              <Route exact path='/about' component={About} />
              <Route
                exact
                path='/user/:login'
                render={(props) => {
                  return (
                    <User
                      {...props}
                      getUser={this.getUser}
                      user={user}
                      loading={loading}
                    />
                  );
                }}
              />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
