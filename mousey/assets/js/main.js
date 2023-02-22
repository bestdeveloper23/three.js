/*
https://lucasmajerowicz.github.io/threejs-ffd/app/

██    ██  █████  ██████  ███████ 
██    ██ ██   ██ ██   ██ ██      
██    ██ ███████ ██████  ███████ 
 ██  ██  ██   ██ ██   ██      ██ 
  ████   ██   ██ ██   ██ ███████ 
*/
THREE.Object3D.DefaultUp.set(0,1,0);
var width  = $('#col_canvas').width();
var height = $('#col_canvas').height();
var fov    = 75;
var aspect = width / height;
var near   = 0.1;
var far    = 1000;
var mouse = new THREE.Vector2();
// var mouseX = 0;
// var mouseY = 0;
var windowHalfX = width / 2;
var windowHalfY = height / 2;
var theta = 0;
var antialias = true;
var alpha = true;
var canvas = $("#canvas")[0];
var camera_init_pos = [40,80,40];
var camera_init_lookAt = [0,0,0];
var camera_tween_positions = [];
var camera_tween_rotations = [];
var time_durations = [];
var time_points = [];
var total_timeduration = 0;
var setkey_flag = false;
var showDirections = true;
const clock = new THREE.Clock();
var  action;
var sceneHelpers = new THREE.Scene();
const raycaster = new THREE.Raycaster();
// raycaster.params.Line.threshold = 0.001;

helpers={};

var selectedOBJ,selectedParant;



//imported vars
var bg_scenery;

var audio_in;

//------------------------------audio---------------------------


const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: antialias, alpha: alpha});
    renderer.setSize(width, height);
renderer.shadowMap.enabled = true;

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(camera_init_pos[0], camera_init_pos[1], camera_init_pos[2]);
    camera.lookAt(camera_init_lookAt[0], camera_init_lookAt[1], camera_init_lookAt[2]);

const scene = new THREE.Scene();
const orbitControls = new THREE.OrbitControls( camera, renderer.domElement );
        orbitControls.update();
        orbitControls.addEventListener( 'change', render );


var blank = new THREE.Group;
scene.add(blank);

const box = new THREE.Box3();
const boxHelper = new THREE.Box3Helper( box ); //new THREE.BoxHelper(blank, new THREE.Color(0xFF0000));
boxHelper.material.depthTest = false;
boxHelper.material.transparent = true;
boxHelper.visible = false;
scene.add(boxHelper);



var transformControls = new THREE.TransformControls( camera, renderer.domElement );
scene.add( transformControls );
transformControls.addEventListener( 'change', function () {
		const object = transformControls.object;
		if ( object !== undefined ) {
			box.setFromObject( object, true );
			const helper = helpers[ object.id ];
			if ( helper !== undefined && helper.isSkeletonHelper !== true ) {
				helper.update();
			}
		}
		render();
	});
transformControls.addEventListener('mouseDown', function () {
    orbitControls.enabled = false
});
transformControls.addEventListener('mouseUp', function () {
    selectedParant = scene.getObjectById(selectedOBJ.parent.id);
    var pos = selectedParant.position;
    var rot = selectedParant.rotation;
    var scl = selectedParant.scale;
    
    selectedParant.position.set(parseFloat(pos.x),parseFloat(pos.y),parseFloat(pos.z));
    selectedParant.rotation.set(parseFloat(rot.x),parseFloat(rot.y),parseFloat(rot.z));
    selectedParant.scale.set(parseFloat(scl.x),parseFloat(scl.y),parseFloat(scl.z));
    
    $('#model_position').val(pos.x.toFixed(2)+','+pos.y.toFixed(2)+','+pos.z.toFixed(2));
    $('#model_rotation').val(rot.x.toFixed(2)+','+rot.y.toFixed(2)+','+rot.z.toFixed(2));
    $('#model_scale').val(scl.x.toFixed(2)+','+scl.y.toFixed(2)+','+scl.z.toFixed(2));

    console.log('scene', scene);
    
    orbitControls.enabled = true
});


transformControls.addEventListener( 'dragging-changed', function (event) {
    orbitControls.enabled = ! event.value;
}, false);

setTranformKeys();


// var transformControls = new THREE.TransformControls( camera, renderer.domElement );
// transformControls.addEventListener( 'change', render );
// transformControls.addEventListener( 'dragging-changed', function ( event ) {
//     orbitControls.enabled = ! event.value;
// });
// scene.add( transformControls );





var dirLights = [
    {"x": -250, "y": 100, "z": 250},
    {"x": -250, "y": 100, "z": -250},
    {"x": 250, "y": 100, "z": 250},
    {"x": 250, "y": 100, "z": -250}
];

$.each(dirLights, function(i,v) {
var light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set(v.x, v.y, v.z).normalize();
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 2000;
    light.castShadow = true;
    scene.add(light);
})
const light1 = new THREE.SpotLight('white', 1)
light1.position.set(25, 50, 25)
light1.penumbra = 0.5
light1.castShadow = true
light1.shadow.mapSize.width = 1024
light1.shadow.mapSize.height = 1024
light1.shadow.camera.near = 0.5
light1.shadow.camera.far = 2000
scene.add(light1)


if (showDirections) {
var arrowPos = new THREE.Vector3( 0,0,0 );
scene.add( new THREE.ArrowHelper( new THREE.Vector3( 1,0,0 ), arrowPos, 200, 0x7F2020, 20, 10 ) );
scene.add( new THREE.ArrowHelper( new THREE.Vector3( 0,1,0 ), arrowPos, 200, 0x207F20, 20, 10 ) );
scene.add( new THREE.ArrowHelper( new THREE.Vector3( 0,0,1 ), arrowPos, 200, 0x20207F, 20, 10 ) );
}




