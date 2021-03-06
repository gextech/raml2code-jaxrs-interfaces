_ = require('lodash')
utilSchemas = require('raml2code-utils/lib/schemas')
pascalCase = require('pascal-case')
camelCase = require('camel-case')
parseResource = require('raml2code-utils/lib/parse-resource')


generator = {}
generator.template = {'{{fileName}}':require("../tmpl/jaxrsResources.hbs")}

customAdapter = (method, methodParsed) ->
  formData = _.find(methodParsed.args, (arg) ->
    arg.classType is 'InputStream' or arg.classType is 'TypedFile'
  )

  if formData
    methodParsed.consumes = "MediaType.MULTIPART_FORM_DATA"

generator.parser = (data) ->
  parsed = []
  schemas = utilSchemas.loadSchemas(data)

  options =
    annotations :
      path: "@PathParam"
      query: "@QueryParam"
      body: ""
      multiPart: "@FormDataParam"
      form: "@FormDataParam"
    mapping :
      'string' : "String"
      'boolean' : "Boolean"
      'number' : "BigDecimal"
      'integer' : "Long"
      'array' : "List"
      'object' : "Map"
      'file' : "InputStream"

  methodParse = []

  for resource in data.resources
    methodParse.push parseResource(resource, options, schemas, customAdapter)

  methodParse = _.flatten(methodParse)
  resourceGroup = _.groupBy(methodParse, (method) ->
    method.displayName
  )

  extra = {}
  if data.extra and  data.extra["package"] 
    extra.package = "#{data.extra.package}.#{data.version}"
  if data.extra and data.extra["importPojos"]
    extra.importPojos = "#{data.extra.importPojos}.#{data.version}"
  for k,v of resourceGroup
    model = {}
    model.extra = extra
    first = _.first(v)
    model.uri = first.uri
    model.mediaType = data.mediaType
    model.className = "#{first.displayName}Resource"
    model.methods = v
    version =  if data.version then "#{data.version}/"  else ""
    model.fileName = "#{version}#{model.className}.groovy"
    parsed.push model
  parsed


module.exports = generator
