var Menu = function (delegate) {
  var $window = $(window);

  var dragging = false;
  var slideMenuWidth = 10;
  var orig = 0;
  var $slider = $(".slide-left");
  var moveLeft = 0; // The two variables define the distance
  var moveDown = 0;
  var MAX_WIDTH = 160;
  var MIN_WIDTH = 30;
  var INITIAL_WIDTH_ON_MD;
  var wasDragged;
  $slideLeft = $(".slide-left")
  $window.on("mouseup", function (p) {
    dragging = false;
    if (INITIAL_WIDTH_ON_MD - $slideLeft.width() == 0   && !$(p.target).is("input")){
      if ($slideLeft.width() > MIN_WIDTH){
      //click
      $slideLeft.animate({width: MIN_WIDTH})
    } else{
      $slideLeft.animate({width: MAX_WIDTH})
    } 

  }
  });

  $window.on("mousemove", _.throttle(function (p) {
    p.preventDefault();
    var dist = $window.width() - p.pageX;

    if (dragging && $slider.width() <= MAX_WIDTH && $slider.width() >= MIN_WIDTH) {
      slideMenuWidth = dist;
      $slider.width(Math.max(Math.min(dist + orig, MAX_WIDTH), MIN_WIDTH));

    } else if ($slider.width() >= MAX_WIDTH) {
      $slider.width(MAX_WIDTH);
    }
  }, 50));


 

  $(".slide-left").on("mousedown", function (p) {
    console.log($(this).attr('class'));
    // p.preventDefault()
    INITIAL_WIDTH_ON_MD = $(".slide-left").width()

    orig = $(".slide-left").width() - ($(window).width() - p.pageX);
    console.log("ORIG: " + orig);
    dragging = true;

    // $(window).disableSelection();

  });
  $(".slide-left").on("click", function (p) {
    // p.preventDefault()
    if  ($(".slide-left").width() > INITIAL_WIDTH_ON_MD){

  } else{ //closing 

  }


    // $(window).disableSelection();

  });
};