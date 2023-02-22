var app = angular.module('3dRender', ['ui.bootstrap']);


var mainCtrl = function ($scope, $modal, $log) {

  //objects to store the scene configuration
  $scope.defaultSceneConfig = null;
  $scope.scene1Config = null;
  
  $scope.openDefaultSceneModal = function () {
    var modalInstance = $modal.open({
      templateUrl: 'defaultSceneModalContent.html',
      controller: defaultSceneModalCtrl,
      size: 'lg',
      resolve:{
        parentScope: function () {
          return $scope;
        }
      }
    });
  };
  $scope.openScene1EditModal = function () {
    var modalInstance = $modal.open({
      templateUrl: 'scene1EditModalContent.html',
      controller: scene1EditModalCtrl,
      size: 'lg',
      resolve:{
        parentScope: function () {
          return $scope;
        }
      }
    });
  };
  $scope.openSceneViewModal = function () {
    var modalInstance = $modal.open({
      templateUrl: 'scene1ViewModalContent.html',
      controller: scene1ViewModalCtrl,
      size: 'lg',
      resolve:{
        parentScope: function () {
          return $scope;
        }
      }
    });
  };
  
};

var defaultSceneModalCtrl = function ($scope, $modalInstance, parentScope) {
  
  //file to store 3d model
  $scope.defaultModelFile = null;
  

  //------------------------varaiables-----------------


  let scene, renderer, camera, count=0, orbitcontrol, scan_model, raycaster, circles=[], blue_material = [], red_material = [], flag = [], index = [];
  let pointer = new THREE.Vector2();
  let min_x_pos, max_x_pos, min_y_pos, man_y_pos, max_z_pos, min_z_pos, max;
  let init_flag = true;


  const fbxLoader = new THREE.FBXLoader();
  const gltfLoader = new THREE.GLTFLoader();
  const objLoader = new THREE.OBJLoader();

  //object to save scene configuration
  $scope.sceneConfig = {
    scene: scene
  };
  
  function init(){
    const container = document.querySelector("#scenecontainer1");
    console.log(container)
    scene = new THREE.Scene();
    scene.background = new THREE.Color('white');
    camera = new THREE.PerspectiveCamera( 45, container.clientWidth / container.clientHeight, 0.01, 100 );
    camera.position.set( 1.5, 1.5, 1.5 );
    camera.lookAt( 0,0,0 );
    camera.updateMatrix();
    const light = new THREE.SpotLight('white', 1)

    light.position.set(20, 30, 20);
    scene.add(light)

    console.log(light)
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( container.clientWidth, container.clientHeight );
    container.appendChild( renderer.domElement );

    //orbitcontrol = new THREE.OrbitControls(camera, renderer.domElement);


  }

  $scope.addCircle = function(){


    if(init_flag){
      init();
      animate();
      init_flag=false;
    }
    count++;
    const url = `./imgs/text${count}.png`;
    const url2 = `./imgs/red${count}.png`;
    const image = new Image();
    const image2 = new Image();

    image.crossOrigin = "anoymous";
    image.src = url; 
    image2.crossOrigin = "anoymous";
    image2.src = url2;
    
    let map1 = new THREE.Texture();
    let map2 = new THREE.Texture();
    map1.source.data = image;
    map1.needsUpdate = true;
    map2.source.data = image2;
    map2.needsUpdate = true;
//    let map1 = new THREE.TextureLoader().load(url);
    // let map2 = new THREE.TextureLoader().load(`./imgs/red${count}.png`);
    let material1 = new THREE.SpriteMaterial({ map: map1 });
    let material2 = new THREE.SpriteMaterial({ map: map2 });
    blue_material.push(material1);
    red_material.push(material2);


     //let map1 = new THREE.TextureLoader().load(`./imgs/text${count}.png`);
     //let map2 = new THREE.TextureLoader().load(`./imgs/red${count}.png`);

    flag.push(true);
    let circle = new THREE.Sprite(material1);
    
    circle.position.set(0,0,(max_z_pos-min_z_pos)/max);
    console.log(max_z_pos)
    circle.scale.set(0.1,0.1,0.1)

    circles.push(circle);
    index.push(circle.uuid);
    const dControl = new THREE.DragControls(circles ,camera, renderer.domElement);

    dControl.activate();

    scene.add( circle );
  }
  
  $scope.save = function () {
    
    if(init_flag){
      init();
      animate();
      init_flag=false;
    }
    //save scene configuration
    parentScope.defaultSceneConfig = $scope.sceneConfig;
    console.log(parentScope.defaultSceneConfig);
    
    $modalInstance.dismiss('cancel');
  };
  
  $scope.uploadFile = function(){
    if(init_flag){
      init();
      animate();
      init_flag=false;
    }
    
    var fileInput = document.getElementById("defaultFileInput");
    if (fileInput.files.length === 0) {
      return;
    };
    let model_file = fileInput.files[0];
    if (!model_file){
        console.log("No model currently selected for upload")

    } else {
      $scope.defaultModelFile = model_file;

      let filename = model_file.name; 
      let last_dot = filename.lastIndexOf('.');
      let fileType = filename.slice(last_dot + 1);

      const model_url = window.URL.createObjectURL(model_file);

      if( fileType == 'obj' ) {
          objLoader.load(model_url, function (obj) {
            max = 0;
            max_x_pos = 0;
            min_x_pos = 0;
            max_y_pos = 0;
            min_y_pos = 0;
            max_z_pos = 0;
            min_z_pos = 0;
                model = obj;
                model.traverse(
                    (child) => {
                        if ((child).isMesh) {
                            var point_count = child.geometry.attributes.position.count*3;
                        
                            for(let i=0; i<point_count; i++){
                              if( i % 3 == 0 ) {
                                  if( max_x_pos < child.geometry.attributes.position.array[i] )	max_x_pos = child.geometry.attributes.position.array[i];
                            if( min_x_pos > child.geometry.attributes.position.array[i] )   min_x_pos = child.geometry.attributes.position.array[i];
                            
                              }
                              if( i % 3 == 1 ) {
                                  if( max_y_pos < child.geometry.attributes.position.array[i] )	max_y_pos = child.geometry.attributes.position.array[i];
                            if( min_y_pos > child.geometry.attributes.position.array[i] )   min_y_pos = child.geometry.attributes.position.array[i];			    	
                              }

                              if( i % 3 == 2 ) {
                                  if( max_z_pos < child.geometry.attributes.position.array[i] )	max_z_pos = child.geometry.attributes.position.array[i];
                            if( min_z_pos > child.geometry.attributes.position.array[i] )   min_z_pos = child.geometry.attributes.position.array[i];			    	
                              }
                            }
                        }
                    }
                )
          max = Math.max(max_x_pos-min_x_pos, max_y_pos-min_y_pos, max_z_pos-min_z_pos);
                    model.scale.set(1/max, 1/max, 1/max);
                model.position.set(( max_x_pos + min_x_pos ) / 2 / max * (-1), ( max_y_pos + min_y_pos ) / 2 /max *(-1) ,( max_z_pos + min_z_pos ) / 2 /max *(-1));
    //		model.position.set(0, 0, 0);
                if(scan_model) scene.remove(scan_model);
                scan_model = model;
                scene.add(model);
          })
      }

      if (fileType == 'gltf' || fileType == 'glb') {
            gltfLoader.load( model_url, function ( gltf ) {        
            var max = 0;

            max_x_pos = 0;
            min_x_pos = 0;
            max_y_pos = 0;
            min_y_pos = 0;
            max_z_pos = 0;
            min_z_pos = 0;
                model = gltf.scene;
                model.traverse(
                    (child) => {
                        if ((child).isMesh) {
                            var point_count = child.geometry.attributes.position.count*3;
                        
                            for(let i=0; i<point_count; i++){

              if( i % 3 == 0 ) {
                  if( max_x_pos < child.geometry.attributes.position.array[i] )	max_x_pos = child.geometry.attributes.position.array[i];
            if( min_x_pos > child.geometry.attributes.position.array[i] )   min_x_pos = child.geometry.attributes.position.array[i];
            
              }
              if( i % 3 == 1 ) {
                  if( max_y_pos < child.geometry.attributes.position.array[i] )	max_y_pos = child.geometry.attributes.position.array[i];
            if( min_y_pos > child.geometry.attributes.position.array[i] )   min_y_pos = child.geometry.attributes.position.array[i];			    	
              }
              if( i % 3 == 2 ) {
                  if( max_z_pos < child.geometry.attributes.position.array[i] )	max_z_pos = child.geometry.attributes.position.array[i];
            if( min_z_pos > child.geometry.attributes.position.array[i] )   min_z_pos = child.geometry.attributes.position.array[i];			    	
              }
                            }
                        }
                    }
                )
          max = Math.max(max_x_pos-min_x_pos, max_y_pos-min_y_pos, max_z_pos-min_z_pos);
                    model.scale.set(1/max, 1/max, 1/max);
                model.position.set(( max_x_pos + min_x_pos ) / 2 / max * (-1), ( max_y_pos + min_y_pos ) / 2 /max *(-1) ,( max_z_pos + min_z_pos ) / 2 /max *(-1));
                if(scan_model) scene.remove(scan_model);
                scan_model = model;

                scene.add(model);
            })
        }
      if( fileType == 'fbx' ) {
      
            fbxLoader.load(
                model_url,
                (model) => {
                    var max = 0;

            max_x_pos = 0;
            min_x_pos = 0;
            max_y_pos = 0;
            min_y_pos = 0;
            max_z_pos = 0;
            min_z_pos = 0;
                    model.traverse(
                        (child) => {
                            if ((child).isMesh) {
                                var point_count = child.geometry.attributes.position.count*3;
                            
                                for(let i=0; i<point_count; i++){

              if( i % 3 == 0 ) {
                  if( max_x_pos < child.geometry.attributes.position.array[i] )	max_x_pos = child.geometry.attributes.position.array[i];
            if( min_x_pos > child.geometry.attributes.position.array[i] )   min_x_pos = child.geometry.attributes.position.array[i];
            
              }
              if( i % 3 == 1 ) {
                  if( max_y_pos < child.geometry.attributes.position.array[i] )	max_y_pos = child.geometry.attributes.position.array[i];
            if( min_y_pos > child.geometry.attributes.position.array[i] )   min_y_pos = child.geometry.attributes.position.array[i];			    	
              }
              if( i % 3 == 2 ) {
                  if( max_z_pos < child.geometry.attributes.position.array[i] )	max_z_pos = child.geometry.attributes.position.array[i];
            if( min_z_pos > child.geometry.attributes.position.array[i] )   min_z_pos = child.geometry.attributes.position.array[i];			    	
              }
                            }
                        }
                    }
                )
	    max = Math.max(max_x_pos-min_x_pos, max_y_pos-min_y_pos, max_z_pos-min_z_pos);
                model.scale.set(1/max, 1/max, 1/max);
            model.position.set(( max_x_pos + min_x_pos ) / 2 / max * (-1), ( max_y_pos + min_y_pos ) / 2 /max *(-1) ,( max_z_pos + min_z_pos ) / 2 /max *(-1));
                if(scan_model) scene.remove(scan_model);

                scan_model = model;
		scene.add(model);

            })
        }
    }
    
  };
  
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  function animate() {

    requestAnimationFrame( animate );

    render();

  };

  function render() {
    camera.updateMatrixWorld();
    renderer.render( scene, camera );
  }

};

