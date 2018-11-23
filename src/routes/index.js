import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';


import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';

export const renderRoutes = () => {
  return (
    <Router>
      <Switch>
        <Route exact path='/' render={ props => <AppRoute Component={Login} props={props} /> } />
        <Route exact path='/dashboard' render={ props => <AppRoute Component={Dashboard} props={props} />} />
      </Switch>
    </Router>
  )
}

const AppRoute = ({ Component, Layout, props }) => {
  if (Layout) {
    return (
      <Layout {...props}>
        <Component {...props} />
      </Layout>
    );
  } else if (!Component) {
    return <Layout {...props} />;
  } else {
    return <Component {...props} />;
  }
};
