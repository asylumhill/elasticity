// JavaScript source code
var assert = chai.assert;
var elasticity = null;

describe('ElasticityUI', function () {
    
    beforeEach(function () {
        elasticity = new $('#testControl').elasticity({
        blockWidth: 170,
        leftOffset: 0,
        triggerOffset: 40,
        stopWidth: 0,
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
  var block = $("<div class=\"block\" data-block=\"true\">" + counter + ".) Dyanmic New Item</div>");
  block.insertBefore($('#testControl').children()[0]);
  elasticity.forceRestretch();
}