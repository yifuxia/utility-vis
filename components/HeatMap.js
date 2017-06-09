import React from 'react';
import { connect } from 'react-redux';
var color_scale;
var GRID_SIZE = 10;
var DAY_GAP = 1;
var MONTH_GAP = 2;
var HEATMAP_OFF_SET = -29 * GRID_SIZE
function calc_position(week_of_year, day_of_week, month, height){
  let x
  let z = GRID_SIZE/2 + (6 - day_of_week)*(GRID_SIZE+DAY_GAP)
  if (week_of_year >= 52 && month === 1){
    x = -GRID_SIZE/2 - DAY_GAP  + HEATMAP_OFF_SET
  }else{
    if (week_of_year ==1 && month ==12) {
      x = GRID_SIZE/2 + 52*(GRID_SIZE+DAY_GAP) + (month - 1)*MONTH_GAP + HEATMAP_OFF_SET
    }else{
      x = GRID_SIZE/2 + (week_of_year - 1)*(GRID_SIZE+DAY_GAP) + (month - 1)*MONTH_GAP + HEATMAP_OFF_SET
    }
  }
  
  return [x, 0, z]
}

function createVector(x, y, z, camera, width, height) {
        var p = new THREE.Vector3(x, y, z);
        var vector = p.project(camera);

        vector.x = (vector.x + 1) / 2 * width;
        vector.y = -(vector.y - 1) / 2 * height;

        return vector;
    }
class HeatMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }
  componentDidMount() {
    var self = this;
    setTimeout(() => {
      self.setState({loading: false}); }, 2000);
  }
  render() {
    const {year, name} = this.props
    $('#show_daily_load').text('SHOW daily load')
    $('#month_avg').text('SHOW monthly average Degree Day')
    for (var i=window.scene.children.length-1;i>=0;i--){
        if (window.scene.children[i].name.substr(0,5) === 'grid-'){
          var obj = window.scene.children[i]
          window.scene.remove(obj)
        }
      }

    let data=[];
    if (this.state.loading){
      console.log("loading...");
    }else{
      window.data.forEach(function(d){
        if (d.year == year && d.NAME == name){
            data.push(d)
        }
      })
    

   color_scale = d3.scaleLinear().domain([-1*d3.max(data.map(d => d.CDD)), 0, d3.max(data.map(d => d.HDD))])
      .range(['red','#f7f7f7','blue']);
    
    setTimeout(function(){
      for (let i in data){
        let d = data[i]
        let dd = d.CDD === 0? d.HDD: -1*d.CDD;
        let height = dd > 0? d.daily_load : -1 * d.daily_load
        let geometry = new THREE.BoxGeometry( GRID_SIZE, 1, GRID_SIZE);
        let name = 'grid-'+d.week_of_year+'-'+d.day_of_week+'-'+d.month
        var material = new THREE.MeshBasicMaterial( {color: color_scale(dd)} );
        var cube = new THREE.Mesh( geometry, material );
        cube.position.set(...calc_position(d.week_of_year, d.day_of_week, d.month, height))
        cube.name = name
        cube.userdata = {
          date: d.year +'-' + d.month +'-'+ d.day,
          height: height,
          CDD: d.CDD,
          HDD: d.HDD,
          dd: dd,
          original_color:color_scale(dd),
          cdd_month_avg: color_scale(-1*d.CDD_month_mean),
          hdd_month_avg: color_scale(d.HDD_month_mean)
        }
        window.scene.add( cube );
      }
    },0)
    
  }

    return (
            <div> 
              {
                [1,2,3,4,5,6,7,8,9,10,11,12].map(el =>
                    <p id={'month_label_'+el} key={el} style={{position:'absolute',color:'lightgreen',padding:0,margin:'0 0'}}>{el}</p>
                  )
                   
              }   
               {
                ['Mon','Thu','Sun'].map(el =>
                    <p id={'week_label_'+el} key={el} style={{position:'absolute',color:'lightgreen',padding:0,margin:'0 0'}}>{el}</p>
                  )
                   
              }         
              <div id="tooltip" style={{background:'rgba(0,0,0,.8)',color:'white',position:'absolute'}}>
                <p id="tooltip-date"></p>
                <p id="tooltip-daily_load"></p>
                <p id="tooltip-CDD"></p>
                <p id="tooltip-HDD"></p>
              </div> 
            </div> 
              
    );
  }
}

function mapStateToProps(state) {
  return {
    year : state.year,
    name: state.utility
  }
}

export default connect(
  mapStateToProps
)(HeatMap)
