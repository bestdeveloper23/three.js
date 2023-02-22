var dirLight;
var project_d = [{},[]];
const loader = new THREE.FileLoader();
var colladaLoader = new THREE.ColladaLoader();
var gltfLoader = new THREE.GLTFLoader();
var fbxLoader = new THREE.FBXLoader();
var objLoader = new THREE.OBJLoader();

setInterval(function() {
    // $('#json_p').text(JSON.stringify(project_d,null,4));
}, 500);

//------------------------------animation_start-----------------------------------------------------/

function startAnim() {

    total_timeduration = 0;
    setkey_flag = true;
    for (let i=0; i<camera_tween_positions.length-1; i++){
        time_durations[i] = time_points[i+1] - time_points[i];
    }
    // const numbers_mixer = count_mixer();
    document.querySelector('#btn_startAnim').disabled = true;
    const numbers_mixer = Object.keys(mixer).length;
    var dur = 0;
    for(let i=0; i<numbers_mixer; i++)
    {
        const id = Object.keys(mixer)[i];
        var obj = scene.children.filter(function(o) {return o.app_uuid == id})[0];
        const numbers_animations = obj.animations.length;
        var durations = 0;
        for ( let j = 0; j < numbers_animations; j++ ){
            const animation  = mixer[id].clipAction(obj.animations[j]);
            animation.loop = THREE.LoopOnce;
            setTimeout(function() {
                animation.play();
            }, durations*1000);
            durations += obj.animations[j].duration/(animation.getEffectiveTimeScale());
            setTimeout(function() {
                animation.stop();
            }, durations*1000);
        }
        if(durations > dur)
            dur = durations;
    }
    document.querySelector('#timeline_background').animate({width: '+'+dur*12+'px'}, dur*1000, 'linear');
    setTimeout(function() {
        $('#timeline_background').width(3);
        document.querySelector('#btn_startAnim').disabled = false;
        setkey_flag = false;
    }, dur*1000);
    audio_in.play(0,dur);
}

function count_mixer () {
    var count = 0;
    for ( let key in mixer) {
        count++;
    }
    return count;
}
//------------------------------animation_start-----------------------------------------------------/

function random(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

function newUUID() {
    return 'UUID-'+random(8)+'-'+random(4)+'-'+random(4)+'-'+random(4)+'-'+random(12);
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getAngle(p_angle) {
    return 2 * Math.PI * (p_angle / 360);
}

function getAngleReverse(p_angle) {
    return (p_angle * 360/ Math.PI) / 2;
}

function urlExists(testUrl) {
 var http = jQuery.ajax({
    type:"HEAD",
    url: testUrl,
    async: false
  })
  return http.status == 200 ? true : false;
      // this will return 200 on success, and 0 or negative value on error
}

// function imageSize(src, callback){
//     // var img=document.createElement('img');
//     var img = new Image();
//     img.src=src;
//     img.hidden = 'true';
//     img.onload = function() {
//         var w = this.width;
//         var h = this.height;
//         var ratio = h/w;
//         var results = {"width": w, "height": h, "ratio": ratio};
//         callback(results);
//     }

// }
function hexToRgb(hex) {
  return hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
      , (m, r, g, b) => "#" + r + r + g + g + b + b)
      .substring(1).match(/.{2}/g)
      .map(x => parseInt(x, 16));
}

function hexTo0x(hex) {
  return parseInt('0x'+ hex.replace(/#/,''));
}

function createText(id, name, group, text, color, fontsize, depth, style, position, rotation) {
    const textloader = new THREE.FontLoader();
    fontJson = (style.toLowerCase() == 'bold') ? 'assets/js/fonts/helvetiker_bold.typeface.json' : 'assets/js/fonts/helvetiker_regular.typeface.json' ;
    textloader.load( fontJson, function ( font ) {
        const textGeo = new THREE.TextGeometry( text, {
            font: font,
            size: fontsize,
            height: depth,
            curveSegments: 9, //fontsize/12.5,
            bevelThickness: 0,
            bevelSize: 0,
            bevelEnabled: false
        });
        const textMaterial = new THREE.MeshPhongMaterial( );
        textMaterial.color.set(color);
        var mesh = new THREE.Mesh( textGeo, textMaterial );
        mesh.position.set(position.x,position.y,position.z);

        mesh.rotation.set(rotation.x,rotation.y,rotation.z);
        mesh.name = 'text_'+name;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.cursor = 'pointer';
        group.add( mesh );
        // callback = mesh;
        // const spotLight = new THREE.SpotLight( 0xffffff, 0.05 );
        // spotLight.position.set(centerOffset + (position.x), position.y, centerOffset + position.z);
        // spotLight.position.set(position.x, position.y, position.z);
        // scene.add( spotLight );
        // spotLight.target = mesh;
    });
}

function getMaterial(url, rpt_x, rpt_y, geo_x, geo_y) {
    rpt_x = rpt_x ==null || rpt_x == undefined ? 1 : rpt_x;
    rpt_y = rpt_y ==null || rpt_y == undefined ? 1 : rpt_y;
//     geo_x = geo_x ==null || geo_x == undefined ? 100 : geo_x;
//     geo_y = geo_y ==null || geo_y == undefined ? 100 : geo_y;
    
//     grass_geometry = new THREE.PlaneGeometry(geo_x, geo_y, 1, 1);
//     grass_geometry.rotateX(-Math.PI / 2);
    var textureLoader = new THREE.TextureLoader();
    var grass_texture = textureLoader.load(url, function ( texture ) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set( 0, 0 );
        texture.repeat.set(rpt_x,rpt_y);
    });
    

    grass_material = new THREE.MeshPhongMaterial({
        shininess:100,
        map: grass_texture
    });
    
    return grass_material;
}


function sortResults(data, prop, asc) {
   return data.sort(function(a, b) {
        if (asc == true) {
            return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        } else {
            return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        }
    });
}