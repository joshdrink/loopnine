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
        /*var webSocket = new WebSocket("ws://echo.websocket.org");

        webSocket.onmessage = function(event){
            $('#result').append(event.data + '\n');

            var res = parseInt(event.data);

            if(res > 0 && res < 10){
                $('#data-grid-id' + res).removeClass('secondary').addClass('success');
            }else if(res < 0 && res > -10){
                $('#data-grid-id' + (res*-1)).removeClass('success').addClass('secondary');
            }
        }*/

        $('.art').on('click', function(e){
            parent = $(e.target).closest('.art');
           if(parent.hasClass('active'))
                deactivate(parent.data("grid-id"));
            else
                activate(parent.data("grid-id"));
        });

        function activate(num){
            $('.art[data-grid-id="'+num+'"]').addClass('active');
        }

        function deactivate(num) {
            abs = Math.abs(num);
            $('.art[data-grid-id="'+abs+'"]').removeClass('active');
        }

        function chooseLoops(){
            for(var i=1; i<=6; i++){
                $('.art[data-grid-id="'+i+'"] .wrapper img').attr('src', '/assets/img/' + groupA[i-1].song.album.art);
                $('.art[data-grid-id="'+i+'"] .wrapper p').text('@' + groupA[i-1].song.artist.twitter);
            }
            for(var i=1; i<=3; i++){
                $('.art[data-grid-id="'+(i+6)+'"] .wrapper img').attr('src', '/assets/img/' + groupC[i-1].song.album.art);
                $('.art[data-grid-id="'+(i+6)+'"] .wrapper p').text('@' + groupC[i-1].song.artist.twitter);
            }
        }
        chooseLoops();

	});
