$(document).ready(function() {
    $(document).on('click', '#model_list_left > li', function(){
        var id = $(this).data('id');
        $('#model_list_left > li.selected').removeClass('selected');
        $('#model_list > li.selected').removeClass('selected');
        $(this).addClass('selected');
        $('#model_list > li[data-id='+id+']').addClass('selected');
    });

    $(document).on('click', '#model_list > li', function(){
        var id = $(this).data('id');
        $('#model_list > li.selected').removeClass('selected');
        $('#model_list_left > li.selected').removeClass('selected');
        $(this).addClass('selected');
        $('#model_list_left > li[data-id='+id+']').addClass('selected');
    });
});

