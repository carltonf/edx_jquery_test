const assert = require('assert');

var labURL = '/labs/lab.html';
exports.labURL = labURL;

var labAnsURL = 'labs/lab.js';
exports.labAnsURL = 'labs/lab.js';

exports.pageAccessibilityBeforeAssert = function(browser){
  // ensure page accessibility.
  return function(){
    browser.visit(labURL).then(function(){
    browser.assert.success('should be successful');
    browser.assert.text('h1', 'Contoso Web Developer Conference',
                        'should see the title');
    browser.assert.evaluate('jQuery.fn.jquery', '2.1.4',
                            'jQuery should load successfully');
    // all resources should load successfully, particularly lab answer code
    browser.resources.forEach(resource => {
      assert.equal(resource.response.status, 200, resource.response.url);
    });
  })};
};
