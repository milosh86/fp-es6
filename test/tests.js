var fn = fpES6;

QUnit.module('map - ES6 collections');
QUnit.test('fpES6 library only accepts Set or Map', function (assert) {

	assert.throws(function () {
		var ret = fn([1, 2, 3]).map(function (val) { });
	}, "Expecting 'Set' or 'Map'");
});

QUnit.test('map over empty Map/Set should return new empty Map', function (assert) {
	var m = new Map();
	var ret = fn(m).map(function (val) { }).value();

	assert.notEqual(ret, m, 'New Map returned');
	assert.equal(ret.size, 0, 'Empty Map returned');

	var s = new Set();
	ret = fn(s).map(function (val) { }).value();

	assert.notEqual(ret, s, 'New Set returned');
	assert.equal(ret.size, 0, 'Empty Set returned');
});

QUnit.test('map over Map(["a",1], ["b",1], ["c",3]) / Set([1,2,3]). Should double the values', function (assert) {
	var m = new Map([["a", 1], ["b", 2], ["c", 3]]);
	var s = new Set([1, 2, 3]);

	var retMap = fn(m).map(function (val) {
		return 2 * val;
	}).value();
	
	var retSet = fn(s).map(function (val) {
		return 2 * val;
	}).value();

	assert.equal(retMap.get('a'), 2, '2');
	assert.equal(retMap.get('b'), 4, '4');
	assert.equal(retMap.get('c'), 6, '6');
	assert.equal(retMap.size, 3, 'Map size is still 3');
	
	assert.ok(retSet.has(2), '2');
	assert.ok(retSet.has(4), '4');
	assert.ok(retSet.has(6), '6');
	assert.equal(retSet.size, 3, 'Set size is still 3');
});

QUnit.test('map over Map(["a",1], ["b",1], ["c",3]) / Set([1,2,3]) with custom context. Should return values * 10', function (assert) {
	var m = new Map([["a", 1], ["b", 2], ["c", 3]]);
	var s = new Set([1, 2, 3]);

	var retMap = fn(m).map(function (val) {
		return val * this.a;
	}, { a: 10 }).value();
	
	var retSet = fn(s).map(function (val) {
		return val * this.a;
	}, { a: 10 }).value();

	assert.equal(retMap.get('a'), 10, '10');
	assert.equal(retMap.get('b'), 20, '20');
	assert.equal(retMap.get('c'), 30, '30');
	
	assert.ok(retSet.has(10), '10');
	assert.ok(retSet.has(20), '20');
	assert.ok(retSet.has(30), '30');
});

QUnit.test('callback should receive (value, keyOrVal, MaporSet) ', function (assert) {
	var m = new Map([['a', 1]]);
	var s = new Set([2]);
	
	var retMap = fn(m).map(function (val, key, map) {
		assert.equal(val, 1, 'callback received value 1');
		assert.equal(key, 'a', 'callback received key "a"');
		assert.equal(map, m , 'callback received Map "m"');
	});
	
	var retSet = fn(s).map(function (val, key, set) {
		assert.equal(val, 2, 'callback received value 1');
		assert.equal(key, 2, 'instead of key, callback received value 2 again');
		assert.equal(set, s , 'callback received Set "s"');
	});
});

QUnit.module('filter - ES6 collections');
QUnit.test('filter over empty Map/Set should return new empty Map/Set', function (assert) {
	var m = new Map();
	var s = new Set();

	var retMap = fn(m).filter(function (val) { }).value();
	var retSet = fn(s).filter(function (val) { }).value();

	assert.notEqual(retMap, m, 'New Map returned');
	assert.equal(retMap.size, 0, 'Empty Map returned');

	assert.notEqual(retSet, s, 'New Set returned');
	assert.equal(retSet.size, 0, 'Empty Set returned');
});

QUnit.test('filter values greater than 3 in Map(["a",1], ["b",2], ["c",4], ["d",5]).', function (assert) {
	var m = new Map([["a", 1], ["b", 2], ["c", 4], ["d", 5]]);
	var s = new Set([1, 2, 4, 5]);

	var retMap = fn(m).filter(function (val) {
		return val > 3;
	}).value();
	
	var retSet = fn(s).filter(function (val) {
		return val > 3;
	}).value();

	
	assert.equal(retMap.get('a'), undefined, 'a filtered out');
	assert.equal(retMap.get('b'), undefined, 'b filtered out');
	assert.equal(retMap.get('c'), 4, 'c still there');
	assert.equal(retMap.get('d'), 5, 'd still there');
	assert.equal(retMap.size, 2, 'new Map size is 2');
	
	assert.notOk(retSet.has(1), '1 filtered out');
	assert.notOk(retSet.has(2), '2 filtered out');
	assert.ok(retSet.has(4), '4 still there');
	assert.ok(retSet.has(5), '5 still there');
	assert.equal(retSet.size, 2, 'new Set size is 2');
});

