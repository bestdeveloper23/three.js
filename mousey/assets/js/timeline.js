$(document).ready(function(){
//    $(function() {
//         $( "#sortable" ).sortable();
//     });
// $(function() {
//         $('#sortable .t').resizable();
//     });
    
$(function () {
    $('.sortable').sortable({
        // scroll: true,
        placeholder: 'placeholder',
        containment: 'parent',
        axis: 'x'
    });
    $('.sortable').disableSelection();
    $('.sortable .resize').resizable({
        // animate: true,
        // animateDuration: "fast",
        handles: 'e',
        // alsoResize: $(this).parent(),
        resize: function(event, ui) {
            // var w = $(event.target).width();
            var w = ui.size.width;
            $(this).parent().width(w);
        }
    }, "grid", [ 20, 10 ]);
});
var video_duration = 1600/12;
// var d = [
// {"lbl": "ABC", "time": 15},
// {"lbl": "DEF", "time": 07}
// ];
// $.each(d, function(i,v) {
// 	setTimeout(function() {
//     	$('p').text(v.lbl);
//     }, v.time * 1000);
// });
$('#card_timeline_seconds, #card_timeline_minutes').width($('#timeline_card').width()).height($('#timeline_card').height());
var available_width = $('#card_timeline_seconds').width();
$('#waveform').width(available_width);
var available_width = 1600;
var dot_ws = available_width / video_duration;
var dot_wm = available_width / (video_duration/60);

    $('#card_timeline_seconds').css('background-size', dot_ws+'px '+dot_ws+'px ');
    $('#card_timeline_minutes').css('background-size', dot_wm+'px '+dot_wm+'px ');
    
// for (var i=1; i <= video_duration; i++) {
	// $('#card_timeline').append('<div class="d-inline-block" style="width: '+dot_w+'px;height: 5px; font-size:6px;">|</div>');
// }
});