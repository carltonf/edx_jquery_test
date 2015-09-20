const Browser = require('zombie');
const assert = require('assert');

const lab1URL = '/labs/lab1.html';
const lab1AnsURL = 'labs/lab1.js';

Browser.localhost('localhost', 8080);

const browser = new Browser();

// TODO common part, should be factored out
describe('Page accessibility: ', function() {

  before(function() {
    // visit is async, and return a Promise.
    return browser.visit(lab1URL);
  });

  it('should be successful', function() {
    browser.assert.success();
  });

  it('should see the title', function() {
    browser.assert.text('h1', 'Contoso Web Developer Conference');
  });

  it('jQuery should load successfully', function(){
    browser.assert.evaluate('jQuery.fn.jquery', '2.1.4');
  });

  it('all resources should load successfully, particularly lab1 answer code', function(){
    browser.resources.forEach(resource => {
      assert.equal(resource.response.status, 200, resource.response.url);
    });
    //// specificially fetch again.
    //
    // browser.fetch(lab1AnsURL).then(function(response){
    //   assert.equal(response.status, 200);
    //   done();
    // });
  });

  it('default status should have no circles highlighted', function(){
    browser.assert.className('.rating-circle', 'rating-circle');
  });
});


describe('Lab1 Testing: ', function() {
  // TODO the fancy CSS selectors are nice to write, but the failure report is
  // not very helpful. I think using some loop and test generation would produce
  // better report.
  var numOfCircles = 5,
      click = (nth) => `$($('.rating-circle').get(${nth} - 1)).click();`,
      mouseenter = (nth) => `$($('.rating-circle').get(${nth} - 1)).mouseenter();`,
      mouseleave = (nth) => `$($('.rating-circle').get(${nth} - 1)).mouseleave();`,
      selFirstCircles = (nth) => `.rating-circle:nth-child(-n + ${nth})`,
      selLastCircles = (nth) => `.rating-circle:nth-child(n + ${5 - nth + 1})`;

  beforeEach(function(){
    return browser.visit(lab1URL);
  });

  describe("click", function(){
    describe("simple click should work", function(){
      // NOTE: make sure the click order is not sequential.
      it("click on the 1st circle should ONLY have the first circle chosen", function(){

        browser.assert.evaluate(click(1));
        browser.assert.hasClass(selFirstCircles(1), 'rating-chosen');
        browser.assert.hasNoClass(selLastCircles(4), 'rating-chosen');
      });
      it("click on the 5th circle should ONLY have all circles chosen", function(){
        browser.assert.evaluate(click(5));
        browser.assert.className('.rating-circle', 'rating-circle rating-chosen');
      });
      it("click on the 3rd circle should ONLY have the first 3 circles chosen", function(){
        browser.assert.evaluate(click(3));
        browser.assert.hasClass(selFirstCircles(3), 'rating-chosen');
        browser.assert.hasNoClass(selLastCircles(2), 'rating-chosen');
      });
    });
  });

  describe('hover:mouseenter', function(){
    describe("simple mouseenter should be highlighted correctly", function(){
      it('mouse over the 1st circle should ONLY have the first circle highlighted', function(){
        browser.assert.evaluate(mouseenter(1));
        browser.assert.hasClass(selFirstCircles(1), 'rating-hover');
        browser.assert.hasNoClass(selLastCircles(4), 'rating-hover');
      });
      it('mouse over the 5th circle should ONLY have all circles highlighted', function(){
        browser.assert.evaluate(mouseenter(5));
        browser.assert.hasClass(selFirstCircles(5), 'rating-hover');
      });
      it('mouse over the 3rd circle should ONLY have the first 3 circles highlighted', function(){
        browser.assert.evaluate(mouseenter(3));
        browser.assert.hasClass(selFirstCircles(3), 'rating-hover');
        browser.assert.hasNoClass(selLastCircles(2), 'rating-hover');
      });
    });

    describe("mouseenter should work correctly with the 3rd circle clicked", function(){
      beforeEach(function(){
        browser.assert.evaluate(click(3));
      });

      it('mouse over the 2nd circle should ONLY have the first 2 circles highlighted', function(){
        browser.assert.evaluate(mouseenter(2));
        browser.assert.hasClass(selFirstCircles(2), 'rating-hover');
        browser.assert.hasNoClass(selLastCircles(3), 'rating-hover');
      });
      it('mouse over the 3rd circle should ONLY have the first 3 circles highlighted', function(){
        browser.assert.evaluate(mouseenter(3));
        browser.assert.hasClass(selFirstCircles(3), 'rating-hover');
        browser.assert.hasNoClass(selLastCircles(2), 'rating-hover');
      });
      it('mouse over the 4th circle should ONLY have all circles highlighted', function(){
        browser.assert.evaluate(mouseenter(4));
        browser.assert.hasClass(selFirstCircles(4), 'rating-hover');
        browser.assert.hasNoClass(selLastCircles(1), 'rating-hover');
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

      [2, 3, 4].forEach(i => {
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
