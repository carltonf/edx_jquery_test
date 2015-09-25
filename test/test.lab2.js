const Browser = require('zombie');
const assert = require('assert');

const labURL = '/labs/lab.html';
const labAnsURL = 'labs/lab.js';

Browser.localhost('localhost', 8080);

const browser = new Browser();

const helpers = require('./helpers');

before(helpers.pageAccessibilityBeforeAssert(browser));

// see the labURL file for this value
const initialCircleMax = 5;

var updateMaxVALUE = function(n){
  browser.evaluate(`$('#max-value').val(${n})`);
  browser.evaluate("$('#update-max-value').click()");
};

describe('Testing Lab2 functionality: ', function(){
  it(`On page load, there should be ${initialCircleMax} circles`, function(){
    browser.assert.elements('.rating-circle', initialCircleMax);
  });

  it(`*Repeatedly* set to the ${initialCircleMax} should work`, function(){
    updateMaxVALUE(initialCircleMax);
    browser.assert.elements('.rating-circle', initialCircleMax);
  });

  describe('More than initial size is working', function(){
    [6, 10].forEach(i => {
      it(`set max value to ${i} works.`, function(){
        updateMaxVALUE(i);
        browser.assert.elements('.rating-circle', i);
      });
    })
  });

  describe('Less than initial size is working', function(){
    [4, 1].forEach(i => {
      it(`set max value to ${i} works.`, function(){
        updateMaxVALUE(i);
        browser.assert.elements('.rating-circle', i);
      });
    })
  });
});
