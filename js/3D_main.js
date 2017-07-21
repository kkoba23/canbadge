// シーン
var scene = new THREE.Scene();
var canB = new THREE.Object3D();
var canD = new THREE.Object3D();
// カメラ
var camera = new THREE.PerspectiveCamera(50, 360 / 360, 1, 1000);


var canbadge3Dinit = function(canTexture) {

	// レンダラー
	var renderer = new THREE.WebGLRenderer({
		alpha : true
	});
	renderer.setSize(360, 360);
	// renderer.setSize(window.innerWidth, window.innerHeight);
	document.getElementById("viewArea").appendChild(renderer.domElement);// 描画領域の実装
	// document.body.appendChild(renderer.domElement);

	// マウスコントロール
	var controls = new THREE.OrbitControls(camera);
	controls.enableZoom = false;

	// ライト
	var directionalLight1 = new THREE.DirectionalLight('#aaaaaa', 1);
	directionalLight1.position.set(0, 10, 10);
	scene.add(directionalLight1);

	var directionalLight2 = new THREE.DirectionalLight('#aaaaaa', 0.5);
	directionalLight2.position.set(10, -5, 3);
	scene.add(directionalLight2);

	var directionalLight2 = new THREE.DirectionalLight('#aaaaaa', 0.5);
	directionalLight2.position.set(-10, -5, -3);
	scene.add(directionalLight2);


	var ambientLight = new THREE.AmbientLight('#aaaaaa', 1.5);
	scene.add(ambientLight);

	// instantiate a loader
	var loader = new THREE.JSONLoader();

//	canD = new THREE.Object3D();
//	canB = new THREE.Object3D();

	// load a resource
	loader.load(
	// resource URL
	'model/Badge_02_down.json',
	// Function when resource is loaded
	function(object) {
		var material = new THREE.MeshPhongMaterial({
			color : 0x222222,
			ambient : 0x990000,
			specular : 0xffffff,
			shininess : 30,
			metal : true
		});
		json = new THREE.Mesh(object, material);
		json.scale.x = 1;
		json.scale.y = 1;
		json.scale.z = 1;
//		json.rotation.x = Math.PI / 2;
//		json.rotation.z = -20 / 360 * 2 * Math.PI;
		canD.add(json);
	});

	canbadgeLoader(canTexture);

	scene.add(canB);
	scene.add(canD);

	positionInit();

	// レンダリング
	function render() {
		requestAnimationFrame(render);
		// cube.rotation.x += 0.01;
		canB.rotation.z += 0.001;
		canD.rotation.z += 0.001;
		controls.update();
		renderer.render(scene, camera);
	}
	render();
}

var positionInit = function(){
	camera.position.set(0, 0, 35);
	canB.rotation.x = Math.PI / 2;
	canB.rotation.z = -20 / 360 * 2 * Math.PI;
	canB.rotation.y = -5 / 360 * 2 * Math.PI;
	canD.rotation.x = Math.PI / 2;
	canD.rotation.z = -20 / 360 * 2 * Math.PI;
	canD.rotation.y = -5 / 360 * 2 * Math.PI;
}

var canbadgeLoader = function(canTexture) {
	var loader = new THREE.JSONLoader();
	loader.load(
	// resource URL
	'model/Badge_02_up.json',
	// Function when resource is loaded
	function(object, materials) {
		var texloader = new THREE.TextureLoader();
//		var imagepath = "img/S__4210708.jpg";
		var tex = texloader.load(canTexture);
		var material = new THREE.MeshPhongMaterial({
			color : 0xaaaaaa,
			ambient : 0xffffff,
			specular : 0xffffff,
			shininess : 100,
			metal : false,
			map : tex
		});
		json = new THREE.Mesh(object, material);

		json.scale.x = 1;
		json.scale.y = 1;
		json.scale.z = 1;
//		json.rotation.x = Math.PI / 2;
//		json.rotation.z = -20 / 360 * 2 * Math.PI;
//		json.rotation.y = -3 / 360 * 2 * Math.PI;
		canB.add(json);
	});
}

var canbadge3D = function(canTexture) {

}