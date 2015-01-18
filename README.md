# vehicle-history
[![npm version](https://badge.fury.io/js/vehicle-history.svg)](http://badge.fury.io/js/vehicle-history)
[![Coverage Status](https://coveralls.io/repos/vehicle-history/npm-vehicle-history/badge.png?branch=master)](https://coveralls.io/r/vehicle-history/npm-vehicle-history?branch=master)
[![Build Status](https://travis-ci.org/vehicle-history/npm-vehicle-history.svg?branch=master)](https://travis-ci.org/vehicle-history/npm-vehicle-history)

[![NPM](https://nodei.co/npm/vehicle-history.png?downloads=true&stars=true)](https://nodei.co/npm/vehicle-history/)

Check vehicle history based on vin number.

## Installation

Download node at [nodejs.org](http://nodejs.org) and install it, if you haven't already.

```sh
npm install vehicle-history --save
```


## Tests

```sh
npm install
npm test
```

## Dependencies

- [async](https://github.com/caolan/async): Higher-order functions and common patterns for asynchronous code
- [pl-numberplates](https://github.com/Zenedith/npm-pl-numberplates): Node JS package to validate PL number plates.
- [uk-numberplates](https://github.com/CapitalReg/uk-numberplates): Node JS package to validate UK number plates.
- [vehicle-history-provider-web](https://github.com/vehicle-history/npm-vehicle-history-provider-web): Vehicle history web provider using car plate and vin number.
- [vehicle-history-provider-xml](https://github.com/vehicle-history/npm-vehicle-history-provider-xml): Vehicle history xml provider using car plate and vin number.
- [winston](https://github.com/flatiron/winston): A multi-transport async logging library for Node.js

## Dev Dependencies

- [config](https://github.com/lorenwest/node-config): Configuration control for production node deployments
- [chai](https://github.com/chaijs/chai): BDD/TDD assertion library for node.js and the browser. Test framework agnostic.
- [istanbul](https://github.com/gotwarlost/istanbul): Yet another JS code coverage tool that computes statement, line, function and branch coverage with module loader hooks to transparently add coverage when running tests. Supports all JS coverage use cases including unit tests, server side functional tests
- [mocha](https://github.com/mochajs/mocha): simple, flexible, fun test framework
- [rewire](https://github.com/jhnns/rewire): Easy dependency injection for node.js unit testing


## Changelog

[CHANGELOG](CHANGELOG.md)


## License
The MIT License (MIT)

Copyright (c) 2015 Zenedith

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.