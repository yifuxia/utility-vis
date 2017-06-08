import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import React from 'react';
import HeatMap from '../components/HeatMap';

class App extends React.Component {
	render(){
		d3.csv('./public/data/vis-data.csv', function(data){
			data.forEach(function (d) {
	        d.CDD = +d.CDD
	        d.HDD = +d.HDD
	        d.CDD_month_mean = +d.CDD_month_mean
	        d.HDD_month_mean = +d.HDD_month_mean
	        d.daily_load = +d.daily_load
	        d.week_of_year = +d.week_of_year
	        d.day_of_week = +d.day_of_week
	        d.month = +d.month
	      });
			window.data = data

		});
		return (
			<div id="app" >
				<HeatMap />	
			</div>
		)
	}
}
export default App