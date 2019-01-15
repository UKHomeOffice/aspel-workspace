import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Index from './pages/index';
import Project from './pages/project';
import Section from './pages/section';

export default () => <BrowserRouter>
  <Switch>
    <Route path="/project/:id/:section/:step?" component={ Section } />
    <Route path="/project/:id" component={ Project } />
    <Route path="/" component={ Index } />
  </Switch>
</BrowserRouter>;
