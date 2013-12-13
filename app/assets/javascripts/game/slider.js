var Slider = function (delegate) {
  var $window = $(window);

  var dragging = false;
  var slideMenuWidth = 10;
  var orig = 0;
  var $slider = $(".title");
  var moveLeft = 0; // The two variables define the distance
  var moveDown = 0;
  var MAX_WIDTH = 300;
  var MIN_WIDTH = 180;
  var INITIAL_WIDTH_ON_MD;
  var wasDragged;
  var origClick;
  var origDiff;
  $slideLeft = $(".title")
  $window.on("mouseup", function (p) {
    dragging = false;
    $slider.data({"dragging" : false});
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
    mouseX = p.pageX
    $slider.data({"isDragging" : true});

    offSetOrig = $slider.offset();
    offsetObj = {top : offSetOrig.top, left : p.pageX - origDiff }
    var dist = $window.width() - p.pageX;

    if (dragging && $slider.position().left >= 0 && $slider.position().left <= 118) {
         var setVal = p.pageX - origDiff
         var gap = $slider.offset().left - $slider.position().left;
         console.log(gap);
         console.log("S-G " + (setVal - gap));
         if (setVal - gap <= 0) setVal = 0 + gap;
         if (setVal - gap >= 119) setVal = 118 + gap;
         // setVal = Math.max(Math.min(setVal, MAX_WIDTH), MIN_WIDTH)
         // $slider.offset({top : offSetOrig.top, left : setVal })
         $slider.offset({top : offSetOrig.top, left : setVal});
      // $slider.width(Math.max(Math.min(dist + orig, MAX_WIDTH), MIN_WIDTH));

    } else if ($slider.width() >= MAX_WIDTH) {
      $slider.width(MAX_WIDTH);
    }
  }, 50));


  $(".title").on("mousedown", function (p) {

    mouseX = p.pageX
    origDiff = mouseX - $slider.offset().left
    console.log("MOUSE: " + mouseX)
    origClick = $(window).width() - p.pageX;

    offSetOrig = $slider.offset();
    posOrig = $slider.position();
    offsetObj = {top : offSetOrig.top, left : p.pageX }
    // p.preventDefault()
    var val = parseInt($(this).css("left").match(/\d+/))
    INITIAL_WIDTH_ON_MD = $(".slide-left").width()

    orig = $(".title").width() - ($(window).width() - p.pageX);
    $slider.data({"dragging" : false});
    $slider.data({"isDragging" : false});

    dragging = true;

    // $(window).disableSelection();

  });
  $(".title").on("click", function (p) {
    // p.preventDefault()
    if  ($(".slide-left").width() > INITIAL_WIDTH_ON_MD){

  } else{ //closing 

  }


    // $(window).disableSelection();

  });
};