(function(){
	let camera, scene, canvas, controls, renderer,mouseX=0, mouseY=0;
	let windowHalfX = window.innerWidth / 2;
	let windowHalfY = window.innerHeight / 2;
	let camera_pos_tween,camera_rot_tween;
	let raycaster = new THREE.Raycaster(); 
	let mousePos = new THREE.Vector2(); 
	let INTERSECTED;
	let shots_raycaster;
	function eventFire(el, etype){
	  if (el.fireEvent) {
	    el.fireEvent('on' + etype);
	  } else {
	    var evObj = document.createEvent('Events');
	    evObj.initEvent(etype, true, false);
	    el.dispatchEvent(evObj);
	  }
}
	function init(){
		canvas = document.getElementById("canvas");
		scene = window.scene;
		scene.fog = new THREE.FogExp2( 0xffffff, 0.0001 );
		camera = new THREE.PerspectiveCamera( 30, window.innerWidth/(window.innerHeight), 1, 8000 );
		window.camera = camera;
		renderer = window.renderer;
		renderer.setClearColor(0x000000,1)
		renderer.setSize( window.innerWidth, window.innerHeight );
		//document.body.appendChild( renderer.domElement );

		document.addEventListener( 'click', onDocumentMouseClick, false );
		document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		window.addEventListener( 'resize', onWindowResize, false );
		document.addEventListener( 'touchstart', onDocumentTouchStart, false );
		document.addEventListener( 'touchmove', onDocumentTouchMove, false );
		
		function onDocumentTouchStart( event ) {

				if ( event.touches.length === 1 ) {

					event.preventDefault();

					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					mouseY = event.touches[ 0 ].pageY - windowHalfY;

				}

		}

		function onDocumentTouchMove( event ) {

			if ( event.touches.length === 1 ) {

				event.preventDefault();

				mouseX = event.touches[ 0 ].pageX - windowHalfX;
				mouseY = event.touches[ 0 ].pageY - windowHalfY;

			}

		}

		function onWindowResize() {

				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );
						}

		function onDocumentMouseMove( event ) {
				//event.preventDefault();
				mouseX = event.pageX
				mouseY = event.pageY
				mousePos.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mousePos.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
			}

		function onDocumentMouseClick( event ) {
			 event.preventDefault();	

		}
		
		document.onkeydown = checkKey;

		function checkKey(e) {

		    e = e || window.event;

		    if (e.keyCode == '38') {
		        // up arrow
		        camera.position.z += 6
		        //scene.position.z -=2
		        //trackballControls.target(new THREE.Vector3(camera.position.x,0,camera.position.z))
		    }
		    else if (e.keyCode == '40') {
		        // down arrow
		        camera.position.z += -6
		        //scene.position.z +=2

		    }
		    else if (e.keyCode == '37') {
		       // left arrow
		       camera.position.x += -8
		    }
		    else if (e.keyCode == '39') {
		       // right arrow
		       camera.position.x += 8
		    }

		}
		
		camera.position.y = 650
		camera.position.z = 10
		

		let axisHelper = new THREE.AxisHelper( 2000 );
		//scene.add( axisHelper );
		let gridHelper = new THREE.GridHelper( 1000, 100 );
		//scene.add( gridHelper ); 

	}
	
	
	function createVector(x, y, z, camera, width, height) {
        var p = new THREE.Vector3(x, y, z);
        var vector = p.project(camera);

        vector.x = (vector.x + 1) / 2 * width;
        vector.y = -(vector.y - 1) / 2 * height;

        return vector;
    }

	function render(){
		requestAnimationFrame( render );
		TWEEN.update()
		controls.update()
		raycaster.setFromCamera( mousePos, camera );
		
		//Month label
		for (var i=1;i<=12;i++){
			var div = document.getElementById('month_label_'+i)
			var pos = createVector(-320+48*i,0,-20,camera, window.innerWidth, window.innerHeight);
			div.style.left = pos.x + 'px';
			div.style.top = pos.y + 'px';
		}
		
		//Day of Week label 
		['Sun','Thu','Mon'].map(function(d, i){
			var div = document.getElementById('week_label_'+d)
			var pos = createVector(-320,0, i*33, camera, window.innerWidth, window.innerHeight);
			div.style.left = pos.x + 'px';
			div.style.top = pos.y + 'px';
		})
		
		var intersects = raycaster.intersectObjects(scene.children, true);
			if (intersects.length>0){
				if (INTERSECTED != intersects[0].object){
					if ( INTERSECTED ) {
						INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
						document.getElementById("tooltip").style.display = 'none'
					}
					INTERSECTED = intersects[ 0 ].object;
					if (INTERSECTED.userdata){
						INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
						INTERSECTED.material.color.setHex( 0xa6dba0 );

						if ($('#DC_charts').css('display') === 'none'){
							document.getElementById("tooltip").style.display = 'block'
						}else{
							document.getElementById("tooltip").style.display = 'none'
						}
					
						document.getElementById("tooltip").style.left = mouseX + 10 + 'px'
						document.getElementById("tooltip").style.top = mouseY + 'px'
						$('#tooltip-date').text('Date: '+ INTERSECTED.userdata.date)
						$('#tooltip-daily_load').text('Daily load: '+ Math.abs(INTERSECTED.userdata.height).toFixed(2))
						$('#tooltip-CDD').text('CDD: '+ INTERSECTED.userdata.CDD)
						$('#tooltip-HDD').text('HDD: '+ INTERSECTED.userdata.HDD)
					}
				}
			}else {
				if ( INTERSECTED ) {
					INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
					document.getElementById("tooltip").style.display = 'none'
				}
				INTERSECTED = null;
			}
		
		

		
		
		renderer.render(scene, camera);

	}
	

	init();
	//IMPORTANT!
	controls = new THREE.TrackballControls(camera, renderer.domElement);
	controls.rotateSpeed = 3;
	controls.minDistance = 100;
	controls.maxDistance = 650;
	controls.noZoom = false;
	render();


	document.getElementById("year_select").onchange = function(){
	  var val = document.getElementById("year_select").value

	  function yearChanged(val) {
						  return {
						    type: 'YEAR_CHANGED',
						    val
						  }
						}
	  window.store.dispatch(yearChanged(val)) 
	}

	document.getElementById("utility_select").onchange = function(){
	  var val = document.getElementById("utility_select").value

	  function utilityChanged(val) {
						  return {
						    type: 'UTILITY_CHANGED',
						    val
						  }
						}
	  window.store.dispatch(utilityChanged(val)) 
	}
	  
	

})();