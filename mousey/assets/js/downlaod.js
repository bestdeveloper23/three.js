$(document).ready(function() {
$('#btn_export_scene_dae').click(function() {
    var exporter = new THREE.ColladaExporter();
    const result = exporter.parse( g, undefined, { upAxis: 'Y_UP', unitName: 'millimeter', unitMeter: 0.001 } );
    saveString( result.data, 'scene.dae' );
});
    
$('#btn_export_scene_fbx').click(function() {
    var exporter = new THREE.FBXExporter();
    const result = exporter.parse( scene, undefined, { upAxis: 'Y_UP', unitName: 'millimeter', unitMeter: 0.001 } );
    saveString( result.data, 'scene.dae' );
});
    
$('#btn_export_scene_stl').click(function() {
    var exporter = new THREE.STLExporter();
    const result = exporter.parse( g );
    var blob = new Blob( [result], { type : 'text/plain' } );
    saveString( blob, 'scene.stl' );
});
    
$('#btn_export_scene_stl_binary').click(function() {
    var exporter = new THREE.STLExporter();
    const result = exporter.parse( g, { binary: true } );
    saveArrayBuffer( result, 'scene.stl' );
});
    
$('#btn_export_scene_gltf').click(function() {
    var exporter = new THREE.GLTFExporter();
    exporter.parse( g, function( result ) {
            var output = JSON.stringify( result, null, 2 );
            saveString( output, 'scene.gltf' );
    }, {binary: false} );
});
    
$('#btn_export_scene_glb').click(function() {
    const numbers_mixer = Object.keys(mixer).length;
    var animation_array=[];
    for(let i=0; i<numbers_mixer; i++)
    {
        const id = Object.keys(mixer)[i];
        var obj = scene.children.filter(function(o) {return o.app_uuid == id})[0];
        const numbers_animations = obj.animations.length;

        for ( let j = 0; j < numbers_animations; j++ ){
            animation_array.push(obj.animations[j])
        }
    }

    var charater_items = document.getElementById('model_list').getElementsByTagName('button');
    var characters = [];
    for(let i=0; i<charater_items.length; i++){
        const model_uuid = $(charater_items[i]).attr('data-id');
        var obj = scene.children.filter(function(o){ return o.app_uuid == model_uuid})[0];
        characters.push(obj);
    }

    var exporter = new THREE.GLTFExporter();
    const options = {
		trs: params.trs,
		onlyVisible: params.onlyVisible,
		binary: params.binary,
		// maxTextureSize: params.maxTextureSize,
        animations: animation_array,
	};
    exporter.parse( characters, function( result ) {
        if ( result instanceof ArrayBuffer ) {
            saveArrayBuffer( result, 'scene.glb' );
            console.log(scene)
        } else {
            const output = JSON.stringify( result, null, 2 );
            console.log( output );
            saveString( output, 'scene.gltf' );
        }
    },
    function ( error ) {
        console.log( 'An error happened during parsing', error );
    }, options);
});
});

const params = {
    trs: false,
    onlyVisible: true,
    binary: true,
    // maxTextureSize: 4096,
};

var link = document.createElement('a');
link.style.display = 'none';
document.body.appendChild(link); // Firefox workaround, see #6594

function save( blob, filename ) {
    link.href = URL.createObjectURL( blob );
    link.download = filename;
    link.click();
}

function saveString( text, filename ) {
    save( new Blob( [ text ], { type: 'text/plain' } ), filename );
}

function saveArrayBuffer( buffer, filename ) {
    save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );
}