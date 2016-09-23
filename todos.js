$.fn.todoList = function(options) {
  // this === jQuery elements selected (always an array)
  // this = [
  //   jQueryObject, // $('.todo-list').eq(0)
  //   jQueryObject // $('.todo-list').eq(1)
  // ]

  this
    .on('todos.item-add', function(event, text) {
      console.log(text);
    })
    .on('todos.before-item-add', function (event, value, complete) {
      if (value !== '' || true) {
        complete();
      }
    });

    return this.each(function() {
    // Plugin Code
    // this === DOMElement // $('.todo-list')[0]
    var $container = $(this);

    var config = {
      titleSelector: '.list-plugin-title',
      itemsSelector: '.list-plugin-items',
      inputSelector: '.list-plugin-input',
      inputTogglerSelector: '.list-plugin-hide',
      templateSelector: '#list-template'
    };

    $.extend(config, options);

    // Do we need to grab the template first?
    if (config.templateSelector) {
      var template = $(config.templateSelector).html();
      $container.html(template);
    }

    // Inject title of list
    $container.find(config.titleSelector).text(config.title);

    //toggle "done" class on click
    $container.find(config.itemsSelector).on('click', 'li', function(){
      $(this).toggleClass("list-plugin-done");
    });

    //delete item when trash is clicked on
    $container.find(config.itemsSelector).on('click', 'li span', function(event){
      $(this).parent().fadeOut(500, function() { //fadeout
        $(this).remove();                        //then remove
      });
      //jQuery method that stops event bubbling to other elements
      //keeps the li click listener from triggering
      event.stopPropagation();
    });

    // make list sortable
    $container.find(config.itemsSelector).sortable({ axis: 'y' });

    //add a new item if "Enter" key is pressed
    $container.find(config.inputSelector).on('keypress', function(event){
      if (event.which === 13){
        // Validate event
        $container.trigger('todos.before-item-add', [$(this).val(), function() {
          //get input value
          var todoText = $(this).val();
          $(this).val("");
          //create new li and add to ul
          $container.find(config.itemsSelector).prepend("<li class='grabbable'>" + todoText + " <span><i class='fa fa-trash'></i></span></li>");

          // Triggering / Listening through jQuery: $(...).on('item-add', callback);
          $container.trigger('todos.item-add', [todoText]);
        }.bind(this)]);
      }
    });

    //hide text input on plus button click
    $container.find(config.inputTogglerSelector).on('click', function() {
      $container.find(config.inputSelector).fadeToggle();
    });
  });
};

$(document).ready(function(){

  $('#todo-list').todoList({
    title: 'Todo List'
  });

});
