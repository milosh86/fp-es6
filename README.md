# fp-es6
Tiny library of functional programming operations for ES6 collections (Maps and Sets).
Couldn't find any similar library without Traceur dependancy :(

Provides following operations:
- map: MapOrSet -> MapOrSet 
- filter: MapOrSet -> MapOrSet 
- reduce: MapOrSet -> Any 
- some: MapOrSet -> Boolean
- every: MapOrSet -> Boolean

```
var fn = require('fp-es6');

var doubledAndFiltered = fn(new Set([1,2,3]))
  .map(val => 2 * val)
  .filter(val => val > 2)
  .value(); // call value() to extract the native collection

doubledAndFiltered instanceof Set // true

var sum = fn(new Set([1,2,3])).reduce((a, b) => a + b);

var hasFive = fn(new Set([1,2,3])).some(val => val === 5);

fn(new Map([['a', 1], ['b', 1]])).every(val => val === 1);

```
