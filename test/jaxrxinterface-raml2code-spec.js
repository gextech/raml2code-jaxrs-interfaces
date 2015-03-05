var test = require("raml2code-fixtures").raml2codeIntegration,
  chai = require('chai');
chai.should();

describe('Must run on raml2code', function () {

  var generator = require("../lib/jaxrs-interfaces");
  var extra = {package: 'org.gex', importPojos: 'org.gex.dto'};
  var gatitosAPI = function(done){
    test( done, "index.raml", generator, extra,
      "groovy/jersey-resources/GatitosResource.groovy", "v1/GatitosResource.groovy")
  };

  it('should generate a resource interface', gatitosAPI );

});
