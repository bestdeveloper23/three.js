$(document).ready(function() {
        var modelUUID, id, url, filename, last_dot, fileType, filename_noext;
        $('#btn_append_model').hide();
        $('#btn_append_anim').hide();
        $("#model_file").change(function(e) {
            e.preventDefault();
            modelUUID = newUUID();
            file = $(this).get(0).files[0];
            url = URL.createObjectURL(file);
            filename = file.name;
            last_dot = filename.lastIndexOf('.');
            fileType = filename.slice(last_dot + 1);
            filename_noext = filename.slice(0, last_dot);
            $('#model_id').val(modelUUID);
            $('#model_name').val(filename_noext);
            $('#btn_append_model').show();
        });

        $('#btn_append_model').click(function(eb) {
            eb.preventDefault();
            if ($('#model_file').val() && $('#model_id').val() !== '' && $('#model_name').val() !== '' && $('#model_position').val() !== '' && $('#model_rotation').val() !== '' && $('#model_scale').val() !== '') {
                $('#model_list, #model_list_left')
                    .append(`
                                        <li class="mt-2 fs-6" data-id="${modelUUID}">${filename}
                                            <button class="btn btn-danger btn-sm float-end btn-delete-model" type="button" data-id="${modelUUID}">
                                            <i class="fas fa-times"></i>
                                            </button>
                                        </li>`);
                $('.timeline_model').append(
                    `
                        <ul class="list-inline ui-state-default p-0 m-0 sortable" id="${modelUUID}" style="white-space: nowrap;" data-id="${modelUUID}"></ul>
                    `
                );

                $(function () {
                    $('#sortable').sortable({
                        // scroll: true,
                        placeholder: 'placeholder',
                        containment: 'parent',
                        axis: 'x'
                    });
                });
                //-------------------------------------
                loadFile(filename, url, modelUUID);
                $("#model_file").val(null);
                setTimeout(function() {
                    var obj = scene.children.filter(function(o) {
                        return o.app_uuid == modelUUID
                    });
                    if (obj.length) {
                        var position = $('#model_position').val().split(',');
                        var rotation = $('#model_rotation').val().split(',');
                        var scale = $('#model_scale').val().split(',');
                        obj = obj[0];
                        obj.name = $('#model_name').val();
                        obj.position.set(position[0], position[1], position[2]);
                        obj.rotation.set(getAngle(rotation[0]), getAngle(rotation[1]), getAngle(rotation[2]));
                        obj.scale.set(scale[0], scale[1], scale[2]);

                        $("#model_file,#model_id,#model_name").val(null);
                        $("#model_position,#model_rotation").val('0,0,0');
                        $("#model_scale").val('1,1,1');
                        console.log('Model Imported', scene);
                    }
                }, 100);
            }
            $('#btn_append_model').hide();
        });


        $('#model_name').on('change', function() {
            var id = $('#model_id').val();
            if (id.length > 8) {
                var obj = scene.children.filter(function(o) {
                    return o.app_uuid == id
                });
                if (obj.length) {
                    obj = obj[0];
                    obj.name = $(this).val();
                    console.log('Name set', scene);
                }
            }
        });


        $(document).on('click', '.btn-delete-model', function() {
            id = $(this).data('id');
            $.each(project_d[1], function(i, v) {
                if (v.hasOwnProperty(id) && v.id == id) {
                    delete project_d[1][i];
                }
            });
            $('#model_list li[data-id=' + id + ']').remove();
            $('#model_list_left li[data-id=' + id + ']').remove();
            $('#'+id).remove();
            $('ul [data-id=' + id + ']').remove();
            $('#json_p').jsonViewer(project_d);
            $.each(scene.children, function(i, s) {
                if (s.app_uuid && s.app_uuid == id) {
                    scene.remove(s);
                }
            });
            delete mixer[id];
            console.log(mixer[id])
        });


        $(document).on('click', '#model_list_left > li, #model_list > li', function() {
            id = $(this).data('id');
            if (id.length > 8) {
                var obj = scene.children.filter(function(o) {
                    return o.app_uuid == id
                });
                if (obj.length) {
                    obj = obj[0];
                    if ( obj !== null && obj !== scene && obj !== camera ) {
                        box.setFromObject(obj, true);
                        if ( box.isEmpty() === false ) boxHelper.visible = true;
                        if ( helpers[ obj.id ] !== undefined )
                            helpers[ obj.id ].update();
                        transformControls.attach( obj );
                    }

                    $('#model_id').val(obj.app_uuid);
                    $('#model_name').val(obj.name);
                    $('#model_position').val(obj.position.x+','+obj.position.y+','+obj.position.z);
                    $('#model_rotation').val(obj.rotation.x+','+getAngleReverse(obj.rotation.y)+','+obj.rotation.z);
                    $('#model_scale').val(obj.scale.x+','+obj.scale.y+','+obj.scale.z);
                }
            }
        });




        $('#btn_model_set_pos').click(function() {
                var id = $('#model_id').val();
                if (id.length > 8) {
                    var position = $('#model_position').val().split(',');
                    var id = $('#model_id').val();
                    var obj = scene.children.filter(function(o) {
                        return o.app_uuid == id
                    });
                    if (obj.length) {
                        obj[0].position.set(position[0], position[1], position[2]);
                    }
                }
        });

    $('#btn_model_set_rot').click(function() {
            var id = $('#model_id').val();
            if (id.length > 8) {
                var rotation = $('#model_rotation').val().split(',');
                var id = $('#model_id').val();
                var obj = scene.children.filter(function(o) {
                    return o.app_uuid == id
                });
                if (obj.length) {
                    obj[0].rotation.set(getAngle(rotation[0]), getAngle(rotation[1]), getAngle(rotation[2]));
                }
            }
    });

$('#btn_model_set_scl').click(function() {
    var id = $('#model_id').val();
    if (id.length > 8) {
        var scale = $('#model_scale').val().split(',');
        var id = $('#model_id').val();
        var obj = scene.children.filter(function(o) {
            return o.app_uuid == id
        });
        if (obj.length) {
            obj[0].scale.set(scale[0], scale[1], scale[2]);
        }
    }
});

$('#btn_model_applyall').click(function() {
    var id = $('#model_id').val();
    if (id.length > 8) {
        var position = $('#model_position').val().split(',');
        var rotation = $('#model_rotation').val().split(',');
        var scale = $('#model_scale').val().split(',');

        var id = $('#model_id').val();
        var obj = scene.children.filter(function(o) {
            return o.app_uuid == id
        });
        if (obj.length) {
            obj = obj[0];
            obj.name = $('#model_name').val();
            obj.updateMatrix();
            // obj.traverse(function(child) {
            //     if (child.isGroup) {
            //         child.applyMatrix4( child.matrix );
            //         child.matrixAutoUpdate = false
            //         child.updateMatrixWorld(true)
            //         child.position.set( 0, 0, 0 );
            //         child.rotation.set( 0, 0, 0 );
            //         child.scale.set( 1, 1, 1 );
            //         child.updateMatrix();
            //     }
            // })
            // obj.applyMatrix4( obj.getWorldPosition() );
            // obj.matrixAutoUpdate = false
            // obj.updateMatrixWorld(true)
            // obj.position.set( 0, 0, 0 );
            // obj.rotation.set( 0, 0, 0 );
            // obj.scale.set( 1, 1, 1 );
            // obj.updateMatrix();

            setTimeout(function() {
                console.log('tet', scene);
            }, 500);
        }
    }
    });


});