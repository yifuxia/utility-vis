(function(){
	//Mount click events to elements using jquery
	$('#show_daily_load').on('click', function(){
		if ($(this).text() == 'SHOW daily load'){
			$(this).text('HIDE daily load')
			for (var i=window.scene.children.length-1;i>=0;i--){
		        if (window.scene.children[i].name.substr(0,5) === 'grid-'){
		          var cube = window.scene.children[i]
		          var height = cube.userdata.height;
		          var grid_position_animation = new TWEEN.Tween(cube.position).to({
	                              y: height*3
	                },1200).easing(TWEEN.Easing.Quadratic.In).start()
		          var grid_scale_animation = new TWEEN.Tween(cube.scale).to({
	                              y: height*6
	                },1200).easing(TWEEN.Easing.Quadratic.In).start()
		        }
		      }
		}else {
			$(this).text('SHOW daily load');
			for (var i=window.scene.children.length-1;i>=0;i--){
		        if (window.scene.children[i].name.substr(0,5) === 'grid-'){
		          var cube = window.scene.children[i]
		          var height = cube.userdata;
		          var grid_position_animation = new TWEEN.Tween(cube.position).to({
	                              y: 0
	                },1200).easing(TWEEN.Easing.Quadratic.In).start()
		          var grid_scale_animation = new TWEEN.Tween(cube.scale).to({
	                              y: 1
	                },1200).easing(TWEEN.Easing.Quadratic.In).start()
		        }
		      }
		}
	})

	$('#month_avg').on('click', function(){
		if ($(this).text() == 'SHOW monthly average Degree Day'){
			$(this).text('HIDE monthly average Degree Day')
			for (var i=window.scene.children.length-1;i>=0;i--){
		        if (window.scene.children[i].name.substr(0,5) === 'grid-'){
		          var cube = window.scene.children[i]
		          var cdd_mean = cube.userdata.cdd_month_avg;
		          var hdd_mean = cube.userdata.hdd_month_avg;
		          if (cube.userdata.dd < 0){
		          	cube.material.color.setHex(new THREE.Color(cdd_mean).getHex())
		          }else{
		          	cube.material.color.setHex(new THREE.Color(hdd_mean).getHex())
		          }
		          
		      }
		    }
		}else {
			$(this).text('SHOW monthly average Degree Day');
			for (var i=window.scene.children.length-1;i>=0;i--){
		        if (window.scene.children[i].name.substr(0,5) === 'grid-'){
		          var cube = window.scene.children[i]
		          cube.material.color.setHex(new THREE.Color(cube.userdata.original_color).getHex())
		        }
		      }
		}
	})
})()
/*
var grid_position_animation = new TWEEN.Tween(cube.position).to({
	                              y: grid[i][j].count[1]*4
	                },1200).easing(TWEEN.Easing.Quadratic.In).start()
	                */