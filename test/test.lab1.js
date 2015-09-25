const Browser = require('zombie');
const assert = require('assert');

Browser.localhost('localhost', 8080);

const browser = new Browser();

const helpers = require('./helpers');

before(helpers.pageAccessibilityBeforeAssert(browser));

// see the labURL file for this value
const initialCircleMax = 5;

beforeEach(function(){
  return browser.visit(helpers.labURL).then(function(){
    browser.assert.elements('.rating-circle', initialCircleMax);
    browser.assert.className('.rating-circle', 'rating-circle',
                            'default status should have no circles highlighted');
  });
})


describe('Testing Lab1 functionality: ', function() {
  // NOTE fancy CSS selectors are nice to write, but the failure report might
  // not be very helpful. Be more verbose when writing such tests.
  var numOfCircles = 5,
      circleCSS = '.rating-circle',
      vanillaCircleCSS = circleCSS + ':not(.rating-chosen):not(.rating-hover)',
      chosenCircleCSS = circleCSS + '.rating-chosen',
      hoverCircleCSS = circleCSS + '.rating-hover',
      click = (nth) => `$($('.rating-circle').get(${nth} - 1)).click();`,
      mouseenter = (nth) => `$($('.rating-circle').get(${nth} - 1)).mouseenter();`,
      mouseleave = (nth) => `$($('.rating-circle').get(${nth} - 1)).mouseleave();`,
      selFirstCircles = (nth) => `.rating-circle:nth-child(-n + ${nth})`,
      selLastCircles = (nth) => `.rating-circle:nth-child(n + ${numOfCircles - nth + 1})`;

  describe("click", function(){
    describe("simple click should work", function(){
      // NOTE: make sure the click order is not sequential.
      [1, 5, 3].forEach(i => {
        it(`click on the ${i}-th circle should ONLY have the first ${i} circle(s) chosen`, function(){
          browser.assert.evaluate(click(i));
          // NOTE: I'm using counting here, not so strict as first/last, but
          // it's fun to use it ;P
          browser.assert.elements(chosenCircleCSS, i);
          browser.assert.elements(vanillaCircleCSS, numOfCircles - i);
        });
      });
    });
  });

  describe('hover:mouseenter', function(){
    describe("simple mouseenter should be highlighted correctly", function(){
      [1, 5, 3].forEach(i => {
        it(`mouse over the ${i}-th circle should ONLY have the ${i} circle(s) highlighted`, function(){
          browser.assert.evaluate(mouseenter(i));
          browser.assert.className(selFirstCircles(i), 'rating-circle rating-hover');
          browser.assert.elements(vanillaCircleCSS, numOfCircles - i);
        });
      });
    });

    describe("mouseenter should work correctly with the 3rd circle clicked", function(){
      beforeEach(function(){
        browser.assert.evaluate(click(3));
      });

      [4, 3, 2].forEach(i => {
        it(`mouse etner the ${i}-th circle should ONLY have the first ${i} circle(s) highlighted`,
           function(){
             browser.assert.evaluate(mouseenter(i));
             browser.assert.className(selFirstCircles(i), 'rating-circle rating-hover');
             browser.assert.elements(vanillaCircleCSS, numOfCircles - i);
           });
      });
    });
  });

  describe('hover:mouseleave', function(){
    describe("simple mouseleave should remove highlight correctly", function(){
      for(var i = 1; i <= numOfCircles; i++){
        it(`mouse leave the ${i}-th circle should ONLY have no circles highlighted`, function(){
          browser.assert.evaluate(mouseenter(i));
          browser.assert.evaluate(mouseleave(i));
          browser.assert.hasNoClass(selFirstCircles(numOfCircles), 'rating-hover');
        });
      }
    });

    describe("mouseleave should work correctly with the 3rd circle clicked", function(){
      beforeEach(function(){
        browser.assert.evaluate(click(3));
      });

      [3, 2, 4].forEach(i => {
        it(`mouse leave the ${i}-th circle should restore chosen highlighting`, function(){
          browser.assert.evaluate(mouseenter(i));
          browser.assert.evaluate(mouseleave(i));
          browser.assert.hasClass(selFirstCircles(3), 'rating-chosen');
          browser.assert.hasNoClass(selLastCircles(numOfCircles - 3), 'rating-chosen');
        });
      })
    });
  });
});
