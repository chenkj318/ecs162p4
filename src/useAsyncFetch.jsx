import React, {useEffect} from 'react';

const useAsyncFetch = function(thenFun,catchFun){
  console.log("in useAsyncFetch");
  const [m, setM] = useState({year: 2022, month: 5})
  async function fetchData(){
    let start, end;
    start = moment(`${m.year}-${m.month}-01`).startOf('month').toDate().getTime();
    end = moment(`${m.year}-${m.month}-01`).endOf('month').toDate().getTime();
    let response=await fetch(`/api/waters/${start}/${end}`);
    let json=await response.json();
    console.log(json);
    thenFun(json);
  }
  useEffect(function(){
    console.log("calling fetch");
    fetchData();
  }, [m]);

}
export default useAsyncFetch;