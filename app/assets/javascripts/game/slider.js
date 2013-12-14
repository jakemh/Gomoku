var Slider = function (delegate) {
  var $window = $(window);

  var sliding = false;
  var slideMenuWidth = 10;
  var orig = 0;
  var $slider = $(".title");
  var $slideLeft = $slider
  var moveLeft = 0; // The two variables define the distance
  var moveDown = 0;

  var INITIAL_WIDTH_ON_MD;
  var wasDragged;
  var origClick;
  var origDiff;

  var MIN_OFFSET = 0;
  var MAX_OFFSET = 118;
  var DEFAULT = 58;
  var MIDDLE = 58;

  var clickedDownOnSlider = false;
  function init(){

    var depth = delegate.getDepth();
    if (depth <= 4){
      DEFAULT = 0;
    }else if (depth >= 5 && depth <= 6){
      DEFAULT = 58;
    } else{
      DEFAULT = MAX_OFFSET;
    }
    $slideLeft.offset({top : $slider.offset().top, left : DEFAULT + ($slider.offset().left - $slider.position().left)});

  }

  init();
  var $slideLeft = $(".title")
  $window.on("mouseup", function (p) {
    sliding = false;
    $slider.data({"dragging" : false});
    if ($slider.position().left == 0){
      delegate.updateDepth(4);
    }else if ($slider.position().left == MAX_OFFSET){
      delegate.updateDepth(8);

    } else{
      //animate back to center
      $slider.animate({left : MIDDLE})
      delegate.updateDepth(6);
    }
    clickedDownOnSlider = false;
  
  });

  $window.on("mousemove", _.throttle(function (p) {
    p.preventDefault();
    mouseX = p.pageX
    $slider.data({"isDragging" : true});

    offSetOrig = $slider.offset();
    offsetObj = {top : offSetOrig.top, left : p.pageX - origDiff }
    var dist = $window.width() - p.pageX;

    if (sliding && $slider.position().left >= 0 && $slider.position().left <= 118) {
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
    clickedDownOnSlider = true;
    mouseX = p.pageX
    origDiff = mouseX - $slider.offset().left
    console.log($slider.position().left)
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

    sliding = true;

    // $(window).disableSelection();

  });
 
};