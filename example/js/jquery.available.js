(function($){

  // first we define some private variables
  var

  // this array will be the function queue
  // it will go like: [[item1, item2, ...]
  queue = []

  // this id will identify each call uniquely
  ,uuid = 0

  // this is the polling interval, it can be checked, stopped, and restarted
  ,interval

  ,execute = function(item){
    // apply the function within the context of the original selector
    try {
      if (item.multiple){
        $(item.selector).each(function(){
          var data = $(this).data();

          if ('object'!==typeof(data['jquery.available'])){
            data['jquery.available'] = {};
          }

          if (!data['jquery.available'][item.uuid]){
            item.fn.apply($(this));

            // multiple elements are marked as done via uuid
            data['jquery.available'][item.uuid] = true;
          }
        });
      } else {
        item.fn.apply($(item.selector).eq(0));
      }
    } catch (e) {
      if (typeof console != 'undefined') { console.log(e); }
    }
  }

  ,test = function(item){
    // check if each selector's element is ready, we want to know if 0th index for the jQuery object is null or not (this is the actual element) 
    // if the element is not null, the opening tag is guaranteed to exist, but not necessarily the closing tag
    // so we also check for the next element, or isReady just in case it's the last element on the page
    // if turbo mode is used, then we only check for the opening tag, this makes prepending or changing css "instant" on larger nodes
    if ($(item.selector)[0] && 
      ( item.turbo || 
        $(item.selector).next()[0] || 
	$.isReady
      ) 
    ) {
      return true;
    } else {
      return false;
    }
  },

  // this function checks to see if an element is ready, and if so applies the corresponding function to it
  worker = function(){

    // go through each row of the queue
    for (var i = 0; i < queue.length; i++) {

      if ( test(queue[i]) ) {
        execute(queue[i]);

        if ( !queue[i]['multiple'] ){
          // remove the finished row from the queue
          queue.splice(i, 1);

          // back up the counter by 1 so we don't skip the next item
          i--;
        }
      }
    }

    // if the queue is empty, or the dom is ready (meaning element(s) weren't found), clear the interval so it doesn't run forever
    if (!queue.length || $.isReady) {
      interval = clearInterval(interval);
    }

  };

  // this is the public jQuery protoype method
  $.fn.available = function(fn, turbo, multiple){

    // default turbo to false
    var turbo = turbo || false
        ,multiple = multiple || false;

    uuid++;

    var item = {
      selector: this.selector
      ,fn: fn
      ,turbo: turbo
      ,multiple: multiple
      ,uuid: uuid
    };

 
    if ( !$.isReady && 
      (!test(item) || multiple) ) {

      // add the selector, the function, and whether or not turbo should be used to the queue
      queue.push(item);

      // if the polling is not going, start it up and run it as fast as possible- 1ms delay
      // it won't really run 1000 times per second though, probably more like 10 depending on the environment
      if (!interval) {
        interval = setInterval(worker, 1);
      }
    } else {
      execute(item);
    }

    // allow for chaining
    return this;

  };
        
  $.fn.available.queue = queue; 

})(jQuery);