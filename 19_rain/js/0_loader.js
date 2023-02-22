//____________________ гюцпсгвхй ____________________


var manager_to_load=0; // яйнкэйн мюдн гюцпсгхрэ вепег лемдфеп гюцпсгнй. ондявхршбюеряъ мхфе
var manager_loaded=0; // гюцпсфемн б лемедфепе
var other_to_load=0; // яйнкэйн мюдн гюцпсгхрэ мюопълсч нярюкэмшу тюикнб. ондявхршбюеряъ мхфе
var other_loaded=0; // гюцпсфемн мюопълсч


var loadingManager=new THREE.LoadingManager();
loadingManager.onProgress=function(item,loaded,total){
console.log(item,loaded,total);
manager_loaded=loaded;
if(loaded==total){ console.log("тюикш б лемедфепе гюцпсфемш"); }
};


//____________________ гюосярхрэ опнбепйс гюцпсгйх тюикнб, йнцдю яюлю ярпюмхжю гюцпсгхряъ ____________________


window.onload=function(){
audios=document.getElementsByTagName("audio");
check_loaded=setTimeout("is_loaded();",100);
}


//____________________ опнбепйю гюцпсгйх тюикнб ____________________


var audios=[];
var check_loaded;


function is_loaded(){
document.getElementById("loading_amount").innerHTML=(manager_loaded+other_loaded)+"/"+(manager_to_load+other_to_load);
for(var aui=0;aui<audios.length;aui++){
if(audios[aui].readyState!=4){ check_loaded=setTimeout("is_loaded();",100); return; }
}


if(manager_to_load+other_to_load==manager_loaded+other_loaded){
document.getElementById("loading").style.display="none";
clearTimeout(check_loaded);
init_first();
return;
}


check_loaded=setTimeout("is_loaded();",100);
}


//____________________ оняке гюцпсгйх оепбюъ хмхжхюкхгюжхъ ____________________


function init_first(){

canvas.requestPointerLock=canvas.requestPointerLock || canvas.mozRequestPointerLock;
document.exitPointerLock=document.exitPointerLock || document.mozExitPointerLock;
document.addEventListener("pointerlockchange",lockChangeAlert,false);
document.addEventListener("mozpointerlockchange",lockChangeAlert,false);

scene.add(new THREE.AxesHelper(100));
//document.getElementById("begin").style.display="block";
init_lights();
//camera.add(listener);
init_last();
}


//____________________ онякедмъъ хмхжхюкхгюжхъ х гюосяй ____________________


function init_last(){
//document.getElementById("begin").style.display="none";


if(use_fullscreen==1){
fullscreen();
canvas.requestPointerLock();
}


stop=0;
loop();
}
