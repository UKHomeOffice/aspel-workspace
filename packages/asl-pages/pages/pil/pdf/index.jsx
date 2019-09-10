import React from 'react';
import fetch from 'r2';
import { Router } from 'express';
import { renderToStaticMarkup } from 'react-dom/server';
import createStore from '../../common/pdf/client/store';
import App from './views';
import Header from '../../common/pdf/views/header';
import Footer from '../../common/pdf/views/footer';
import content from './content';

module.exports = settings => {
  const app = Router();

  app.get('/', (req, res, next) => {
    const initialState = {
      pil: req.pil,
      licenceHolder: req.profile,
      establishment: req.establishment
    };
    const store = createStore(initialState);

    const html = renderToStaticMarkup(<App store={store} nonce={res.locals.static.nonce} content={content} />);
    const header = renderToStaticMarkup(<Header model={req.pil} licenceType="pil" nonce={res.locals.static.nonce} />);
    const footer = renderToStaticMarkup(<Footer />);

    const hasStatusBanner = req.pil.status !== 'active';

    const params = {
      method: 'POST',
      json: {
        template: html,
        pdfOptions: {
          displayHeaderFooter: true,
          headerTemplate: header,
          footerTemplate: footer,
          margin: {
            top: hasStatusBanner ? 180 : 100,
            left: 25,
            right: 25,
            bottom: 125
          }
        }
      }
    };

    fetch(`${settings.pdfService}/convert`, params)
      .response
      .then(response => {
        if (response.status < 300) {
          res.attachment(`${req.pil.licenceNumber}.pdf`);
          response.body.pipe(res);
        } else {
          throw new Error('Error generating PDF');
        }
      })
      .catch(next);
  });

  return app;
};
