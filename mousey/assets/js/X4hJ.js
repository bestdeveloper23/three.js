$("#anim_file").change(function(e){
    var obj = scene.children.filter(function(o) {return o.name == $('#anim_name').val()});
    if (obj.length) {
        scene.remove(obj[0]);
    }
    var duration=0;

    var animUUID = newUUID();
    file = $(this).get(0).files[0];
    const url = URL.createObjectURL(file);
    let filename = file.name;
    let last_dot = filename.lastIndexOf('.');
    let fileType = filename.slice(last_dot + 1);
    let filename_noext = filename.slice(0, last_dot);
    $('#anim_id').val(animUUID);
    $('#anim_name').val(filename_noext);
    
    fbxLoader.load( url, function ( anim ) {
        anim.traverse(
            (child)=> {
                if (child.isMesh)
                {
                    document.querySelector('#anim_isadditive').value = false;
                    return(end_position);
                }else document.querySelector('#anim_isadditive').value = true;
            }
        )
        anim.app_uuid = animUUID;
        const id = $('#model_id').val();
        var obj = scene.children.filter(function(o) {return o.app_uuid == id});

        setTimeout(function() {
                if (obj.length) {
                    obj = obj[0];
                    anim.animations[0].name = filename_noext;
                    anim.animations[0].app_uuid = animUUID;
                    obj.animations.push(anim.animations[0]);
                }
        }, 100);
        var index = obj[0].animations.length;
        var w = anim.animations[0].duration*12;
        duration = anim.animations[0].duration;
        $("#anim_file").val(null);

        $('ul[data-id='+ id + ']').append(`
            <li class="list-inline-item position-relative d-inline-block m-0" id="${id}${index}" data-id="${index}" style = width:${w+"px"}>
                <span class="small position-absolute top-0 start-0 m-0">${filename}</span>
                <button class="btn btn-danger btn-sm float-end btn-delete-anim m-0" type="button" id="del-${index}" data-id="${id}">
                <i class="fas fa-times m-0"></i></button>
                <div class="fas fa-arrows-alt-h w-100 resize bg-success position-absolute bottom-0 start-0 m-0" data-id="${index}"></div>
            </li>`);
            // <button class="list-inline-item position-relative d-inline-block m-0" type="button" data-id="${id}">
            // <i class="fas fa-times"></i></button>
        $(function () {
            var start_index, end_index;
            $('.sortable').sortable({
                // scroll: true,
                placeholder: 'placeholder',
                containment: 'parent',
                axis: 'x',

                start: function( event, ui ){
                    start_index = ui.item.index();
                },
                update: function( event, ui ){
                    end_index = ui.item.index();
                    var model_id = $(this).attr("data-id");
                    var object = scene.children.filter(function(o) {return o.app_uuid == model_id});
                    var item = object[0].animations.splice(start_index, 1);
                    object[0].animations.splice(end_index, 0, item[0]);
                    var list = document.getElementById(model_id).getElementsByTagName("li");
                    for( let i=0; i<list.length; i++){
                        $(list[i]).attr("data-id", i);
                        $(list[i]).attr('id', model_id+i);
                    }
                    duration = item[0].duration;
                    $('#anim_id').val(object[0].animations[end_index].app_uuid);
                    $('#anim_name').val(object[0].animations[end_index].name);
                }

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
                    var model_id = $(this).parent().parent().attr("data-id");
                    var animation_id = $(this).parent().attr("data-id");
                    var object = scene.children.filter(function(o) {return o.app_uuid == model_id});
                    var animation = mixer[model_id].clipAction(object[0].animations[animation_id]);
                    var clip = animation.getClip();
                    duration = clip.duration;
                    animation.setEffectiveTimeScale(clip.duration * 12 / w)
                    const scale = animation.getEffectiveTimeScale().toFixed(2);
                    $('#anim_timescale').val(scale);
                    $('#anim_id').val(object[0].animations[animation_id].app_uuid);
                    $('#anim_name').val(object[0].animations[animation_id].name);
                }
            }, "grid", [ 20, 10 ]);
        });
        $(document).on('click', '#del-'+index, function() {
            const id = $(this).data('id');            
            const id_anim = $(this).parent().attr('data-id');
            $(this).parent().remove();
            var object = scene.children.filter(function(o) {return o.app_uuid == id});
            object[0].animations.splice(id_anim, 1);
            delete mixer[id][id_anim];

        });

    })
    $(document).on('click', '#btn_finish',function(eb) {
        eb.preventDefault();
        const model_uuid = $('#model_id').val();
        const anim_uuid = $('#anim_id').val();
        const anim_name = $('#anim_name').val();
        const anim_scale = $('#anim_timescale').val();
        const object = scene.children.filter(function (o){return o.app_uuid == model_uuid});
        for( i = 0; i < object[0].animations.length; i++)
        {
            // const item_li = document.querySelector('li#'+model_uuid);
            

            if(object[0].animations[i].name == anim_name)
            {
                const item_li = $(document.getElementById(model_uuid+i).children[0]).parent();
                if(duration != 0) $(item_li).width(duration*12/anim_scale);
                else $(item_li).width($(item_li).width*12/anim_scale);
                const animation = mixer[model_uuid].clipAction(object[0].animations[i]);
                animation.setEffectiveTimeScale(anim_scale);
            }
        }
    });
    end_position:;
});
