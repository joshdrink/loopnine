// Nocturne Dance Grid / 2014 --------------------------------------------------

	// Authored by: Josh Beveridge @ Norex
    // Modified by: Kyle Ramey @ Norex
	// 2014/10

// Square ----------------------------------------------------------------------

	$(document).ready(function() {

		var pageHeight = $(window).height();
		var pageWidth = $(window).width();

		$('.grid').css('width', pageHeight + "px");
		$('.menu').css('width', pageWidth - pageHeight + "px");

		var boxWidth = $('.art').width();

		$('.row').css('height', boxWidth + "px");


        //Web Sockets
        var webSocket = new WebSocket("ws://echo.websocket.org");

        webSocket.onmessage = function(event){
            $('#result').append(event.data + '\n');

            var res = parseInt(event.data);

            if(res > 0 && res < 10){
                $('#' + res).removeClass('secondary').addClass('success');
            }else if(res < 0 && res > -10){
                $('#' + (res*-1)).removeClass('success').addClass('secondary');
            }
        }

        $('.art').on('click', function(e){
            parent = $(e.target).parent('.art');
           if(parent.hasClass('active'))
                deactivate(parent.attr('id'));
            else
                activate(parent.attr('id'));
        });

        function activate(num){
            $('#' + num).addClass('active');
        }

        function deactivate(num) {
            abs = Math.abs(num);
            $('#' + abs).removeClass('active');
        }

	});
