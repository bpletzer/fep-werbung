(function(window){
	window.defined = [];

	window.define = function() {
		debugger
		window.defined.push(arguments);
	}
})(window)