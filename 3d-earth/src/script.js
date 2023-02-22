const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
	70,
	window.innerWidth / window.innerHeight,
	1.0,
	5000
);
//设置相机的位置
camera.up.z = 1;
camera.up.x = 0;
camera.up.y = 0;
camera.position.set(30, -25, 17);
scene.add(camera);

let renderer = new THREE.WebGLRenderer(/* {antialias: true} */);
renderer.setClearColor(0xeeeeee);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; //此处是告诉renderer我们需要阴影。
document.body.appendChild(renderer.domElement);

/*
 * galaxy
 */
//background images
const cubeLoader = new THREE.CubeTextureLoader();
const texture = cubeLoader.load([
	"https://xh-bucket01.oss-cn-shenzhen.aliyuncs.com/skybox/kenon_star/kenon_star_ft.jpg",
	"https://xh-bucket01.oss-cn-shenzhen.aliyuncs.com/skybox/kenon_star/kenon_star_bk.jpg",
	"https://xh-bucket01.oss-cn-shenzhen.aliyuncs.com/skybox/kenon_star/kenon_star_up.jpg",
	"https://xh-bucket01.oss-cn-shenzhen.aliyuncs.com/skybox/kenon_star/kenon_star_dn.jpg",
	"https://xh-bucket01.oss-cn-shenzhen.aliyuncs.com/skybox/kenon_star/kenon_star_rt.jpg",
	"https://xh-bucket01.oss-cn-shenzhen.aliyuncs.com/skybox/kenon_star/kenon_star_lf.jpg"
]);
scene.background = texture;

/*
 * light
 */
const light = new THREE.PointLight(0xffeecc, 1, 5000);
// light.castShadow = true;
// light.position.set(0, 100, 0);
camera.add(light);

const ambient = new THREE.AmbientLight(0x222222, 0.5);
scene.add(ambient);

/*
 * Events to fire upon window resizing.
 */
window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

/*
 * controls
 */
const controls = new THREE.OrbitControls(camera, renderer.domElement);
// controls.target = group;
// controls.minDistance = 40;

/*
 * earth
 */
let loader = new THREE.TextureLoader();
let group = new THREE.Group();
let earthTex = loader.load(
	// "https://xh-bucket01.oss-cn-shenzhen.aliyuncs.com/earth/03/ColorMap.jpg"
	"https://i.postimg.cc/7hbBhd26/2k-earth-daymap.jpg"
);
/* let bump = loader.load(
	"https://xh-bucket01.oss-cn-shenzhen.aliyuncs.com/earth/03/Bump.jpg"
); */
const normal = loader.load(
	"https://i.postimg.cc/XJSHyhx7/2k-earth-normal-map.png"
);
const spec = loader.load(
	"https://xh-bucket01.oss-cn-shenzhen.aliyuncs.com/earth/03/SpecMask.jpg"
);
let earthGeo = new THREE.SphereGeometry(20, 128, 128);
let earthMat = new THREE.MeshPhongMaterial({
	map: earthTex,
	transparent: true,
	// bumpMap: bump,
	// bumpScale: 0.8,
	normalMap: normal,
	normalScale: new THREE.Vector2(10, 10),
	specularMap: spec,
	specular: "#222222"
});
let earth = new THREE.Mesh(earthGeo, earthMat);
earth.castShadow = true;
earth.receiveShadow = true;
earth.rotateX((Math.PI * 67.5) / 180);
group.add(earth);

/*
 * cloud
 */
let cloudTexture = loader.load(
	"https://xh-bucket01.oss-cn-shenzhen.aliyuncs.com/earth/03/alphaMap.jpg"
);
let cloudGeo = new THREE.SphereGeometry(20.2, 128, 128);
let cloudMat = new THREE.MeshPhongMaterial({
	alphaMap: cloudTexture,
	transparent: true
});
let cloud = new THREE.Mesh(cloudGeo, cloudMat);
cloud.castShadow = true;
cloud.receiveShadow = true;
cloud.rotation.x = (Math.PI * 67.5) / 180;
// cloud.rotateX(Math.PI * 0.5);
// group.add(cloud);

/*
 * moon
 */
let moonTex = loader.load(
	"https://xh-bucket01.oss-cn-shenzhen.aliyuncs.com/earth/02/moon2020.jpg"
);

let moonGeo = new THREE.SphereGeometry(6, 128, 128);
let moonMat = new THREE.MeshLambertMaterial({
	map: moonTex
});
let moon = new THREE.Mesh(moonGeo, moonMat);
moon.castShadow = true;
moon.receiveShadow = true;
moon.rotateX(Math.PI * 0.5);
moon.position.set(0, 120, 0);
group.add(moon);
scene.add(group);

group.position.set(0, 0, 0);
camera.lookAt(group.position);

const options = {
	speedUp: 4,
	x: 1,
	y: 1
};

let gui = new dat.GUI();
gui.add(options, "speedUp", 1, 8);
gui.add(options, "x", 1, 20);
gui.add(options, "y", 1, 20);

function render() {
	earth.material.normalScale.set(options.x, options.y);
	earth.rotation.y += 0.001;
	cloud.rotation.y += 0.003;
	window.requestAnimationFrame(render);
	renderer.render(scene, camera);
}

render();
