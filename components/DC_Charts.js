import React from 'react';
import { connect } from 'react-redux';

class DC_Charts extends React.Component {
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
    let season_colors = d3.scale.ordinal()
      .domain(['Winter', 'Spring', 'Summer', 'Fall'])
      .range(['#a6cee3','#33a02c','#fb8072','#bebada'])

    if (this.state.loading){
      console.log("loading...");
    }else{
    let data = crossfilter(window.data)
    let all = data.groupAll();

    let temp_chart = dc.barChart('#temp_chart');
    let load_chart = dc.barChart('#load_chart');
    let year_chart = dc.rowChart('#year_chart');
    let month_chart = dc.rowChart('#month_chart');
    let week_chart = dc.rowChart('#week_chart');
    let season_chart = dc.pieChart('#season_chart');
    
    let temp = data.dimension(d => d.CDD == 0 ? Math.floor(65 - d.HDD) : Math.floor(65 + d.CDD));
    let temp_group = temp.group();

    let load = data.dimension(d => Math.floor(d.daily_load));
    let load_group = load.group();

    let year = data.dimension(d => d.year);
    let year_group = year.group().reduceSum(d => d.daily_load);

    let month = data.dimension(d => d.month);
    let month_group = month.group().reduceSum(d => d.daily_load);

    let season = data.dimension(function(d){
      if (d.month >=3 && d.month <=5){
        return 'Spring'
      }else if(d.month >=6 && d.month <=8){
        return 'Summer'
      }else if(d.month >=9 && d.month <=11){
        return 'Fall'
      }else{
        return 'Winter'
      }
    });

    let season_group = season.group().reduceSum(d => d.daily_load);

    let week = data.dimension(d => d.day_of_week);
    let week_group = week.group().reduceSum(d => d.daily_load);

    temp_chart
      .width(800)
      .height(150)
      .margins({top: 10, right: 50, bottom: 30, left: 40})
      .dimension(temp)
      .group(temp_group)
      .elasticY(true)
      .centerBar(true)
      .barPadding(.3)
      .round(dc.round.floor)
      .alwaysUseRounding(true)
      .colors(['pink','skyblue','lightgreen'])
      .colorDomain([0,1,2])
      .colorAccessor(function (d) {
            if (d.key > 65) {
              return 0
            }else if (d.key == 65){
              return 2
            }else{
              return 1
            }
        })
      .x(d3.scale.linear().domain([0, 100]))
      .renderHorizontalGridLines(true)
      temp_chart.yAxis().ticks(5);
      temp_chart.xUnits(function(){return 120;});

      load_chart
      .width(800)
      .height(150)
      .margins({top: 10, right: 50, bottom: 30, left: 40})
      .dimension(load)
      .group(load_group)
      .elasticY(true)
      .centerBar(true)
      .barPadding(.3)
      .round(dc.round.floor)
      .alwaysUseRounding(true)
      .x(d3.scale.linear().domain([8, 55]))
      .renderHorizontalGridLines(true)
      temp_chart.yAxis().ticks(5);
      temp_chart.xUnits(function(){return 120;});
      
      
      year_chart
      .width(250)
      .height(200)
      .margins({top: 0, left: 10, right: 10, bottom: 30})
      .group(year_group)
      .dimension(year)
      .ordinalColors(['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f'])
      .label(function (d) {
          return d.key;
      })
      .title(function (d) {
          return d.value;
      })
      .elasticX(true)
      .xAxis().ticks(4);

      month_chart
      .width(250)
      .height(200)
      .margins({top: 0, left: 10, right: 10, bottom: 30})
      .group(month_group)
      .dimension(month)
      .ordinalColors(['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928'])
      .label(function (d) {
          return d.key;
      })
      .title(function (d) {
          return d.value;
      })
      .elasticX(true)
      .xAxis().ticks(4);

      season_chart
      .width(300)
      .height(200)
      .radius(80)
      .innerRadius(30)
      .dimension(season)
      .group(season_group)
      .colors(season_colors);

      let weekmap = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      week_chart
      .width(250)
      .height(200)
      .margins({top: 0, left: 10, right: 10, bottom: 30})
      .group(week_group)
      .dimension(week)
      .ordinalColors(['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f'])
      .label(function (d) {
          return weekmap[d.key];
      })
      .title(function (d) {
          return d.value;
      })
      .elasticX(true)
      .xAxis().ticks(4);
      


      dc.renderAll();
    }
    return (
            <div> 
            </div> 
              
    );
  }
}

function mapStateToProps(state) {
  return {
  }
}

export default connect(
  mapStateToProps
)(DC_Charts)
