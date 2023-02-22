// $.get('animations.php?cache='+random(24), function(d) {
    
//     $.each(d, function(i,v) {
//         $('#selAvailableAnimations').append('<option value="'+i+'">'+v+'</option>');
//         // var gif = v.replace(/.fbx/, '.gif');
//         //     gif = (urlExists(gif)) ? gif : 'assets/img/temp.png';
//         // $('#all_animations_gallery').append('<div class="col item"><a href="#"><img class="img-fluid" src="'+gif+'" /></a><small></small>'+v+'</div>');
//     });
// });

// var d = [
//     {"file": "animations/Goalkeeper Idle.fbx", "isAdditive" : false},
//     {"file": "animations/Goalkeeper Diving Save.fbx", "isAdditive" : false},
//     {"file": "animations/Goalkeeper Overhand Throw.fbx", "isAdditive" : true},
//     {"file": "animations/Goalkeeper Idle.fbx", "isAdditive" : true}
// ];

// var characterModel;
// fbxLoader.load('model_idle.fbx', function(object) {
//     object.animations = []; //object.animations.filter(function(x) {x.name !== 'Take 001'});
//     characterModel = object;
//     }, function (xhr) {
//     var p = (xhr.loaded / xhr.total) * 100;
//         $('#progress > div')
//             .css('width', p+'%')
//             .text('Loading Model');
//         if (xhr.loaded / xhr.total == 1) {
            
//             setTimeout(function(){
//                 characterModel.traverse(function(child) {
//                     if (child.isMesh) {
//                         child.castShadow = true;
//                         child.recieveShadow = true;
//                     }
//                 });
//                 mixer = new THREE.AnimationMixer(characterModel);
//                 scene.add(characterModel);
               
//                 var init_anim_count = characterModel.animations.length;
//                 $.each(characterModel.animations, function(i,v) {
//                     characterModel.animations[i].order = i;
//                 });
                
//                 $.each(d, function(i,v){
//                     setTimeout(function() {
//                     fbxLoader.load(v.file, function(anim) {
//                         anim.animations[0].name = v.file;
//                         anim.animations[0].order = i + init_anim_count;
//                         anim.animations[0].isAdditive = v.isAdditive;
//                         characterModel.animations.push(anim.animations[0]);
//                     });
//                     }, 1000);
//                 });
                
//                 characterModel.animations = sortResults(characterModel.animations, 'order', true);
//                 // characterModel.animations = sort_anims;
//                 setTimeout(function(){
//                     console.log('model', characterModel);
//                 }, 500);
                
//                 $('#progress').hide();
                
//             }, 1000);
//         }
//     }, function (error) {
//         console.error(error)
//     }
// );

// var activeAction, previousAction;


// function startAnim() {
//     characterModel.animations = sortResults(characterModel.animations, 'order', true);
//     console.log('model', characterModel);
//     var startAt = 0;
//     $.each(characterModel.animations, function(i, v) {
//         var t = v.duration * 1000;
//         setTimeout(function() {
//           mixer = new THREE.AnimationMixer( characterModel );
//             var clip = characterModel.animations[i];
//             if (clip.isAdditive) {
//                 THREE.AnimationUtils.makeClipAdditive(clip);
//             }
//             var action = mixer.clipAction( clip ).setEffectiveWeight(1.0);
//                 if (i==0) activeAction = action;
            
//             fadeToAction(action, 1);
//         }, startAt);
//         startAt = startAt + t;
//         prevAction = action;
//     });

// }


// function fadeToAction( action, fadeDuration ) {
//     previousAction = activeAction;
//     activeAction = action;

//     if ( previousAction !== activeAction ) {
//         previousAction.fadeOut( fadeDuration );
//     }
//     activeAction
//         .reset()
//         .setEffectiveTimeScale( 1 )
//         .setEffectiveWeight( 1 )
//         .setLoop(THREE.LoopOnce)
//         .fadeIn( fadeDuration )
//         .play();
    
//     if ( previousAction !== activeAction ) {
//         previousAction.crossFadeTo(activeAction, 1);
//     }
//     activeAction.clampWhenFinished = true;
// }