QUnit.test('callback should receive (value, keyOrVal, MaporSet) ', function (assert) {
	var m = new Map([['a', 1]]);
	var s = new Set([2]);
	
	var retMap = fn(m).map(function (val, key, map) {
		assert.equal(val, 1, 'callback received value 1');
		assert.equal(key, 'a', 'callback received key "a"');
		assert.equal(map, m , 'callback received Map "m"');
	});
	
	var retSet = fn(s).map(function (val, key, set) {
		assert.equal(val, 2, 'callback received value 1');
		assert.equal(key, 2, 'instead of key, callback received value 2 again');
		assert.equal(set, s , 'callback received Set "s"');
	});
});

QUnit.module('reduce - ES6 collections');
QUnit.test('reduce called on empty collection without initial value throws error', function (assert) {
	var m = new Map();
	var s = new Set();
	
	assert.throws(function () {
		var ret = fn(m).reduce(function () {});
	}, "cannot call reduce on empty collection without initial value");
	
	assert.throws(function () {
		var ret = fn(s).reduce(function () {});
	}, "cannot call reduce on empty collection without initial value");
});

QUnit.test('reduce called on empty collection with initial value returns initial value without calling callback', function (assert) {
	var m = new Map();
	var s = new Set();
	
	var retMap = fn(m).reduce(function () {
		assert.ok(false, 'callback should not be called');
	}, 1);
	
	var retSet = fn(s).reduce(function () {
		assert.ok(false, 'callback should not be called');
	}, 0);
	
	assert.equal(retMap, 1, 'Returned initial value 1');
	assert.equal(retSet, 0, 'Returned initial value 0 (falsy values are ok)');
});

QUnit.test('reduce called on collection with 1 element and without initial value returns that one element without calling callback', function (assert) {
	var m = new Map([['a', 1]]);
	var s = new Set([2]);
	
	var retMap = fn(m).reduce(function () {
		assert.ok(false, 'callback should not be called');
	});
	
	var retSet = fn(s).reduce(function () {
		assert.ok(false, 'callback should not be called');
	});
	
	assert.equal(retMap, 1, 'Returned value 1 from Map');
	assert.equal(retSet, 2, 'Returned value 2 from Set');
});

QUnit.test('sum without initial value', function (assert) {
	var m = new Map([['a', 1], ['b', 2], ['c', 3]]);
	var s = new Set([4, 5, 6]);
	
	function sum(a, b) {
		return a + b;
	}
	
	var retMap = fn(m).reduce(sum);
	
	var retSet = fn(s).reduce(sum);
	
	assert.equal(retMap, 6, 'sum in Map = 6');
	assert.equal(retSet, 15, 'sum in Set = 15');
});

QUnit.test('sum with initial value 0', function (assert) {
	var m = new Map([['a', 1], ['b', 2], ['c', 3]]);
	var s = new Set([4, 5, 6]);
	
	function sum(a, b) {
		return a + b;
	}
	
	var retMap = fn(m).reduce(sum, 0);
	
	var retSet = fn(s).reduce(sum, 0);
	
	assert.equal(retMap, 6, 'sum in Map = 6');
	assert.equal(retSet, 15, 'sum in Set = 15');
});

QUnit.test('callback should receive (value, keyOrVal, MaporSet) ', function (assert) {
	var m = new Map([['a', 1]]);
	var s = new Set([2]);
	
	var retMap = fn(m).map(function (val, key, map) {
		assert.equal(val, 1, 'callback received value 1');
		assert.equal(key, 'a', 'callback received key "a"');
		assert.equal(map, m , 'callback received Map "m"');
	});
	
	var retSet = fn(s).map(function (val, key, set) {
		assert.equal(val, 2, 'callback received value 1');
		assert.equal(key, 2, 'instead of key, callback received value 2 again');
		assert.equal(set, s , 'callback received Set "s"');
	});
});

QUnit.module('some - ES6 collections');

QUnit.test('some with empty collection should return false', function (assert) {
	var m = new Map();
	var s = new Set();
	
	var retMap = fn(m).some(function () {});
	
	var retSet = fn(s).some(function () {});
	
	assert.equal(retMap, false, 'false - Map');
	assert.equal(retSet, false, 'false - Set');
});

