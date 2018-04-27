const { setWorldConstructor, setDefaultTimeout } = require('cucumber');
const selenium = require('selenium-webdriver');
const chrome = require('chromedriver');

let buildDriver = function() {
  return new selenium.Builder()
    .withCapabilities(selenium.Capabilities.chrome())
    .build();
};

let World = function World() {
  this.driver = buildDriver();
};

setWorldConstructor(World);
setDefaultTimeout(10 * 1000);
