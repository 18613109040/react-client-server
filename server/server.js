// import some new stuff
import React from 'react';
// we'll use this to render our app to an html string
import { renderToString } from 'react-dom/server';
// and these to match the url to routes and then render
import { match, RouterContext } from 'react-router';
// import { match, RoutingContext } from 'react-router';
import routes from '../modules/routes';

var express = require('express');
var path = require('path');

var app = express()

console.log(process.env.NODE_ENV);

app.use(express.static(path.join(__dirname, "../statics/chunkJs")));
app.use(express.static(path.join(__dirname, "../statics")));
app.get('*', (req, res) => {
  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
   if (error) {
     res.status(500).send(error.message)
   } else if (redirectLocation) {
     res.redirect(302, redirectLocation.pathname + redirectLocation.search)
   } else if (renderProps) {
     res.status(200).send(renderPage(renderToString(<RouterContext {...renderProps} />)))
   } else {
     res.status(404).send('Not found')
   }
 })
})

function renderPage(appHtml) {
  return `
    <!doctype html public "storage">
    <html>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, minimal-ui, maximum-scale=1.0, minimum-scale=1.0">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="format-detection" content="telephone=no">
    <title>My First React Router App</title>
    <div id=app>${appHtml}</div>
    <script src="/bundle.js"></script>
   `
}



var PORT = process.env.PORT || 9090
app.listen(PORT, function() {
  console.log('Production Express server running at localhost:' + PORT)
})
