
export const LOAD_SAVE  = 'LOAD_SAVE';
export const ZXDIAGNOSE  = 'ZXDIAGNOSE';

export function loadSave(data){
  return{
    type: LOAD_SAVE,
    data: data
  }
}

export function zxDiagnose(data){
  return{
    type: ZXDIAGNOSE,
    data: data
  }
}
