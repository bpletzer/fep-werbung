(function(window, cwd){
	window[cwd]=window[cwd]||[];
	var cwd = window[cwd],
		cInterface = {},
		current;

	cInterface.cmd = function(){
		console.log(this, arguments)
	}

	cwd.push = function(item){

		var cmd = item[0],
			sync = (this===cwd);
			
		[].shift.apply(item);

		try {
			cInterface[cmd].apply(sync, item);
		} catch (e) {}
	}

	while (current = [].shift.apply(cwd)) {
		cwd.push.apply(false, [current])
	}
})(window, 'cwd')