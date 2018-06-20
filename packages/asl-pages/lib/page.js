const { every, merge } = require('lodash');
const { combineReducers } = require('redux');
const path = require('path');
const findRoot = require('find-root');
const express = require('express');
const match = require('minimatch');
const rootReducer = require('./reducers');

const lookup = (...args) => {
  if (!args.length) {
    return undefined;
  }
  try {
    return require(args.shift());
  } catch (err) {
    return lookup(...args);
  }
};

module.exports = ({
  root,
  content = {},
  contentPath = '../content'
}) => {
  const app = express.Router();

  const checkSubpath = (req, res, next) => {
    const allowedSubPaths = ['/', '/assets/**', '/edit', '/edit/*', '/delete'];
    if (every(allowedSubPaths, p => !match(req.path, p))) {
      return next('router');
    }
    next();
  };

  const pagePath = path.relative(findRoot(root), root);

  app.use('/assets', express.static(path.resolve(root, './dist')));

  const locals = (req, res, next) => {
    const url = req.baseUrl === '/'
      ? ''
      : req.baseUrl;
    const filename = req.path.split('/').pop() || 'index';
    const Component = require(path.resolve(root, `./views/${filename}`));

    const pageContent = lookup(
      path.resolve(root, `./content/${filename}`),
      path.resolve(root, contentPath)
    );

    Object.assign(res.locals, {
      scripts: [`/public/js/${pagePath}/${filename}/bundle.js`],
      rootReducer: combineReducers(rootReducer),
      static: {
        url,
        content: merge({}, res.locals.static.content, pageContent, content)
      }
    });
    res.template = Component.default || Component;
    return next();
  };

  app.use(
    checkSubpath,
    locals
  );

  return app;
};
