ScrollBall = function (delegate) {
    var boardAdjOn = false;
    $('.board').on("mouseover", function (p) {
        var upperLeft = $('.board').offset();

        var boardX = upperLeft.left;
        var boardY = upperLeft.top;
        var absX = Math.abs(boardX - p.pageX);
        var absY = Math.abs(boardY - p.pageY);
        var graceArea = 15;
        if (absX < graceArea && absY < graceArea && boardAdjOn === false) {
            $('.board-adj').css({
                opacity: 0,
                left: boardX - 5,
                top: boardY - 5,
                display: 'block'
            }).stop().animate({
                opacity: 0.8
            }, {duration: 600, queue: false});
            boardAdjOn = true;
        }
    });

    $(".board-adj").on("mouseout", function () {
        boardAdjOn = false;
        $(this).stop().fadeOut();
    });
    var boardAdjMD = false;
    $(".board-adj").on("mousedown", function (p) {
        boardAdjMD = true;
        startY = p.pageY;
    });

    var prevY, yMovement, startY, prevDist;
    $(window).on("mousemove", _.throttle(function (p) {
        if (boardAdjMD === true) {
            $('.board-adj').css({
                opacity: 0.6,
                left: p.pageX - 10,
                top: p.pageY - 10,
                display: 'block'
            });

            var dist = Math.round((p.pageY - startY) / 10);
            var change = prevDist - dist;
            if (change == 1) {
                delegate.changePos();
            } else if (change == -1) {
                delegate.changeNeg();

            }
            prevDist = dist;
        }
    }, 50));

    $(".board-adj").on("mouseup", function () {
        if (boardAdjMD === true) {
            boardAdjMD = false;
            delegate.newGame();
        }
    });

    $(window).on("mouseup", function () {
        boardAdjMD = false;

    });

}