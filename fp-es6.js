function fpES6(collection) {
	var type;

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
		var args;
		if (type === 'set') {
			args = [elem, elem, collection];
		} else {
			args = [elem[1], elem[0], collection];
		}
		
		return args;
	}

	return {
		value: function () {
			return collection;
		},
		
		map: function (fn, context) {
			var newCollection = new collection.constructor();

			collection.forEach(function (value, keyOrVal, collection) {
				var ret = fn.call(this, value, keyOrVal, collection);
				addToCollection(newCollection, keyOrVal, ret);
			}, context);

			return fpES6(newCollection);
		},

		filter: function (fn, context) {
			var newCollection = new collection.constructor();

			collection.forEach(function (value, keyOrVal, collection) {
				var ret = fn.call(this, value, keyOrVal, collection);
				if (ret) {
					addToCollection(newCollection, keyOrVal, value);
				}
			}, context);

			return fpES6(newCollection);
		},

		reduce: function (fn, initialValue) {
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

		every: function (fn, context) {
			var args, ret;
			
			for (elem of collection) {
				args = buildArgs(type, elem, collection);
				ret = fn.apply(context, args);

				if (!ret) {
					return false;
				}
			}

			return true;
		},

		some: function (fn, context) {
			var args, ret;
			
			for (elem of collection) {
				args = buildArgs(type, elem, collection);
				ret = fn.apply(context, args);
				
				if (ret) {
					return true;
				}
			}

			return false;
		}
	};
};

module.exports = fpES6;