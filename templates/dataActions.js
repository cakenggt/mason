export function loadData(newData){
  return function(dispatch, getState){
    dispatch('LOAD_DATA', newData);
  };
}
