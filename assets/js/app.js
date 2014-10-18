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

        try {
            // Fix up for prefixing
            window.AudioContext = window.AudioContext||window.webkitAudioContext;
            context = new AudioContext();
        }
        catch(e) {
            alert('Web Audio API is not supported in this browser');
        }

        $('.art').on('click', function(e){
            parent = $(e.target).closest('.art');
           if(parent.hasClass('active'))
                deactivate(parent.data("grid-id"));
            else
                activate(parent.data("grid-id"));
        });

        function activate(num){
            text = Math.floor(Math.random() * 26) + 1;
            if(text < 10)
                $('.art[data-grid-id="'+num+'"]').append("<img class='text' src='/assets/img/text_0"+text+".png'>");
            else
                $('.art[data-grid-id="'+num+'"]').append("<img class='text' src='/assets/img/text_"+text+".png'>");
            $('.art[data-grid-id="'+num+'"]').addClass('active');
            var l = $('.art[data-grid-id="'+num+'"]').data('loop');
            loopList[l].object.volume = 1;
            loopList[l].object.gainNode.gain.value = 1;
        }

        function deactivate(num) {
            abs = Math.abs(num);
            $('.art[data-grid-id="'+abs+'"] .text').remove();
            $('.art[data-grid-id="'+abs+'"]').removeClass('active');
            var l = $('.art[data-grid-id="'+abs+'"]').data('loop');
            loopList[l].object.volume = 0;
            loopList[l].object.gainNode.gain.value = 0;
        }

        function chooseLoops(){
            for(var i=1; i<=6; i++){
                $('.art[data-grid-id="'+i+'"] .wrapper img').attr('src', '/assets/img/' + groupA[i-1].song.album.art);
                $('.art[data-grid-id="'+i+'"] .wrapper p').text('@' + groupA[i-1].song.artist.twitter);
                $('.art[data-grid-id="'+i+'"]').data('loop', 'loop' + i);
            }
            for(var i=1; i<=3; i++){
                $('.art[data-grid-id="'+(i+6)+'"] .wrapper img').attr('src', '/assets/img/' + groupC[i-1].song.album.art);
                $('.art[data-grid-id="'+(i+6)+'"] .wrapper p').text('@' + groupC[i-1].song.artist.twitter);
                $('.art[data-grid-id="'+(i+6)+'"]').data('loop', 'loop' + (i+6));
            }
        }
        chooseLoops();

        function loadImages(){
            $.each(album, function(){
                $('<img/>')[0].src = '/assets/img/' + this.art;
            });
            for(i=1;i<27;i++){
                if(i<10)
                    $('<img/>')[0].src = '/assets/img/text_0' + i + '.png';
                else
                    $('<img/>')[0].src = '/assets/img/text_' + i + '.png';
            }
        }

        loadImages();

        this.listLength = 9;
        this.cued_loops = 0;
        this.loops = [];

        $.each(loopList, function(){
            this.object = new Loop(this);
        });


        __this = this;

        window.addEventListener('loop_cued', function(e){
            console.log('loop_cued');
            __this.cued_loops++;
            console.log(__this.cued_loops);
            if(__this.cued_loops == __this.listLength){
                for(var i = 0; i < __this.listLength; i++){
                    console.log('playing');
                    loopList['loop' + (i+1)].object.playSound();
                }
            }
        });

        function Loop(source){
            this.url = '/assets/sound/' + source.url;
            this.loaded = false;
            this.volume = 0;
            this.length = 4;

            this.bar_counter = 1;

            this.load_buffer = function(){
                this.buffer_request = new XMLHttpRequest();
                this.buffer_request.open('GET', this.url, true);
                this.buffer_request.responseType = 'arraybuffer';

                var _this = this;

                this.buffer_request.onload = function(){
                    context.decodeAudioData(_this.buffer_request.response, function(buffer){
                        _this.audio_buffer = buffer;
                        _this.cue_sound();
                        console.log('loaded');
                    });

                }

                this.buffer_request.send();
            }

            this.cue_sound = function(){
                this.loaded = true;
                // this.loop(buffer);
                var event = new CustomEvent("loop_cued", {"detail":{"loop":this}});
                window.dispatchEvent(event);

                var _this = this;
            }

            this.playSound = function() {
                // console.log(this.audio_buffer);
                this.buffer_source = context.createBufferSource();      // creates a sound source
                this.buffer_source.buffer = this.audio_buffer;          // tell the source which sound to play

                this.gainNode = context.createGain();
                this.buffer_source.connect(this.gainNode);
                this.gainNode.connect(context.destination);

                this.buffer_source.loop = true;

                this.gainNode.gain.value = this.volume;
                // console.log(this.volume);

                // this.buffer_source.connect(context.destination);        // connect the source to the context's destination (the speakers)
                this.buffer_source.start(0);                            // play the source now
                                                                        // note: on older systems, may have to use deprecated noteOn(time);
            }

            this.load_buffer();
        }

        //$('.art[data-grid-id="5"] .wrapper').toggleClass('active');
	});