/*
██████  ███████  ██████  ██ ███    ██ 
██   ██ ██      ██       ██ ████   ██ 
██████  █████   ██   ███ ██ ██ ██  ██ 
██   ██ ██      ██    ██ ██ ██  ██ ██ 
██████  ███████  ██████  ██ ██   ████ 
*/                   


function onDocumentTouchStart(event){
    console.log('e', event);
    event.preventDefault();
    event.clientX = ( event.clientX / window.innerWidth ) * 2 - 1;
    event.clientY = ( event.clientY / window.innerHeight ) * 2 + 1;
    onDocumentMouseDown(event);
}


function onDocumentMouseDown( event ) {
    // event.preventDefault();
    // mouse.x = ( event.offsetX / width ) * 2 - 1;
    // mouse.y = - ( event.offsetY / height ) * 2 + 1; 
    mouse.x = ( event.clientX / $('#col_canvas').width() ) * 2 - 1;
    mouse.y = - ( event.clientY / $('#col_canvas').height() ) * 2 + 1;
    console.log("x : " + mouse.x + " y : " + mouse.y);
    console.log(raycaster);
    raycaster.setFromCamera(mouse, camera);
    console.log(raycaster);
    var intersects = raycaster.intersectObjects(scene.children, true);
        
    console.log(intersects);
    if ( intersects.length > 0 ) {
		boxHelper.visible = false;
		transformControls.detach();
        
        if (intersects[0].object.type == "SkinnedMesh" || intersects[0].object.type == "Mesh") {
            
            selectedOBJ = intersects[0].object;
            selectedParant = scene.getObjectById(selectedOBJ.parent.id);
            console.log(selectedParant)
            if ( selectedParant !== null && selectedParant !== scene && selectedParant !== camera ) {
                box.setFromObject(selectedParant, true);
                if ( box.isEmpty() === false ) boxHelper.visible = true;
		if ( helpers[ selectedParant.id ] !== undefined )
         helpers[ selectedParant.id ].update();
                transformControls.attach( selectedParant );
                render();
                var auuid = selectedParant.app_uuid;
                $('#model_list > li[data-id='+auuid+'], #model_list_left > li[data-id='+auuid+']').click();
            }
        }

    } else {
            transformControls.detach(selectedParant);
            // scene.remove(transformControls);
        boxHelper.visible = false;
        }
}
// canvas.addEventListener( 'dblclick', onDoubleClick );
$('#col_canvas > canvas').dblclick(function(e) {
    onDocumentMouseDown(e);
});


function animate() {
    requestAnimationFrame( animate );

    if (mixer[$('#model_id').val()]){
        // mixer[$('#model_id').val()].update(clock.getDelta());
        
        const numbers_mixer = Object.keys(mixer).length;
        var time = 0;
        for(let i=0; i<numbers_mixer; i++)
        {
            const id = Object.keys(mixer)[i];
            time += clock.getDelta();
            mixer[id].update(time);
        }
        total_timeduration += time;
    }
    var number_setkey = time_durations.length;
    var refer_point = number_setkey;
    var prev_refer_time = 0;
    var alpha = 0;
    if(time_durations.length && setkey_flag ){
        let refer_time = 0;
        for(let i=0; i<= number_setkey; i++){
            refer_time += time_durations[i];
            if(refer_time> total_timeduration){
                refer_point = i;
                alpha = 1 - (refer_time - total_timeduration)/time_durations[i];
                break;
            }else if ( i == number_setkey ) {setkey_flag = false}
        }
        prev_refer_time = refer_time;
        var camera_rotation_interpolation = rotate_interpolation(camera_tween_rotations[refer_point], camera_tween_rotations[refer_point+1], alpha);
        camera.rotation.set(camera_rotation_interpolation.x, camera_rotation_interpolation.y, camera_rotation_interpolation.z);
        camera.position.lerp(camera_tween_positions[refer_point], alpha)
        camera.position.lerpVectors(camera_tween_positions[refer_point], camera_tween_positions[refer_point+1], alpha);
        
    } else orbitControls.update();
    // if(boxHelper && selectedOBJ) {boxHelper.setFromObject(selectedOBJ)}
    // if(boxHelper && selectedOBJ) {boxHelper.update()}
    if (selectedOBJ) {
        selectedOBJ.parent.position = boxHelper.position;
    }
    render();
    $('#camera_p').text(camera.position.x + ', ' + camera.position.y + ', ' + camera.position.z)
}

function render() {
    renderer.render( scene, camera );
    
}



function resize(){
    // camera.left = camera.bottom * aspect;
    // camera.right = camera.top * aspect;
    camera.updateProjectionMatrix();
    width  = $('#col_canvas').width();
    height = $('#col_canvas').height();
    
    camera.aspect = width / height;
    renderer.setSize(width,height);
    $('#card_timeline_seconds, #card_timeline_minutes').width($('#timeline_card').width());
    render();
}

function rotate_interpolation( v1, v2, alpha){
    let v3 = new THREE.Vector3;
    v3.set(v1.x+(v2.x-v1.x)*alpha, v1.y+(v2.y-v1.y)*alpha, v1.z+(v2.z-v1.z)*alpha);
    return v3;
}

const btn_reload = document.getElementById('btn_import_scene_glb');
const input_reload = document.getElementById('reload');

btn_reload.addEventListener('click', () =>{
    input_reload.click();
})

animate();
window.addEventListener('resize',resize);

