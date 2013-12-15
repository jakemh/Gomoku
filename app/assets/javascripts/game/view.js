var View = function (delegate) {

  /* private variables */
  var _this = this;
  var loaderContainerHTML = '<div class="loader"> <div class="spinner-holder"></div></div>';
  var loaderHTML = '<div id="floatingBarsG"><div class="blockG" id="rotateG_01"></div><div class="blockG" id="rotateG_02"></div><div class="blockG" id="rotateG_03"></div><div class="blockG" id="rotateG_04"></div><div class="blockG" id="rotateG_05"></div><div class="blockG" id="rotateG_06"></div><div class="blockG" id="rotateG_07"></div><div class="blockG" id="rotateG_08"></div></div>';

  /* public variables */
  this.textBox = $('.info-box');
  this.$blackStone = $("<div class='stone black-stone' ></div>");
  this.$whiteStone = $("<div class='stone white-stone' ></div>");
  this.$board = $('.board');
  this.$outer = $('.outer');
  this.applyLoader = true;
  this.squareArray = [];
  this.forceMove = false;
  this.timer = null;

  $window = $(window)
   this.$outer.data({
     "rows": _this.$board.attr('id')
   });

  $(".title").on("click", function (p) {
    if ($(".title").data("isDragging") != true){
    delegate.newGame();
  }
  });

  $(".force-move").on("click", function () {
    // _this.forceMove = true;
    if  ($(".force-move").text() == "Again?"){
      $('.force-move').removeClass('loading-background');
      delegate.newGame();
    }else{
    delegate.forceMoveButton();
    $('.force-move').addClass('loading-background');
  }
  });

  $(window).on("resize", function () {
    var varWidth = Math.min($window.height() * 0.7, $window.width() * 0.7);
    $(".square").width(varWidth / delegate.getRows());
    $(".square").height($(".square").width());
    // $(".slide-left").css('left',$(window).width() - slideMenuWidth);

  });
  this.addLoader = function(){
    $('.board').append(loaderContainerHTML);
  }
 

  this.clearMenuTextBox = function(){
    $(".info-box").text("");

  }

  this.addTitleButtonLoadBackground = function() {

  }

  $(".outer").on("click", ".square", _.debounce(delegate.makeMove, 100));

  

  this.removeTitleLoadingBackground = function () {
    $(".title-cont").removeClass('loading-background');
  };

  $(".edit_game").on("submit", function (e) {
    delegate.sendOptions();

    e.preventDefault();
  });

  this.renderBoard = function(rows) {
    for (var i = 0; i < rows; i++) {
      _this.squareArray[i] = new Array(rows);
      $(".board").append("<div class='row'id='row" + i + "'>");
      for (var j = 0; j < rows; j++) {
        var newSquare = $("<div class='square'><div/>");
        newSquare.data({
          coord: [i, j]
        });
        $("#row" + i).append(newSquare);
        _this.squareArray[i][j] = newSquare;
      }
      $(".board").append("</div>");
    }
    var varWidth = Math.min($(window).height() * 0.7, $(window).width() * 0.7);

    $(".square").width(varWidth / rows);
    $(".square").height($(".square").width());
  };

  this.win = function (thisData) {

    for (var i = 0; i < thisData.length; i++) {
      _this.squareArray[thisData[i][0]][thisData[i][1]].children().addClass("highlight");
    }
    
    this.gameOver();

  };

  this.gameOver = function(){
    _this.removeSpinner();
    $('.force-move').css({
      opacity: 0,
      display: 'inline-block'
    }).animate({
      opacity: .6
    }, 600).text("Again?")
  }
  
  this.tie = function () {
    this.gameOver();
  };


  this.removeSpinner = function () {
    if (this.timer != null){
      this.timer.endTimer();
      this.timer = null;
    }
    _this.applyLoader = false;
    $('.spinner-holder').empty();
    $('.loader').fadeOut();
    $('.force-move').fadeOut();
  };

  var appendForceButton = function () {
    $('.force-move').removeClass('loading-background');
    $('.force-move').css({
      opacity: 0,
      display: 'inline-block'
    }).animate({
      opacity: .6
    }, 600).text("Go!")
  };

  this.startSpinner = function () {
    this.timer = new Timer();
    if (_this.applyLoader === true) {
      this.timer.startTimer(function (elapsed) {
        console.log(elapsed);
        if (elapsed > 1 && _this.applyLoader === true){
          $('.spinner-holder').append(loaderHTML);
          $('.loader').fadeIn("slow");
          _this.applyLoader = false;
        }

        if (elapsed > 5) {

          // alert("5 seconds")
          if ($('.force-move').css('display') == "none") {
            appendForceButton();
          }
        }
      });

      
    }
  };

};