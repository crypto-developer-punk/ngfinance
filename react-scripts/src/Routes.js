/**
 * Caution: Consider this file when using react-scripts
 * 
 * You may delete this file and its occurrences from the project filesystem if you are using GatsbyJS or NextJS version
 */
import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import WithLayout from 'WithLayout';
import {Main as MainLayout, Minimal as MinimalLayout} from './layouts';

import {StakingApp, NostalgiaIndex, NotFoundCover as NotFoundCoverView, RewardApp, OpenSaleApp, NFTApp} from './views';

const Routes = () => {

  return (
    <Switch>
      <Route
        exact
        path="/"
        render={matchProps => (
          <WithLayout
            {...matchProps}
            component={NostalgiaIndex}
            layout={MainLayout}
          />
        )}
      />
        <Route
            exact
            path="/index"
            render={matchProps => (
                <WithLayout
                  {...matchProps}
                  component={NostalgiaIndex}
                  layout={MainLayout}
                />
            )}
        />
        <Route 
          exact
          path="/opensale"
          render={matchProps=>(
            <WithLayout
              {...matchProps}
              component={OpenSaleApp}
              layout={MainLayout}
            />
          )}
        />
        <Route
          exact
          path="/app"
          render={matchProps => (
              <WithLayout
                {...matchProps}
                component={NFTApp}
                layout={MainLayout}
              />
          )}
        />        
        <Route
          exact
          path="/staking"
          render={matchProps => (
              <WithLayout
                {...matchProps}
                component={StakingApp}
                layout={MainLayout}
              />
          )}
        />
        <Route
          exact
          path="/reward"
          render={matchProps=>(
            <WithLayout 
              {...matchProps}
              component={RewardApp}
              layout={MainLayout}
            />
          )}
        />
        <Route
          exact
          path="/not-found-cover"
          render={matchProps => (
            <WithLayout
              {...matchProps}
              component={NotFoundCoverView}
              layout={MinimalLayout}
            />
          )}
        />
      <Redirect to="/not-found-cover" />
    </Switch>
  );
};

export default Routes;