QUnit.test('some equals to 5 - success', function (assert) {
	var m = new Map([['a', 1], ['b', 2], ['c', 5]]);
	var s = new Set([4, 5, 6]);
	
	var retMap = fn(m).some(function (val) {
		return val === 5;
	});
	
	var retSet = fn(s).some(function (val) {
		return val === 5;
	});
	
	assert.equal(retMap, true, 'found 5 in Map');
	assert.equal(retSet, true, 'found 5 in Set');
});

QUnit.test('some equals to 5 - failure', function (assert) {
	var m = new Map([['a', 1], ['b', 2], ['c', 4]]);
	var s = new Set([4, 3, 6]);
	
	var retMap = fn(m).some(function (val) {
		return val === 5;
	});
	
	var retSet = fn(s).some(function (val) {
		return val === 5;
	});
	
	assert.equal(retMap, false, 'no 5 in Map');
	assert.equal(retSet, false, 'no 5 in Set');
});

QUnit.test('some equals to 5 - success (condition set through context)', function (assert) {
	var m = new Map([['a', 1], ['b', 2], ['c', 5]]);
	var s = new Set([4, 5, 6]);
	
	var retMap = fn(m).some(function (val) {
		return val === this.n;
	}, {n: 5});
	
	var retSet = fn(s).some(function (val) {
		return val === this.n;
	}, {n: 5});
	
	assert.equal(retMap, true, 'found 5 in Map');
	assert.equal(retSet, true, 'found 5 in Set');
});

QUnit.test('callback should receive (value, keyOrVal, MaporSet) ', function (assert) {
	var m = new Map([['a', 1]]);
	var s = new Set([2]);
	
	var retMap = fn(m).some(function (val, key, map) {
		assert.equal(val, 1, 'callback received value 1');
		assert.equal(key, 'a', 'callback received key "a"');
		assert.equal(map, m , 'callback received Map "m"');
	});
	
	var retSet = fn(s).some(function (val, key, set) {
		assert.equal(val, 2, 'callback received value 1');
		assert.equal(key, 2, 'instead of key, callback received value 2 again');
		assert.equal(set, s , 'callback received Set "s"');
	});
});

QUnit.module('every - ES6 collections');

QUnit.test('every with empty collection should return true', function (assert) {
	var m = new Map();
	var s = new Set();
	
	var retMap = fn(m).every(function () {});
	
	var retSet = fn(s).every(function () {});
	
	assert.equal(retMap, true, 'true - Map');
	assert.equal(retSet, true, 'true - Set');
});

QUnit.test('every element equals to 5 - success', function (assert) {
	var m = new Map([['a', 5], ['b', 5], ['c', 5]]);
	var s = new Set([5, 5, 5]);
	
	var retMap = fn(m).every(function (val) {
		return val === 5;
	});
	
	var retSet = fn(s).every(function (val) {
		return val === 5;
	});
	
	assert.equal(retMap, true, 'all 5 in Map');
	assert.equal(retSet, true, 'all 5 in Set');
});

QUnit.test('every equals to 5 - failure', function (assert) {
	var m = new Map([['a', 5], ['b', 5], ['c', 4]]);
	var s = new Set([5, 3, 5]);
	
	var retMap = fn(m).every(function (val) {
		return val === 5;
	});
	
	var retSet = fn(s).every(function (val) {
		return val === 5;
	});
	
	assert.equal(retMap, false, 'no all 5 in Map');
	assert.equal(retSet, false, 'no all 5 in Set');
});

QUnit.test('every equals to 5 - success (condition set through context)', function (assert) {
	var m = new Map([['a', 5], ['b', 5], ['c', 5]]);
	var s = new Set([5, 5]);
	
	var retMap = fn(m).every(function (val) {
		return val === this.n;
	}, {n: 5});
	
	var retSet = fn(s).every(function (val) {
		return val === this.n;
	}, {n: 5});
	
	assert.equal(retMap, true, 'found all 5 in Map');
	assert.equal(retSet, true, 'found all 5 in Set');
});

QUnit.test('callback should receive (value, keyOrVal, MaporSet) ', function (assert) {
	var m = new Map([['a', 1]]);
	var s = new Set([2]);
	
	var retMap = fn(m).every(function (val, key, map) {
		assert.equal(val, 1, 'callback received value 1');
		assert.equal(key, 'a', 'callback received key "a"');
		assert.equal(map, m , 'callback received Map "m"');
	});
	
	var retSet = fn(s).every(function (val, key, set) {
		assert.equal(val, 2, 'callback received value 1');
		assert.equal(key, 2, 'instead of key, callback received value 2 again');
		assert.equal(set, s , 'callback received Set "s"');
	});
});