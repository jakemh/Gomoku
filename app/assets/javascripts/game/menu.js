var Menu = function () {
  var $window = $(window);

  var dragging = false;
  var slideMenuWidth = 10;
  var orig = 0;
  var $slider = $(".slide-left");
  var moveLeft = 0; // The two variables define the distance
  var moveDown = 0;

  $window.on("mouseup", function (p) {
    dragging = false;

    // $(window).enableSelection()

  });

  $window.on("mousemove", _.throttle(function (p) {
    p.preventDefault();
    var dist = $window.width() - p.pageX;

    if (dragging && $slider.width() <= 160 && $slider.width() >= 30) {
      slideMenuWidth = dist;
      $slider.width(Math.max(Math.min(dist + orig, 160), 30));

    } else if ($slider.width() >= 160) {
      $slider.width(160);
    }
  }, 50));


  $window.on("resize", function () {
    var varWidth = Math.min($window.height() * 0.7, $window.width() * 0.7);
    $(".square").width(varWidth / numRows);
    $(".square").height($(".square").width());
    // $(".slide-left").css('left',$(window).width() - slideMenuWidth);

  });

  $(".slide-left").on("mousedown", function (p) {
    console.log($(this).attr('class'));
    // p.preventDefault()


    orig = $(".slide-left").width() - ($(window).width() - p.pageX);
    console.log("ORIG: " + orig);
    dragging = true;

    // $(window).disableSelection();

  });

};