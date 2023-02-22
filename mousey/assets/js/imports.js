var fileType = '';
var colladaLoader = new THREE.ColladaLoader();
var gltfLoader = new THREE.GLTFLoader();
var objLoader = new THREE.ObjectLoader();
var stlLoader = new THREE.STLLoader();
var fbxLoader = new THREE.FBXLoader();
var gcodeLoader = new THREE.GCodeLoader();
var svgLoader = new THREE.SVGLoader();
var mixer = {};
function loadFile(filename, url, id)  {
    let last_dot = filename.lastIndexOf('.');
    let fileType = filename.slice(last_dot + 1);
    let filename_noext = filename.slice(0, last_dot);

// ██████   █████  ███████ 
// ██   ██ ██   ██ ██      
// ██   ██ ███████ █████   
// ██   ██ ██   ██ ██      
// ██████  ██   ██ ███████ 
                        
                        

    if (fileType == 'dae') {
        colladaLoader.load( url, function ( dae ) {        
            model = dae.scene;
            scene.add(model);
            URL.revokeObjectURL(url);
        })
    }

//  ██████  ██      ████████ ███████ 
// ██       ██         ██    ██      
// ██   ███ ██         ██    █████   
// ██    ██ ██         ██    ██      
//  ██████  ███████    ██    ██      
                                  
    if (fileType == 'gltf') {
        gltfLoader.load( url, function ( gltf ) {        
            model = gltf.scene;
            scene.add(model);
            // URL.revokeObjectURL(url);
        })
    }

                           

//  ██████  ██      ██████  
// ██       ██      ██   ██ 
// ██   ███ ██      ██████  
// ██    ██ ██      ██   ██ 
//  ██████  ███████ ██████  
                         
    if (fileType == 'glb') {
        gltfLoader.load( url, function ( glb ) {        
            model = glb.scene;
            model.app_uuid = id;
            scene.add(model);
            window[id] = model;
            // URL.revokeObjectURL(url);
            // return model;
        })
    }

//  ██████  ██████       ██ 
// ██    ██ ██   ██      ██ 
// ██    ██ ██████       ██ 
// ██    ██ ██   ██ ██   ██ 
//  ██████  ██████   █████  
                         
                         

// ███████ ████████ ██      
// ██         ██    ██      
// ███████    ██    ██      
//      ██    ██    ██      
// ███████    ██    ███████ 
                         
    if (fileType == 'stl') {
        stlLoader.load( url, function ( stl ) {        
            model = new THREE.Mesh(stl, material);
            scene.add(model);
            URL.revokeObjectURL(url);
        })
    }

// ███████ ██████  ██   ██ 
// ██      ██   ██  ██ ██  
// █████   ██████    ███   
// ██      ██   ██  ██ ██  
// ██      ██████  ██   ██ 
                        
    if (fileType == 'fbx') {
        fbxLoader.load( url, function ( fbx ) {
            console.log('fbx', fbx)
            // model.children = fbx.children

            fbx.traverse(
                (child) => {
                    if(child.isMesh){
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                }
            )
            model = fbx; //new THREE.Object3D();
            model.app_uuid = id;
            model.animations = [];
            mixer[id] = new THREE.AnimationMixer(model);
            scene.add(model);
        })
    }

//  ██████   ██████  ██████  ██████  ███████ 
// ██       ██      ██    ██ ██   ██ ██      
// ██   ███ ██      ██    ██ ██   ██ █████   
// ██    ██ ██      ██    ██ ██   ██ ██      
//  ██████   ██████  ██████  ██████  ███████ 
                                          
                                          

// ███████ ██    ██  ██████  
// ██      ██    ██ ██       
// ███████ ██    ██ ██   ███ 
//      ██  ██  ██  ██    ██ 
// ███████   ████    ██████  
                          
                          
    if (fileType == 'svg') {
        svgLoader.load( url, function ( data ) {        
				const paths = data.paths;
				const group = new THREE.Group();

				for ( let i = 0; i < paths.length; i ++ ) {

					const path = paths[ i ];

					const material = new THREE.MeshBasicMaterial( {
						color: 'silver',
						side: THREE.DoubleSide,
						depthWrite: true
					} );

					// const shapes = (new THREE.SVGLoader).createShapes( path );
                    const shapes = path.toShapes(true);
                    
                            console.log('shapes', shapes)
					for ( let j = 0; j < shapes.length; j ++ ) {

						const shape = shapes[ j ];
						const geometry = new THREE.ExtrudeGeometry( shape, {depth: 20, bevelEnabled: false} );
						const mesh = new THREE.Mesh( geometry, material );
						group.add( mesh );

					}

				}
                group.position.set(0,0,0);
				scene.add( group );
            URL.revokeObjectURL(url);
        })
    }
    console.log(scene);
};

$(document).ready(function() {
   $('.btn_import').click(function() {
        fileType = $(this).text().toLowerCase();
        $("#fileinput").attr("accept", "." + fileType);
        $("#fileinput").click();
   });
});