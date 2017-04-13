/**
 * Created by simon on 2016/8/4.
 */
var Express = require('express');

var app = new Express();
var port = 3085;

app.listen(port, (error) => {
  if (error) {
    console.error(error)
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`)
  }
});
