'use strict';

//Object.defineProperty(exports, '__esModule', {
//  value: true
//});
function fpES6(collection) {
  var type = undefined;

  if (collection.add) {
    type = 'set';
  } else if (!collection.set) {
    throw new TypeError("Expecting 'Set' or 'Map'");
  }

  function addToCollection(collection, key, val) {
    if (type === 'set') {
      collection.add(val);
    } else {
      collection.set(key, val);
    }
  }

  function buildArgs(type, elem, collection) {
    return type === 'set' ? [elem, elem, collection] : [elem[1], elem[0], collection];
  }

  return {
    value: function value() {
      return collection;
    },

    map: function map(fn, context) {
      var newCollection = new collection.constructor();

      collection.forEach(function (value, keyOrVal, collection) {
        var ret = fn.call(this, value, keyOrVal, collection);

        addToCollection(newCollection, keyOrVal, ret);
      }, context);

      return fpES6(newCollection);
    },

    filter: function filter(fn, context) {
      var newCollection = new collection.constructor();

      collection.forEach(function (value, keyOrVal, collection) {
        var ret = fn.call(this, value, keyOrVal, collection);

        if (ret) {
          addToCollection(newCollection, keyOrVal, value);
        }
      }, context);

      return fpES6(newCollection);
    },

    reduce: function reduce(fn, initialValue) {
      var acc = initialValue;

      switch (collection.size) {
        case 0:
          if (initialValue === undefined) {
            throw new TypeError('cannot call reduce on empty collection without initial value');
          } else {
            return initialValue;
          }

        case 1:
          if (initialValue === undefined) {
            return collection.values().next().value;
          }
          break;
      }

      collection.forEach(function (value, keyOrVal, collection) {
        if (acc === undefined) {
          acc = value;
          return;
        }

        acc = fn(acc, value, keyOrVal, collection);
      });

      return acc;
    },

    every: function every(fn, context) {
      var args = undefined,
          ret = undefined;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = collection[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var elem = _step.value;

          args = buildArgs(type, elem, collection);
          ret = fn.apply(context, args);

          if (!ret) {
            return false;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return true;
    },

    some: function some(fn, context) {
      var args = undefined,
          ret = undefined;

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = collection[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var elem = _step2.value;

          args = buildArgs(type, elem, collection);
          ret = fn.apply(context, args);

          if (ret) {
            return true;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2['return']) {
            _iterator2['return']();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return false;
    }
  };
}

//exports['default'] = fpES6;
//module.exports = exports['default'];
