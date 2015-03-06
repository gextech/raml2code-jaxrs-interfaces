# raml2code-jaxrs-interfaces

[![Build Status](https://img.shields.io/travis/gextech/raml2code-jaxrs-interfaces/master.svg?style=flat)](https://travis-ci.org/gextech/raml2code-jaxrs-interfaces)

This create JAX-RS interfaces in Groovy, we believe that defining a contract is more important that create a full SDK.
## Important notes:
  We use the optional resource.displayName to name resource classes, if you use this generator don't forget to provide it.
  Example:
  ```groovy
    /cats:
      displayName: Gatitos
  ```
  Will generate GatitosResource

This is part of the [raml2code](git@github.com:gextech/raml2code.git) project.