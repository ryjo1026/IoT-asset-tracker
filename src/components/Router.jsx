import React from 'react';
import {Switch, Route} from 'react-router-dom';

// Import all routed components
import Home from './Home.jsx';
import Register from './Register.jsx';

const Router = () => (
  <Switch>
    <Route exact path='/' component={Home}/>
    <Route exact path='/home' component={Home}/>
    <Route exact path='/register' component={Home}/>
    <Route exact path='/update' component={Home}/>
    <Route exact path='/search' component={Home}/>
    {/* TODO <Route component={404}/> */}
  </Switch>
);


export default Router;
