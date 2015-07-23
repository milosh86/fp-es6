Map.prototype.map = function (fn, context) {
  var newMap = new Map();

  this.forEach(function (value, key, map) {
    var ret = fn.call(this, value, key, map);
    newMap.set(key, ret);
  }, context);

  return newMap;
};

Map.prototype.filter = function (fn, context) {
  var newMap = new Map();

  this.forEach(function (value, key, map) {
    var ret = fn.call(this, value, key, map);
    if (ret) {
      newMap.set(key, value);
    }

  }, context);

  return newMap;
};

Map.prototype.reduce = function (fn, initialValue) {
  var newMap = new Map();
  var acc = initialValue;

  this.forEach(function (value, key, map) {
    if (acc === undefined) {
      acc = value;
      return;
    }

    acc = fn(acc, value, key, map);
  });

  return acc;
};

Map.prototype.every = function (fn, context) {
  for (elem of this) {
    var ret = fn.call(context, elem[1], elem[0], this);
    if (!ret) {
      return false;
    }
  }

  return true;
};

Map.prototype.some = function (fn, context) {
  for (elem of this) {
    var ret = fn.call(context, elem[1], elem[0], this);
    if (ret) {
      return true;
    }
  }

  return false;
};