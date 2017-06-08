import { combineReducers } from 'redux'


const year = (state=2010, action) => {
	switch (action.type) {
    case 'YEAR_CHANGED':
     	return action.val
    default:
      return state
  }
}

const utility = (state='PSE&G', action) => {
	switch (action.type) {
    case 'UTILITY_CHANGED':
     	return action.val
    default:
      return state
  }
}

export default combineReducers({
  year,
  utility
})