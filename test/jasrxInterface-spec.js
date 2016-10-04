var test = require("raml2code-fixtures").runSimpleTest;

describe('RAML to JAX-RS', function () {
  var generator = require("../lib/jaxrs-interfaces");
  var extra = {package: 'org.gex', importPojos: 'org.gex.dto'};
  var raml = "index.raml";

  it("should generate a resource interface",
    test(raml, generator, extra, "groovy/jersey-resources/GatitosResource.groovy", "v1/GatitosResource.groovy", true));

  it('should generate a resourceById interface',
    test(raml, generator, extra, "groovy/jersey-resources/GatitoByIdResource.groovy", "v1/GatitoByIdResource.groovy"));

  it('should generate a GatitoByIdPictureResource upload interface',
    test(raml, generator, extra, "groovy/jersey-resources/GatitoByIdPictureResource.groovy", "v1/GatitoByIdPictureResource.groovy"));

  it('should generate a GatitopByIdFormResource upload interface',
    test(raml, generator, extra, "groovy/jersey-resources/GatitopByIdFormResource.groovy", "v1/GatitopByIdFormResource.groovy"));


});
