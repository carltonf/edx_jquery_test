/* Oct-15-2015 21:50:13 CST: Resolution - CANCELLED

Originally I've planned to test without the need of the remote server. Two options:
1. Write my own server.
A: Doable but not interesting anyway as it would not be usable to other similar scenarios.
2. Use a mock library like Sinnon.js
A: It works with regular browsers, but the fake server Sinnon supplies doesn't
work well with zombie.js. Further zombie's "pressButton" would bypass Sinnon's
settings, while evaluating "btn.click()" doesn't seem to trigger any AJAX call.
Too much complexity for this little project.

Conclusion:

zombie is fast and fun but its abstraction leaks as in many areas it's not
compilant with normal browsers. Next time for client-side testing, an in-page
testing might be better. For automation, I would go for "PhantomJS" or even use
"Selenium", which by the way is really easy to setup despite it's quite slow.

*/

// * Boiler plates
const Browser = require('zombie');
const assert = require('assert');

const labURL = '/labs/lab.html';
const labAnsURL = 'labs/lab.js';

Browser.localhost('localhost', 8080);

const browser = new Browser();

const helpers = require('./helpers');

before(helpers.pageAccessibilityBeforeAssert(browser));

// * Test Helpers
var save_btn_click = "$('#save-rating').click()";
var circle_click = (nth) => `$($('.rating-circle').get(${nth} - 1)).click();`;
// TODO relatively crude
var fakeServerResponse = (jsonObj) =>
      `fakeServer.respondWith('POST', 'http://jquery-edx.azurewebsites.net/api/Rating',
                              [200, { "Content-Type": "application/json" },
                               '${JSON.stringify(jsonObj)}']); true`;

// * Test Lab3
// ** intrumenting

// in 'before' hook, the page is not visited. so make sure the page is visited
// before.
beforeEach(function(){
  return browser.visit(labURL).then(function(){
    // browser.assert.evaluate(
    //   "$('body').append('<script src=/node_modules/sinon/pkg/sinon.js></script>')"
    // );
    // browser.assert.evaluate("var fakeServer = sinon.fakeServer.create(); true;");
  });
});

describe('Testing Lab3 Instrumenting', function(){
  it('fakeServer should be available', function(){
    // browser.assert.global('fakeServer');
  });
});

// ** functionality
describe('Testing Lab3 functionality: ', function(){
  
  it('should work without chosen circle', function(done){
    this.timeout(7*1000);
    //  console.log(fakeServerResponse({value:0, maxValue: 4}));
    // browser.assert.evaluate( fakeServerResponse({value:0, maxValue: 4}) );
    browser.evaluate(save_btn_click);
    // browser.evaluate('$.post("http://jquery-edx.azurewebsites.net/api/Rating", "hello")');

    // browser.pressButton('#save-rating', function(){
    //   // browser.assert.evaluate('$("#output").text()', 'You chose 0 out of 5');
    //   // done();
    //   return true;
    // })

    setTimeout(function(){
      browser.assert.evaluate('$("#output").text()', 'You chose 0 out of 5');
      done();
    }, 1200);

    // browser.assert.evaluate('$("#output").text()', 'You chose 0 out of 5');
    // browser.on('xhr', function(event, url){
    //   console.log(`${event}: ${url}`);
    //   if (event === 'load'){
    //     browser.assert.evaluate('$("#output").text()', 'You chose 0 out of 5');
    //     done();
    //   }
    // });
  });

  it('should still update text with two consecutive save setting');
});