var scene1EditModalCtrl = function ($scope, $modalInstance, parentScope) {

  //file to store 3d model
  $scope.scene1ModelFile = null;
  
  //clone default scene configuration
  $scope.sceneConfig = JSON.parse(JSON.stringify(parentScope.defaultSceneConfig));
  //render clone and let user reposition circles by drag and drop
  $scope.sceneConfig.todo = 'scene1';
  
  $scope.save = function () {
    
    //save scene configuration
    parentScope.scene1Config = $scope.sceneConfig;
    console.log(parentScope.scene1Config);
    $modalInstance.dismiss('cancel');
  };
  
  $scope.uploadFile = function(){
    
    var fileInput = document.getElementById("scene1FileInput");
    if (fileInput.files.length === 0) {
      return;
    };
    var file = fileInput.files[0];
    var payload = new FormData();
    payload.append("file", file);
    $scope.scene1ModelFile = file;
    console.log($scope.scene1ModelFile);
  };
  
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

var scene1ViewModalCtrl = function ($scope, $modalInstance, parentScope) {

  //load scene 1 config and render
  $scope.sceneConfig = parentScope.scene1Config;
  //render code here:
  console.log(parentScope.scene1Config);
  
  $scope.changeCircleColor = function(){
    
    //code to change the color of one of the circles in the scene
    console.log("Color changed");
  };
  
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};






