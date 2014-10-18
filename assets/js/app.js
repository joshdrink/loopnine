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
                activate(res);
            }else if(res < 0 && res > -10){
                deactivate(res);
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

        $('.art').on('mousedown', function(e){
            if(e.button == 2){
                e.preventDefault();
                performSwitch(2);
            }else {
                parent = $(e.target).closest('.art');
                if (parent.hasClass('active'))
                    deactivate(parent.data("grid-id"));
                else
                    activate(parent.data("grid-id"));
            }
        });

        function activate(num){
            text = Math.floor(Math.random() * 26) + 1;
            if(text < 10)
                $('.art[data-grid-id="'+num+'"]').append("<img class='text' src='/assets/img/text_0"+text+".png'>");
            else
                $('.art[data-grid-id="'+num+'"]').append("<img class='text' src='/assets/img/text_"+text+".png'>");
            $('.art[data-grid-id="'+num+'"]').addClass('active');
            var l = $('.art[data-grid-id="'+num+'"] .wrapper.active').attr('data-loop');
            loopList[l].object.volume = 1;
            loopList[l].object.gainNode.gain.value = 1;
        }

        function deactivate(num) {
            abs = Math.abs(num);
            $('.art[data-grid-id="'+abs+'"] .text').remove();
            $('.art[data-grid-id="'+abs+'"]').removeClass('active');
            var l = $('.art[data-grid-id="'+abs+'"] .wrapper.active').attr('data-loop');
            loopList[l].object.volume = 0;
            loopList[l].object.gainNode.gain.value = 0;
            checkQueue(abs);
        }

        function chooseLoops(){
            for(var i=0; i<=6; i++){
                var rand = Math.round(Math.random() * groupALength);
                $('.art[data-grid-id="'+(i+1)+'"] .wrapper.active img').attr('src', '/assets/img/' + groupA[rand].song.album.art);
                $('.art[data-grid-id="'+(i+1)+'"] .wrapper.active p').text('@' + groupA[rand].song.artist.twitter);
                $('.art[data-grid-id="'+(i+1)+'"] .wrapper.active').attr('data-loop', groupA[rand].name);
            }
            for(var i=0; i<3; i++){
                var rand = Math.round(Math.random() * groupBLength);
                $('.art[data-grid-id="'+(i+7)+'"] .wrapper.active img').attr('src', '/assets/img/' + groupB[rand].song.album.art);
                $('.art[data-grid-id="'+(i+7)+'"] .wrapper.active p').text('@' + groupB[rand].song.artist.twitter);
                $('.art[data-grid-id="'+(i+7)+'"] .wrapper.active').attr('data-loop', groupB[rand].name);
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

        var switchQueue = new Array(9);
        for (var i = 0; i < switchQueue.length; ++i) { switchQueue[i] = false; }
        var hasFlipped = new Array(9);
        for (var i = 0; i < switchQueue.length; ++i) { switchQueue[i] = false; }
        this.listLength = 40;
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
                $.each(loopList, function(){
                    console.log("playing");
                    this.object.playSound();
                });
                switchLoop();
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

        function prepareSwitch(grid_id, loop){
            $('.art[data-grid-id="'+grid_id+'"] .wrapper:not(.active)').attr('data-loop', loop.name);
            $('.art[data-grid-id="'+grid_id+'"] .wrapper:not(.active) img').attr('src', '/assets/img/' +loop.song.album.art);
            $('.art[data-grid-id="'+grid_id+'"] .wrapper:not(.active) p').text('@' + loop.song.artist.twitter);
        }

        function performSwitch(grid_id){
            if(!$('.art[data-grid-id="'+grid_id+'"]').hasClass('active')){
                $('.art[data-grid-id="'+grid_id+'"] .wrapper').toggleClass('active');
            }else{
                switchQueue[grid_id-1] = true;
            }
        }

        prepareSwitch(2, loopList.loop9);

        function checkQueue(grid_id){
            if(switchQueue[grid_id-1] === true){
                switchQueue[grid_id-1] = false;
                $('.art[data-grid-id="'+grid_id+'"] .wrapper').toggleClass('active');
            }
        }

        function pickSwitch(){
            var rand = Math.round(Math.random() * 9) + 1;
            if(hasFlipped[rand-1]){
                for(i=rand;i<hasFlipped.length;i++){
                    if(!hasFlipped[i]){
                        hasFlipped[i] = true;
                        return i;
                    }
                }
                for(i=0;i<rand;i++){
                    if(!hasFlipped[i]){
                        hasFlipped[i] = true;
                        return i;
                    }
                }
                for(i=0;i<hasFlipped.length;i++){hasFlipped[i] = false}
                return rand;
            }
            return rand;
        }

        function pickLoop(grid_id){
            if(grid_id < 7){
                rand = Math.round(Math.random() * groupALength);
                for(i=rand;i<groupALength;i++){
                    if(!$('.wrapper.active[data-loop="'+groupA[i].name+'"]').length){
                        return groupA[i];
                    }
                    console.log(i + 'is in use');
                }
                for(i=0;i<rand;i++){
                    if(!$('.wrapper.active[data-loop="'+groupA[i].name+'"]').length){
                        return groupA[i];
                    }
                    console.log(i + 'is in use');
                }
            }else{
                rand = Math.round(Math.random() * groupBLength);
                for(i=rand;i<groupBLength;i++){
                    if(!$('.wrapper[data-loop="'+groupB[i].name+'"]').length){
                        return groupB[i];
                    }
                    console.log(i + 'is in use');
                }
                for(i=0;i<rand;i++){
                    if(!$('.wrapper.active[data-loop="'+groupB[i].name+'"]').length){
                        return groupB[i];
                    }
                    console.log(i + 'is in use');
                }
            }
        }

        function switchLoop(){
            var timeout = (Math.round(Math.random() * 70) + 20)*1000; //20-90
            console.log("setting Timeout " + timeout);
            setTimeout(function() {
                var grid_id = pickSwitch();
                var theLoop = pickLoop(grid_id);
                if(theLoop != undefined) {
                    console.log(grid_id + " " + theLoop);
                    prepareSwitch(grid_id, theLoop);
                    performSwitch(grid_id);
                    console.log("Switching " + grid_id + " to " + theLoop.name);
                }
                switchLoop();
            }, timeout);
        };

        //$('.art[data-grid-id="5"] .wrapper').toggleClass('active');
	});
