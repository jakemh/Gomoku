var Slider = function (delegate) {
  var $window = $(window);

  var sliding = false;
  var slideMenuWidth = 10;
  var orig = 0;
  var $slider = $(".title");
  var $slideLeft = $slider;
  var moveLeft = 0; // The two variables define the distance
  var moveDown = 0;

  var INITIAL_OFFSET_ON_MD;
  var wasDragged;
  var origClick;
  var origDiff;

  var MIN_OFFSET = 0;
  var MAX_OFFSET = 118;
  var DEFAULT = 58;
  var MIDDLE = 58;
  var posHash = {4 : MIN_OFFSET, 6 : MIDDLE, 8 : MAX_OFFSET}
  var clickedDownOnSlider = false;
  var depth;
  function init(){

    depth = delegate.getDepth();
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

  $slider.on({
      mouseenter: function() {
         $slider.data({"onSlider" : true});
      },
      mouseout: function() {
         $slider.data({"onSlider" : false});
      }
  });

  $window.on("mouseup", function (p) {
    sliding = false;
    $slider.data({"dragging" : false});
    if ($slider.data("onSlider") == true){
    if ($slider.position().left == MIN_OFFSET){
      delegate.updateDepth(4);
      depth = 4;
    }else if ($slider.position().left == MAX_OFFSET){
      delegate.updateDepth(8);
      depth = 8;
    } else{
      //animate back to center
      $slider.animate({left : MIDDLE});
      delegate.updateDepth(6);
      depth = 6;
    }
  } else{
    $slider.animate({left : posHash[depth]});

  }
    clickedDownOnSlider = false;
  
  });

  $window.on("mousemove touchmove", _.throttle(function (p) {
    p.preventDefault();
    mouseX = p.pageX;
    $slider.data({"isDragging" : true});

    offSetOrig = $slider.offset();
    offsetObj = {top : offSetOrig.top, left : p.pageX - origDiff };
    var dist = $window.width() - p.pageX;

    if (sliding && $slider.position().left >= MIN_OFFSET && $slider.position().left <= MAX_OFFSET) {
         var setVal = p.pageX - origDiff;
         var gap = $slider.offset().left - $slider.position().left;
         if (setVal - gap <= MIN_OFFSET) setVal = MIN_OFFSET + gap;
         if (setVal - gap >= MAX_OFFSET) setVal = MAX_OFFSET + gap;
         $slider.offset({top : offSetOrig.top, left : setVal});
    }
  }, 50));


  $(".title").on("mousedown", function (p) {
    INITIAL_OFFSET_ON_MD = $slider.position().left;
    clickedDownOnSlider = true;
    mouseX = p.pageX;
    origDiff = mouseX - $slider.offset().left;
    console.log($slider.position().left);
    origClick = $(window).width() - p.pageX;

    offSetOrig = $slider.offset();
    posOrig = $slider.position();
    offsetObj = {top : offSetOrig.top, left : p.pageX };
    INITIAL_WIDTH_ON_MD = $(".slide-left").width();
    orig = $(".title").width() - ($(window).width() - p.pageX);
    $slider.data({"dragging" : false});
    $slider.data({"isDragging" : false});

    sliding = true;

  });
 
};