Timer = function () {
  var _this = this;
  var _timer;
  this.elapsed;

  this.startTimer = function (callback) {
      var start = new Date().getTime();
        _this.elapsed = '0.0';

      _timer = window.setInterval(function () {
        var time = new Date().getTime() - start;

        elapsed = Math.floor(time) / 1000;
        if (Math.round(elapsed) == elapsed) {
          _this.elapsed += '.0';
        }

        callback(elapsed);
      }, 1000);
    };

    this.endTimer = function () {
      window.clearInterval(_timer);

    };
};