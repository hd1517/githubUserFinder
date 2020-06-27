import React, { useReducer } from 'react';
import axios from 'axios';
import GithubContext from './githubContext';
import GithubReducer from './githubReducer';
import {
  SEARCH_USERS,
  SET_LOADING,
  CLEAR_USERS,
  GET_USER,
  GET_REPOS,
  SET_ALERT,
} from '../types';

const github = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 1000,
  headers: { Authorization: process.env.REACT_APP_GITHUB_TOKEN },
});

const GithubState = (props) => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false,
    alert: null,
  };

  const [state, dispatch] = useReducer(GithubReducer, initialState);

  // Search Github users
  const searchUsers = (text) => {
    state.alert !== null && dispatch({ type: SET_ALERT, payload: null });
    setLoading();
    github.get(`/search/users?q=${text}`).then((res) => {
      if (res.data.items.length === 0) {
        dispatch({
          type: SET_ALERT,
          payload: { msg: 'No user found with this name', type: 'light' },
        });
      } else {
        dispatch({
          type: SEARCH_USERS,
          payload: res.data.items,
        });
      }
    });
  };

  // Get Github user details
  const getUser = (username) => {
    setLoading();
    github.get(`/users/${username}`).then((res) => {
      dispatch({
        type: GET_USER,
        payload: res.data,
      });
    });
  };

  // Get users repo
  const getUserRepos = (username) => {
    setLoading();
    github
      .get(`/users/${username}/repos?per_page=5&sort=created:asc?`)
      .then((res) => {
        dispatch({
          type: GET_REPOS,
          payload: res.data,
        });
      });
  };

  // Set Alert
  const setAlert = (msg, type) => {
    dispatch({
      type: SET_ALERT,
      payload: { msg, type },
    });
  };

  // Clear users from state
  const clearUsers = () => dispatch({ type: CLEAR_USERS });

  // Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        user: state.user,
        repos: state.repos,
        loading: state.loading,
        alert: state.alert,
        searchUsers,
        getUser,
        getUserRepos,
        clearUsers,
        setAlert,
      }}
    >
      {props.children}
    </GithubContext.Provider>
  );
};

export default GithubState;
