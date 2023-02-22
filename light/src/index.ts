import { KeyDisplay } from './utils';
import { CharacterControls } from './characterControls';
import * as THREE from 'three'
import { CameraHelper, Euler } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


import ('@dimforge/rapier3d').then(RAPIER => {
    let gravity = {x:0.0, y: -9.81, z:0.0};
    let world = new RAPIER.World(gravity);

    //add physical bodys.........

    //Game loop.
    let gameLoop = () => {
        world.step();
        setTimeout(gameLoop, 16);
    };

    gameLoop();
})












// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa8def0);

// CAMERA
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 5;
camera.position.z = 5;
camera.position.x = 0;

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true

// CONTROLS
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true
orbitControls.minDistance = 5
orbitControls.maxDistance = 15
orbitControls.enablePan = false
orbitControls.maxPolarAngle = Math.PI / 2 - 0.05
orbitControls.update();

// LIGHTS
light()

// FLOOR
generateFloor()


//Shellter
new GLTFLoader().load('models/bunkerwithoutdoors_untitled.glb', function (gltf) {
    const model = gltf.scene;
    model.traverse(function (object: any) {
        if (object.isMesh) object.receiveShadow = true;
    });
    model.position.setY(0.1)
    model.position.setZ(45)
    model.scale.set(0.5, 0.5, 0.5)
    scene.add(model);
});


// MODEL WITH ANIMATIONS
var characterControls: CharacterControls
new GLTFLoader().load('models/Homeless1.glb', function (gltf) {
    const model = gltf.scene;
    model.traverse(function (object: any) {
        if (object.isMesh) object.castShadow = true;
    });
    model.position.setY(0.1)
    model.scale.set(2, 2, 2)

    scene.add(model);
    console.log(model);
    console.log(gltf);
    const gltfAnimations: THREE.AnimationClip[] = gltf.animations;
    const mixer = new THREE.AnimationMixer(model);
    const animationsMap: Map<string, THREE.AnimationAction> = new Map()
    gltfAnimations.filter(a => a.name != 'Armature|mixamo.com|Layer0').forEach((a: THREE.AnimationClip) => {
        animationsMap.set(a.name, mixer.clipAction(a));
        console.log(a.name)
    })

    characterControls = new CharacterControls(model, mixer, animationsMap, orbitControls, camera, 'idle')
});

// CONTROL KEYS
const keysPressed = {}
const keyDisplayQueue = new KeyDisplay();
document.addEventListener('keydown', (event) => {
    keyDisplayQueue.down(event.key)
    if (event.shiftKey && characterControls) {
        characterControls.switchRunToggle()
    } else {
        (keysPressed as any)[event.key.toLowerCase()] = true
    }
}, false);
document.addEventListener('keyup', (event) => {
    keyDisplayQueue.up(event.key);
    (keysPressed as any)[event.key.toLowerCase()] = false
}, false);

const clock = new THREE.Clock();
// ANIMATE
function animate() {
    let mixerUpdateDelta = clock.getDelta();
    if (characterControls) {
        characterControls.update(mixerUpdateDelta, keysPressed);
    }
    orbitControls.update()
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
document.body.appendChild(renderer.domElement);
animate();

// RESIZE HANDLER
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    keyDisplayQueue.updatePosition()
}
window.addEventListener('resize', onWindowResize);

function generateFloor() {
    // TEXTURES
    // const textureLoader = new THREE.TextureLoader();
    // const placeholder = textureLoader.load("./textures/placeholder/placeholder.png");
    // const sandBaseColor = textureLoader.load("./textures/sand/Sand 002_COLOR.jpg");
    // const sandNormalMap = textureLoader.load("./textures/sand/Sand 002_NRM.jpg");
    // const sandHeightMap = textureLoader.load("./textures/sand/Sand 002_DISP.jpg");
    // const sandAmbientOcclusion = textureLoader.load("./textures/sand/Sand 002_OCC.jpg");

    // const WIDTH = 80
    // const LENGTH = 80

    // const geometry = new THREE.PlaneGeometry(WIDTH, LENGTH, 512, 512);
    // const material = new THREE.MeshStandardMaterial(
    //     {
    //         map: sandBaseColor, normalMap: sandNormalMap,
    //         displacementMap: sandHeightMap, displacementScale: 0.1,
    //         aoMap: sandAmbientOcclusion
    //     })
    // wrapAndRepeatTexture(material.map)
    // wrapAndRepeatTexture(material.normalMap)
    // wrapAndRepeatTexture(material.displacementMap)
    // wrapAndRepeatTexture(material.aoMap)
    // // const material = new THREE.MeshPhongMaterial({ map: placeholder})

    // const floor = new THREE.Mesh(geometry, material)
    // floor.receiveShadow = true
    // floor.rotation.x = - Math.PI / 2

    new GLTFLoader().load('models/asfalto.glb', function (gltf) {
        const model = gltf.scene;
        model.traverse(function (object: any) {
            if (object.isMesh) object.receiveShadow = true;
        });
        model.position.setY(0.1)
        model.scale.set(0.5,0.2,0.5)
        scene.add(model);
    });

}

function wrapAndRepeatTexture(map: THREE.Texture) {
    map.wrapS = map.wrapT = THREE.RepeatWrapping
    map.repeat.x = map.repeat.y = 10
}

function light() {
    scene.add(new THREE.AmbientLight(0xffffff, 0.7))

    const dirLight = new THREE.DirectionalLight(0xffffff, 3)
    dirLight.position.set(- 60, 100, - 10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = - 50;
    dirLight.shadow.camera.left = - 50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;
    scene.add(dirLight);
    // scene.add( new THREE.CameraHelper(dirLight.shadow.camera))
}
