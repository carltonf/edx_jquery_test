describe("Just a simple test to see whether Mocha works", function(){
  it("1 + 1 = 2", function(){
    expect(1+1).to.be(2);
  });
});

/////////////////////////////////////////////////////////////////
var testGlobals = {};

before(function(){

  testGlobals = {
    oldjQuery: $,
    jQuery: frames['testpage'].contentWindow.jQuery,

    // click at nth circle, starting from 1
    click: function(nth) {
      $($('.rating-circle').get(nth - 1)).trigger('click');
      setTimeout
    },

    // move mouse to ath, then to bth, each should start from 1, if ath or bth is
    // less than 0, it means it from outside (other than those 5 circles).
    move: function(ath, bth){

    },
  };

  $ = testGlobals.jQuery;
});

after(function(){
  $ = testGlobals.oldjQuery;
})

describe("click", function(){
  describe("simple click should work", function(){
    it("click on the 1st circle should ONLY have the first circle chosen", function(){
      testGlobals.click(1);
      expect( $($('.rating-circle')[0]).hasClass('rating-chosen') ).to.be.ok();
      expect( $('.rating-circle').slice(1).not('.rating-chosen').length ).to.be(4);
    });
    it("click on the 3rd circle should have the first 3 circles chosen");
  });
});
