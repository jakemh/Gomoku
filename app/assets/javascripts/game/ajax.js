Ajax = function () {

	Ajax.sendHumanMove = function(options){
		return $.ajax({
			url: '/send_human_move/',
			type: 'post',
			async: true,
			data: $.param(options),
			dataType: 'script',
			beforeSend: function (xhr) {
				
				// xhr.setRequestHeader("Accept", "text/javascript");
				xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
			}
		})
	}

	Ajax.prototype.startNewGame = function(){
		return $.ajax({
			url: '/games/new/',
			type: 'get',
			async: false,
			dataType: 'json',
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Accept", "application/json");
				xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
			}
		})
	}

	Ajax.prototype.sendOptions = function(id, send_data){
		alert(send_data)
		return $.ajax({
			url: '/games/' + id + '/update',
			type: 'put',
			async: false,
			data: send_data,
			// dataType: 'json',
			beforeSend: function (xhr) {

				// xhr.setRequestHeader("Accept", "application/json");
				xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
			}
		})
	}
}