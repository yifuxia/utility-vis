(function(){
	window.scene = new THREE.Scene();
	window.interactiveScene = new THREE.Scene();
	var canvas = document.getElementById('canvas')
	window.renderer = new THREE.WebGLRenderer({canvas: canvas, alpha:true})
})()