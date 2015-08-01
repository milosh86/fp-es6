function fpES6(collection) {
  let type;

  if (collection.add) {
    type = 'set'
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
    return (type === 'set') ? 
      [elem, elem, collection] :
      [elem[1], elem[0], collection];
  }

  return {
    value() {
      return collection;
    },

    map(fn, context) {
      let newCollection = new collection.constructor();

      collection.forEach(function (value, keyOrVal, collection) {
        let ret = fn.call(this, value, keyOrVal, collection);

        addToCollection(newCollection, keyOrVal, ret);
      }, context);

      return fpES6(newCollection);
    },

    filter(fn, context) {
      let newCollection = new collection.constructor();

      collection.forEach(function (value, keyOrVal, collection) {
        let ret = fn.call(this, value, keyOrVal, collection);

        if (ret) {
          addToCollection(newCollection, keyOrVal, value);
        }
      }, context);

      return fpES6(newCollection);
    },

    reduce(fn, initialValue) {
      let acc = initialValue;

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

    every(fn, context) {
      let args, ret;

      for (let elem of collection) {
        args = buildArgs(type, elem, collection);
        ret = fn.apply(context, args);

        if (!ret) {
          return false;
        }
      }

      return true;
    },

    some(fn, context) {
      let args, ret;

      for (let elem of collection) {
        args = buildArgs(type, elem, collection);
        ret = fn.apply(context, args);

        if (ret) {
          return true;
        }
      }

      return false;
    }
  };
}

export default fpES6;