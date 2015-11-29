// JavaScript source code
var assert = chai.assert;

describe('ElasticityUI', function () {
    var elasticity = null;

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