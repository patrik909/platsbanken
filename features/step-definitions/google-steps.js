'use strict';

let { Given, Then } = require('cucumber');
let { By, until, Key } = require('selenium-webdriver');
let { expect } = require('chai');


Given('att en arbetssökande besöker startsidan', function (next) {
  this.driver.get('http://localhost:8888/Arbetsmetoder/arbetsformedlingen/platsbanken?lanid=1&antalrader=10')
      .then(function() {
      next();
    });
});

Then('visas en lista med de 10 senaste jobbannonserna i Stockholms län', function (next) {
  this.driver.wait(until.elementLocated(By.id('outputListJobs')));
  
  this.driver.findElements(By.css('div.latestJobs'))
    .then(function(elements) {
      expect(elements.length).equal(10);
      next();
    });
});
