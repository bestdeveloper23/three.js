$("#reload").change(function(e){
    var envUUID = newUUID();
    file = $(this).get(0).files[0];
    const url = URL.createObjectURL(file);
    let filename = file.name;
    let last_dot = filename.lastIndexOf('.');
    let fileType = filename.slice(last_dot + 1);
    let filename_noext = filename.slice(0, last_dot);
    $('#env_id').val(envUUID);
    // $('#env_name').val(filename_noext);
    // loadFile(filename, url, envUUID);
    console.log("im clicked");

    gltfLoader.load( url, function ( scene_reloaded ) {
        // console.log('anim', scene_reloaded);

        // const id = $('#model_id').val();
        // var obj = scene.children.filter(function(o) {return o.app_uuid == id});
        const mixer = new THREE.AnimationMixer( scene_reloaded.scene );
        //mixer.clipAction( scene_reloaded.animations[ 0 ] ).play();
        scene.add( scene_reloaded.scene );
        console.log(scene_reloaded);
        // scene_reloaded.traverse((child) => {
        //     child
        // })
        // for ( i = 0; i<scene_reloaded.animations.length; i++){
            
        // }
    //     setTimeout(function() {
    //             if (obj.length) {
    //                 obj = obj[0];
    //                 scene_reloaded.animations[0].name = filename_noext;
    //                 scene_reloaded.animations[0].app_uuid = animUUID;
    //                 obj.animations.push(scene_reloaded.animations[0]);
    //                 console.log("obj.animatioin[] is " + obj.animations.length);
    //             }
    //     }, 100);
    //     var index = obj[0].animations.length;
    //     var w = scene_reloaded.animations[0].duration*12;
    //     duration = scene_reloaded.animations[0].duration;
    //     $("#anim_file").val(null);

    //     $('ul[data-id='+ id + ']').append(`
    //         <li class="list-inline-item position-relative d-inline-block m-0" id="${id}${index}" data-id="${index}" style = width:${w+"px"}>
    //             <span class="small position-absolute top-0 start-0 m-0">${filename}</span>
    //             <button class="btn btn-danger btn-sm float-end btn-delete-anim m-0" type="button" id="del-${index}" data-id="${id}">
    //             <i class="fas fa-times m-0"></i></button>
    //             <div class="fas fa-arrows-alt-h w-100 resize bg-success position-absolute bottom-0 start-0 m-0" data-id="${index}"></div>
    //         </li>`);
    //         // <button class="list-inline-item position-relative d-inline-block m-0" type="button" data-id="${id}">
    //         // <i class="fas fa-times"></i></button>
    //     $(function () {
    //         var start_index, end_index;
    //         $('.sortable').sortable({
    //             // scroll: true,
    //             placeholder: 'placeholder',
    //             containment: 'parent',
    //             axis: 'x',

    //             start: function( event, ui ){
    //                 start_index = ui.item.index();
    //             },
    //             update: function( event, ui ){
    //                 end_index = ui.item.index();
    //                 console.log("start_index is "+start_index+"end_index is "+end_index)
    //                 var model_id = $(this).attr("data-id");
    //                 console.log("model_id is " + model_id)
    //                 var object = scene.children.filter(function(o) {return o.app_uuid == model_id});
    //                 var item = object[0].animations.splice(start_index, 1);
    //                 object[0].animations.splice(end_index, 0, item[0]);
    //                 var list = document.getElementById(model_id).getElementsByTagName("li");
    //                 for( let i=0; i<list.length; i++){
    //                     $(list[i]).attr("data-id", i);
    //                     $(list[i]).attr('id', model_id+i);
    //                 }
    //                 duration = item[0].duration;
    //                 console.log(object[0].animations[end_index].app_uuid);
    //                 $('#anim_id').val(object[0].animations[end_index].app_uuid);
    //                 $('#anim_name').val(object[0].animations[end_index].name);
    //             }

    //         });
    //         $('.sortable').disableSelection();
    //         $('.sortable .resize').resizable({
    //             // animate: true,
    //             // animateDuration: "fast",
    //             handles: 'e',
    //             // alsoResize: $(this).parent(),
    //             resize: function(event, ui) {
    //                 // var w = $(event.target).width();
    //                 var w = ui.size.width;
    //                 $(this).parent().width(w);
    //                 var model_id = $(this).parent().parent().attr("data-id");
    //                 var animation_id = $(this).parent().attr("data-id");
    //                 var object = scene.children.filter(function(o) {return o.app_uuid == model_id});
    //                 var animation = mixer[model_id].clipAction(object[0].animations[animation_id]);
    //                 var clip = animation.getClip();
    //                 duration = clip.duration;
    //                 animation.setEffectiveTimeScale(clip.duration * 12 / w)
    //                 const scale = animation.getEffectiveTimeScale().toFixed(2);
    //                 $('#anim_timescale').val(scale);
    //                 console.log(object[0].animations[animation_id].app_uuid);
    //                 $('#anim_id').val(object[0].animations[animation_id].app_uuid);
    //                 $('#anim_name').val(object[0].animations[animation_id].name);
    //             }
    //         }, "grid", [ 20, 10 ]);
    //     });
    //     $(document).on('click', '#del-'+index, function() {
    //         const id = $(this).data('id');
    //         console.log(id)
    //         const id_anim = $(this).parent().attr('data-id');
    //         $(this).parent().remove();
    //         var object = scene.children.filter(function(o) {return o.app_uuid == id});
    //         console.log(id_anim)
    //         object[0].animations.splice(id_anim, 1);
    //         delete mixer[id][id_anim];
    })

})
