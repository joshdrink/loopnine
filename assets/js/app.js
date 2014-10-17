// Nocturne Dance Grid / 2014 --------------------------------------------------

	// Authored by: Josh Beveridge @ Norex
	// 2014/10

// Square ----------------------------------------------------------------------

	$(document).ready(function() {

		var pageHeight = $(window).height();
		var pageWidth = $(window).width();

		$('.grid').css('width', pageHeight + "px");
		$('.menu').css('width', pageWidth - pageHeight + "px");

		var boxWidth = $('.art').width();

		$('.row').css('height', boxWidth + "px");

	});
