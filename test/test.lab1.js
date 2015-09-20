const Browser = require('zombie');
const lab1URL = '/labs/lab1.html';

Browser.localhost('localhost', 8080);

describe('Lab1 page testing: ', function() {

  const browser = new Browser();


  describe('Access the lab1 page: ', function() {
    before(function() {
      return browser.visit(lab1URL);
    });

    it('should be successful', function() {
      browser.assert.success();
    });

    it('should see the title', function() {
      browser.assert.text('h1', 'Contoso Web Developer Conference');
    });

    it('default status should have no circles highlighted', function(){
      browser.assert.className('.rating-circle', 'rating-circle');
    });
  });

  describe("click", function(){
    var click = (nth) => `$($('.rating-circle').get(${nth} - 1)).click();`,
        selFirstCircles = (nth) => `.rating-circle:nth-child(-n + ${nth})`,
        selLastCircles = (nth) => `.rating-circle:nth-child(n + ${5 - nth + 1})`;

    beforeEach(function(){
      return browser.visit(lab1URL);
    });

    describe("simple click should work", function(){
      it("click on the 1st circle should ONLY have the first circle chosen", function(){

        browser.assert.evaluate(click(1));
        browser.assert.hasClass(selFirstCircles(1), 'rating-chosen');
        browser.assert.hasNoClass(selLastCircles(4), 'rating-chosen');
      });
      it("click on the 3rd circle should ONLY have the first 3 circles chosen", function(){
        browser.assert.evaluate(click(3));
        browser.assert.hasClass(selFirstCircles(3), 'rating-chosen');
        browser.assert.hasNoClass(selLastCircles(2), 'rating-chosen');
      });
      it("click on the 5th circle should ONLY have all circles chosen", function(){
        browser.assert.evaluate(click(5));
        browser.assert.hasClass(selFirstCircles(5), 'rating-chosen');
      });
    });
  });

  describe('hover:mouseenter', function(){
    describe("simple mouseenter should highlight correctly", function(){
    });
  });
});
