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
      self.setState({loading: false}); }, 1000);
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
    let load_avg_chart = dc.rowChart('#load_avg_chart');
    let year_chart = dc.rowChart('#year_chart');
    let month_chart = dc.rowChart('#month_chart');
    let week_chart = dc.rowChart('#week_chart');
    let season_chart = dc.pieChart('#season_chart');
    let location_chart = dc.bubbleChart('#location_chart');
    let dataCount = dc.dataCount('.dc-data-count');
    let dataTable = dc.dataTable('.dc-data-table');
    
    let temp = data.dimension(d => d.CDD == 0 ? Math.floor(65 - d.HDD) : Math.floor(65 + d.CDD));
    let temp_group = temp.group();

    let load = data.dimension(d => d.daily_load.toFixed(1));
    let load_group = load.group();

    let load_avg = data.dimension(d => 'average daily load');
    let load_avg_group = load_avg.group().reduce(
      function(p, v){
        ++p.count
        p.total += v.daily_load
        return p
      },
      function(p, v){
        --p.count
        p.total -= v.daily_load
        return p
      },
      function(){
        return {count:0, total:0}
      }
    );

    let location = data.dimension(function(d){
      if (d.NAME == 'ATLANTIC CITY ELECTRIC'){
        return "ACE"
      }
      return d.NAME
    });
    let location_group = location.group().reduce(
      function(p, v){
        ++p.count
        p.total += v.daily_load
        return p
      },
      function(p, v){
        --p.count
        p.total -= v.daily_load
        return p
      },
      function(){
        return {count:0, total:0}
      }
    );
;

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
      .height(100)
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
      .height(100)
      .margins({top: 10, right: 50, bottom: 30, left: 40})
      .dimension(load)
      .group(load_group)
      .elasticY(true)
      .centerBar(true)
      .turnOnControls(true)
      .barPadding(.3)
      .round(dc.round.floor)
      //.alwaysUseRounding(true)
      .x(d3.scale.linear().domain([8, 55]))
      .renderHorizontalGridLines(true)
      load_chart.yAxis().ticks(5);
      load_chart.xUnits(function(){return 400;});

      load_avg_chart
      .width(800)
      .height(50)
      .margins({top: 0, left: 40, right: 40, bottom: 30})
      .group(load_avg_group)
      .dimension(load_avg)
      //.x(d3.scale.linear().domain([0, 55]))
      .valueAccessor(p => p.value.count > 0 ? (p.value.total / p.value.count) : 0)
      //.ordinalColors(['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f'])
      .label(function (d) {
          return d.key;
      })
      .title(p => p.value.count > 0 ? (p.value.total / p.value.count) : 0)
      .xAxis().ticks(10);

      load_avg_chart.x(d3.scale.linear().range([0,(load_avg_chart.width()-50 - 40)]).domain([0,55]));
      load_avg_chart.xAxis().scale(load_avg_chart.x());
      
      
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

      let monthmap = ['nan','Jan.', 'Feb.','Mar.', 'Apr.', 'May', 'June', 'July', 'Aug.','Sep',
        'Oct.','Nov.','Dec.']
      month_chart
      .width(250)
      .height(300)
      .margins({top: 0, left: 10, right: 10, bottom: 30})
      .group(month_group)
      .dimension(month)
      .ordinalColors(['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928'])
      .label(function (d) {
          return monthmap[d.key];
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

      location_chart
      .width(800)
      .height(250)
      .transitionDuration(1500)
      .margins({ top: 10, right: 50, bottom: 30, left: 60 })
      .dimension(location)
      .group(location_group)
      .colors(['#66c2a5','#fc8d62','#8da0cb'])
      .colorDomain([0,1,2])
      .colorAccessor(function (d) {
            if (d.key == 'PSE&G'){
              return 0
            }else if (d.key == 'PECO ENERGY'){
              return 1
            }else{
              return 2
            }
        })
      .keyAccessor(function (p) {
            return p.value.count;
        })
      .valueAccessor(function (p) {
            return p.value.total / p.value.count;
        })
      .radiusValueAccessor(function (p) {
            return 5;
      })
      .maxBubbleRelativeSize(0.1)
      .xAxisLabel('#days')
      .yAxisLabel('average daily load')
      .x(d3.scale.linear())
      .y(d3.scale.linear())
      .elasticX(true)
      .elasticY(true)
      .r(d3.scale.linear().domain([0, 55]))
      .xAxisPadding(10)
      .yAxisPadding(5)
      .renderHorizontalGridLines(true)
      .renderVerticalGridLines(true)
      .renderTitle(true)
      .title(function (p) {
            return [
                '#days: ' + p.value.count,
                'average daily load: ' + (p.value.total / p.value.count).toFixed(2)
            ].join('\n');
        })

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
      
      dataCount
      .dimension(data)
      .group(all)
      .html({
            some: '<strong>%filter-count</strong> selected out of <strong>%total-count</strong> records' +
                ' | <a href=\'javascript:dc.filterAll(); dc.renderAll();\'>Reset All</a>',
            all: 'All records selected. Please click on the graph to apply filters.'
        });

      dataTable 
        .dimension(year)
        .group(function(d){
          return (d.year + '-' +d.month + '-' + d.day);
        })
        .columns([
          {
              label: "Date",
              format: function (d) { return d.year + '-' +d.month + '-' + d.day; }
          },
          {
              label: "Temperature",
              format: d => d.CDD == 0 ? (65 - d.HDD).toFixed(1) : (65 + d.CDD).toFixed(1)
          },
          {
              label: "Daily load",
              format: function (d) { return d.daily_load; }
          },
          {
              label: "Utility",
              format: function (d) { return d.NAME; }
          }
      ]).sortBy(function (d) {
            return d.daily_load;
        })
      .order(d3.ascending)

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
