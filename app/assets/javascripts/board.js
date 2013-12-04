$(document).ready(function(){
  // $.ajaxSetup({ 
  //   cache: false 
  // });
  var $blackStone, $whiteStone, $window
  $window = $(window)
  var applyLoader = true
  var $board = $('.board')
  var $outer = $('.outer')
  $outer.data({"rows" :$board.attr('id')}) 
  var numRows;
  var boardActive = true
  var squareArray;
  var pieceArray;
  var loaderContainerHTML = '<div class="loader"> <div class="spinner-holder"></div></div>'
  var loaderHTML = '<div id="floatingBarsG"><div class="blockG" id="rotateG_01"></div><div class="blockG" id="rotateG_02"></div><div class="blockG" id="rotateG_03"></div><div class="blockG" id="rotateG_04"></div><div class="blockG" id="rotateG_05"></div><div class="blockG" id="rotateG_06"></div><div class="blockG" id="rotateG_07"></div><div class="blockG" id="rotateG_08"></div></div>'
  Server = function(){}
  var server = new Server()
  var makeMove = function(){
        // $(this).css('background-color', '#C3E6E4');
        // $(this).addClass('black-stone');
        if (boardActive == true){
          $this = $(this)
          coord = $this.data("coord")
          console.log(coord)
          var isNewGame = boardEmpty();
          if (addBlackPiece(coord) == true){
            server.sendHumanMove({"coord" : coord})
            disableBoard()
        }else{

        }
        }
  }

  // $(".square").on("click", _.debounce(makeMove, 100))

$(".title-cont").on("click", function(){
  newGame()
})

$(window)
.attr('unselectable', 'on')
.css('user-select', 'none')
.css('MozUserSelect', 'none')
.on('selectstart', false)
// .on('mousedown', false); 

var dragging = false;
var slideMenuWidth = 10;
var orig = 0;
var $slider = $(".slide-left")
  var moveLeft = 0;  // The two variables define the distance
  var moveDown = 0;

var resetGame = function(){

  newGame()
}

var boardEmpty = function(){
  if (pieceArray.length == 0){
    return true;
  }else return false;
}
var newGame = function(){
  server.startNewGame()

  $board.empty()
    $blackStone = $("<div class='stone black-stone' ></div>")
  $whiteStone = $("<div class='stone white-stone' ></div>")

  numRows = $(".outer").data("rows");
  boardActive = true
  squareArray = new Array(numRows)

  pieceArray = []
  buildBoard($outer.data("rows"))
> 
  //TODO should delegate
  $(".square").on("click", _.debounce(makeMove, 100))
  $('.board').append(loaderContainerHTML)

}

$(".edit_game").on("submit", function(e){
    console.log("submit")
    server.sendOptions($outer.data("game_id"), {"test" : false})
    e.preventDefault()

  })

$(".slide-left").on("mousedown", function(p) {
console.log($(this).attr('class')) 
        // p.preventDefault()


  orig =  $(".slide-left").width() - ($(window).width() - p.pageX)
  console.log("ORIG: " + orig)
dragging  = true; 
  
  // $(window).disableSelection();

  });

$("input[type=text]").on("click", function(e){
  // alert("TEST")
  // $(".slide-left").unbind("mousedown")
})

  $window.on("mouseup", function(p) { 
dragging  = false;  

  // $(window).enableSelection()

  }); 
    $window.on("mousemove", _.throttle(function(p) {
      p.preventDefault()
      var dist = $window.width() - p.pageX
      // console.log("DIST: " + dist)
      // console.log("PAGEX: " + p.pageX)
      // console.log("width: " + $slider.width())

        if (dragging &&  $slider.width() <= 160 && $slider.width() >= 30) {
          slideMenuWidth = dist
          $slider.width( Math.max(Math.min(dist + orig, 160), 30)) 

  } else if ($slider.width() >= 160){
    $slider.width(160) 
  }
  }, 50));


  $window.on("resize", function(){
		// var varWidth = max($(window).width() * .7, $(window).height());
		var varWidth = Math.min($window.height() * .7, $window.width() * .7);
   $(".square").width(varWidth / numRows)

   $(".square").height($(".square").width())
   // $(".slide-left").css('left',$(window).width() - slideMenuWidth);

 })

  function disableBoard(){
    boardActive = false
  }

  function enableBoard(){
    boardActive = true
  }

  function buildBoard(rows){
    for (var i = 0; i < rows; i++){

      squareArray[i] = new Array(rows)
      $(".board").append("<div class='row'id='row"+i+"'>")
      for (var j = 0; j < rows; j++){
        var newSquare = $("<div class='square'><div/>")
        newSquare.data({coord: [i,j]})
        $("#row" + i).append(newSquare)
      squareArray[i][j] = newSquare
    }
    $(".board").append("</div>")
  }
  var varWidth = Math.min($(window).height() * .7, $(window).width() * .7);

  $(".square").width(varWidth / rows)
  $(".square").height($(".square").width())
}

  var addPiece = function(coord, element){

    squareArray[coord[0]][coord[1]].append(element)
    pieceArray.push(element)
  }

  var addWhitePiece = function(coord){
    console.log("COORD: " + coord)
    addPiece(coord, $whiteStone.clone());
    squareArray[coord[0]][coord[1]].children('.white-stone').hide().fadeIn("slow")
  }


  var addBlackPiece = function(coord){
    if (squareArray[coord[0]][coord[1]].children(".stone").length > 0){
      // alert("NOT EMPTY" + squareArray[coord[0]][coord[1]].children())
      return false

    } else{
      addPiece(coord, $blackStone.clone());
      return true
    }

  }
  var win = function(thisData){
      // alert("BLACK")

            for (var i = 0; i < thisData.length; i++){
              squareArray[thisData[i][0]][thisData[i][1]].children().addClass("highlight")
            }

            removeSpinner();
  }

  var tie = function(){
    removeSpinner();
  }

  var removeSpinner = function(){
    applyLoader = false
     $('.spinner-holder').empty()
    $('.loader').fadeOut()
  }

   Server.prototype.startNewGame  = function(){
     $.ajax({
       url: '/games/new/',
       type: 'get',
       async: true,
       dataType: 'json',
       beforeSend: function(xhr) {
         xhr.setRequestHeader("Accept", "application/json");
         xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
       }
       }).done(function(data){
        console.log(data)
        $outer.data({"rows" : data.rows, "win_chain" : data.win_chain, "game_id" :  data.game_id})

       }).fail(function(data){ 
       }).always(function(){
       });
     }
  

  Server.prototype.sendHumanMove = function(opt){
    // alert("start h")
    options = opt || {}
    $.ajax({
      url: '/send_human_move/',
      type: 'post',
      async: true,
      data: $.param(options),
      dataType: 'script',
      beforeSend: function (xhr) {
        applyLoader = true
         setTimeout(function(){
          if (applyLoader == true){
          $('.spinner-holder').append(loaderHTML)

          $('.loader').fadeIn("slow")
        }
        }, 300)
       
        // xhr.setRequestHeader("Accept", "text/javascript");
        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
      }
    }).done(function (data) {
      // console.log("success h")
      server.getAIMove('/get_ai_move/', 0);
      // window.punct_hash = data
    }).fail(function (data) {
      // alert("FAIL H")
      // console.log("FAIL H")
    }).always(function (data) {
      // console.log("Done h")

    });
  }

  Server.prototype.getAIMove = function(path, count){
    $.ajax({
      url: path,
      type: 'get',
      async: true,
      timeout:99999999, 
      dataType: 'json',
      beforeSend: function(xhr) {
        // xhr.setRequestHeader("Accept", "application/json");
        // xhr.setRequestHeader('X-CSRF-Token');
      }
    }).done(function(data){
        // hash = JSON.parse(data)
        
        // alert(hash.coord[1])


      }).fail(function(data){ 
        // alert("FAIL C")
        // alert(data.coord[1])
        console.log("FAIL")
        console.log(data)

        console.log(JSON.stringify(data.coord))
        // console.log(JSON.parse(data))
        console.log("FAIL C")

      }).always(function(data, xhr, jqXHR){
        if (window.XMLHttpRequest)
          {
            console.log("TEST")
              xmlhttp = new XMLHttpRequest();
              console.log(jqXHR.getAllResponseHeaders())
              console.log(jqXHR)

          } else{
            console.log("WTF?")
          }

        console.log("DONE C")
        console.log(data)
        if (typeof data == "string"){
          console.log("IS A STRING?")
          // console.log("parsed string: " + JSON.parse(data))
          console.log(data)
        }
        console.log("TYPE: " + typeof data)

        try{
          // alert(JSON.stringify(data))
          console.log(JSON.stringify(data))
          if (data != null && (data.coord != null || data["0"] != null || data["1"] != null || data["tie"] != null)){
            if ("coord" in data){
              console.log("not null C: " + JSON.stringify(data))
              if (data.p2_moves.length > ((pieceArray.length - 1) / 2)){
                coord = data.coord
                addWhitePiece(coord)
                enableBoard()
                removeSpinner();
              } else{
                console.log("RETURNED WRONG MOVE, KEEP CHECKING")
                server.getAIMove('/get_ai_move_retry/', count + 1)
              }
            
            } else if ("0" in data){

             win(data["0"])

            } else if ("1" in data){
              coord = data.winCoord
              addWhitePiece(coord)
              win(data["1"])
            } else if ("tie" in data){
              tie()
            }
        
        } else{
                  console.log("data null C")
                  if (count > 30){
                    console.log("COUNT EXCEEDED 30")
                    return;
                  }
                  setTimeout(function() {  server.getAIMove('/get_ai_move_retry/', count + 1) }, 1000 * count / 4);

        }
        }catch (e){
          if (e instanceof TypeError){
            console.log("***ERROR***")
           server.getAIMove('/get_ai_move_retry/', count + 1)

          }
        }
      });
    }

  Server.prototype.sendOptions = function (id, opt) {
    options = opt || {}
    send_data = $(".edit_game").serialize()
    $.ajax({
      url: '/games/'+id+'/update',
      type: 'put',
      async: false,
      data: send_data,
      dataType: 'json',
      beforeSend: function (xhr) {
        // alert(JSON.stringify(send_data))

        // $('.spinner-holder').append(loaderHTML)
        // $('.loader').show()
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
      }
    }).done(function (data) {
      // alert("OK")
      // console.log("success h")
      // server.getAIMove('/get_ai_move/', 0);
      // window.punct_hash = data
    }).fail(function (data) {
      // alert("FAIL H")
      // console.log("FAIL H")
    }).always(function (data) {
      // console.log("Done opt")
      $outer.data({"rows" : data.rows})

    }); 
  }
  newGame()

});

