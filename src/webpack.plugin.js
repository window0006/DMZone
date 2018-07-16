class HelloPlugin {
	// the plugin is installed once as Webpack starts up, by calling its apply method.
	apply(compiler) {
		// bind callbacks that provide a reference to each new compilation.
		// plugins can inject custom build steps with `plugin` method
		compiler.plugin('compilation', (compilation) => {

		})
	}
}

var arr = [3, 2, 5, 4, 1];

function swap(a, b) {
	var temp = arr[a];
	arr[a] = arr[b];
	arr[b] = temp;
}

function bubblesort() {
	for (var i = 0; i < arr.length; i ++) {
		bubbleOnce(i);
	}
}

function bubbleOnce(j) {
	for (var i = arr.length - 1; i >= j; i--) {
		if (arr[i] < arr[i - 1]) {
			swap(i, i - 1);
		}
	}
}

function quickSort(arr) {
	var key = arr[0];
	var left = [];
	var right = [];
	
	for (var i = 1; i < arr.length; i++) {
		if (arr[i] < key) {
			left.push(arr[i]);
		} else {
			right.push(arr[i]);
		}
	}

	if (left.length > 1) {
		left = quickSort(left);
	}
	if (right.length > 1) {
		right = quickSort(right);
	}

	return left.concat([key]).concat(right);
}