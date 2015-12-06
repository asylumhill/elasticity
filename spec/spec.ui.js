// JavaScript source code
var assert = chai.assert;
var elasticity = null;

describe('ElasticityUI', function () {
    
    beforeEach(function () {
        elasticity = new $('#testControl').elasticity({
        blockWidth: 170,
        leftOffset: 0,
        triggerOffset: 40,
        stopWidth: 767,
        minColumns: 1,
        linkWithDomIds: []});
    });

    afterEach(function () {
    });

    it('UI Testing Placeholder', function () {
    });
});

var counter = 12;
function addBlock() {
  counter++;
  
  var block = $("<div class=\"block\" data-block='true'>" + counter + ".) Dyanmic New Item</div>");
  if (parseInt(counter) > 1) {
    block.insertBefore($('#testControl').children()[0]);
  }
  else {
    $('#testControl').append(block);
  }
  elasticity.forceRestretch();
}

function clearEverything() {
  elasticity.dispose();
  counter = 0;
}