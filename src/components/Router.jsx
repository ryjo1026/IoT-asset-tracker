import React from 'react';
import {Switch, Route} from 'react-router-dom';

// Import all routed components
import Home from './Home.jsx';

const Router = () => (
  <router>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route exact path='/test' component={Home}/>
      {/* TODO <Route component={404}/> */}
    </Switch>
  </router>
);


export default Router;
