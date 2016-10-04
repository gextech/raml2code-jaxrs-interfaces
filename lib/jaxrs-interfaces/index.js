var camelCase, customAdapter, generator, parseResource, pascalCase, utilSchemas, _;

_ = require('lodash');

utilSchemas = require('raml2code-utils/lib/schemas');

pascalCase = require('pascal-case');

camelCase = require('camel-case');

parseResource = require('raml2code-utils/lib/parse-resource');

generator = {};

generator.template = {
  '{{fileName}}': require("../tmpl/jaxrsResources.hbs")
};

customAdapter = function(method, methodParsed) {
  var formData;
  formData = _.find(methodParsed.args, function(arg) {
    return arg.classType === 'InputStream' || arg.classType === 'TypedFile';
  });
  if (formData) {
    return methodParsed.consumes = "MediaType.MULTIPART_FORM_DATA";
  }
};

generator.parser = function(data) {
  var extra, first, k, methodParse, model, options, parsed, resource, resourceGroup, schemas, v, version, _i, _len, _ref;
  parsed = [];
  schemas = utilSchemas.loadSchemas(data);
  options = {
    annotations: {
      path: "@PathParam",
      query: "@QueryParam",
      body: "",
      multiPart: "@FormDataParam",
      form: "@FormDataParam"
    },
    mapping: {
      'string': "String",
      'boolean': "Boolean",
      'number': "BigDecimal",
      'integer': "Long",
      'array': "List",
      'object': "Map",
      'file': "InputStream"
    }
  };
  methodParse = [];
  _ref = data.resources;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    resource = _ref[_i];
    methodParse.push(parseResource(resource, options, schemas, customAdapter));
  }
  methodParse = _.flatten(methodParse);
  resourceGroup = _.groupBy(methodParse, function(method) {
    return method.displayName;
  });
  extra = {};
  if (data.extra && data.extra["package"]) {
    extra["package"] = "" + data.extra["package"] + "." + data.version;
  }
  if (data.extra && data.extra["importPojos"]) {
    extra.importPojos = "" + data.extra.importPojos + "." + data.version;
  }
  for (k in resourceGroup) {
    v = resourceGroup[k];
    model = {};
    model.extra = extra;
    first = _.first(v);
    model.uri = first.uri;
    model.mediaType = data.mediaType;
    model.className = "" + first.displayName + "Resource";
    model.methods = v;
    version = data.version ? "" + data.version + "/" : "";
    model.fileName = "" + version + model.className + ".groovy";
    parsed.push(model);
  }
  return parsed;
};

module.exports = generator;
