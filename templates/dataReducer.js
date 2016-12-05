export default function(state = {}, action){
  switch (action.type){
    case 'LOAD_DATA':
      return action.data;
    default:
      return state;
  }
}
