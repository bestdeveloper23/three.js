    $("#env_file").change(function(e){
        var obj = scene.children.filter(function(o) {return o.name == $('#env_name').val()});
        if (obj.length) {
            scene.remove(obj[0]);
        }
        var envUUID = newUUID();
        file = $(this).get(0).files[0];
        const url = URL.createObjectURL(file);
        let filename = file.name;
        let last_dot = filename.lastIndexOf('.');
        let fileType = filename.slice(last_dot + 1);
        let filename_noext = filename.slice(0, last_dot);
        $('#env_id').val(envUUID);
        // $('#env_name').val(filename_noext);
        loadFile(filename, url, envUUID);
        setTimeout(function() {
        var obj = scene.children.filter(function(o) {return o.app_uuid == envUUID});
        if (obj.length) {
            obj = obj[0];
            obj.name = $('#env_name').val();
            console.log('Env name set', scene);
        }
        }, 2000);

    });
    
    $('#env_name').on('change', function() {
        var id = $('#env_id').val();
        var obj = scene.children.filter(function(o) {return o.app_uuid == id});
        if (obj.length) {
            obj = obj[0];
            obj.name = $(this).val();
            console.log('Name set', scene);
        }
    });


    $('#btn_env_set_pos').click(function() {
        var position = $('#env_position').val().split(',');
        var id = $('#env_id').val();
        var obj = scene.children.filter(function(o) {return o.app_uuid == id});
        if(obj.length) {
            obj[0].position.set(position[0],position[1],position[2]);
        }
    });

    $('#btn_env_set_rot').click(function() {
        var rotation = $('#env_rotation').val().split(',');
        var id = $('#env_id').val();
        var obj = scene.children.filter(function(o) {return o.app_uuid == id});
        if(obj.length) {
            obj[0].rotation.set(getAngle(rotation[0]), getAngle(rotation[1]), getAngle(rotation[2]));
        }
    });

    $('#btn_env_set_scl').click(function() {
        var scale = $('#env_scale').val().split(',');
        var id = $('#env_id').val();
        var obj = scene.children.filter(function(o) {return o.app_uuid == id});
        if(obj.length) {
            obj[0].scale.set(scale[0],scale[1],scale[2]);
        }
    });

    $('#btn_env_applyall').click(function() {
        var position = $('#env_position').val().split(',');
        var rotation = $('#env_rotation').val().split(',');
        var scale = $('#env_scale').val().split(',');
        
        var id = $('#env_id').val();
        var obj = scene.children.filter(function(o) {return o.app_uuid == id});
if(obj.length) {
        obj = obj[0];
        obj.name = $('#env_name').val();
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
    })