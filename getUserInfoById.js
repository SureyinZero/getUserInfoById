function getUserInfo([...ids], setTimeoutId) {
  return new Promise((resolve) => {
    setTimeout(()=>{
      resolve(ids.map(id => {
        return {id, setTimeoutId};
      }));
    },10);
  })
}

getUserInfoById = (function(){
  let setTimeoutId = null, ids = [], promises = [];
  
  return (id) => {
    return new Promise((resolve, reject) => {

      // id不能为空
      if(id) {

        // 记录当前已聚合的查询ID和对应的Promise用于数据获取完成修改Promise状态
        ids.push(id);
        promises.push({resolve, reject});
        if(!setTimeoutId) {

          // 10ms内只会创建一个setTimeout，并在setTimeout内完成数据接口的调用
          setTimeoutId = setTimeout(()=>{
            console.log("聚合的ID");
            console.log(ids);

            // 记录本次调用的ID集合和Promise集合，并清空外层对应变量的值，以防影响到下一片段的数据记录
            let pros = [...promises], idsT = [...ids], sti = setTimeoutId;
            ids = [];
            promises = [];
            setTimeoutId = null;
            getUserInfo(idsT, sti).then(([...infos]) => {

              // 拿到数据后对应修改Promise的状态（这里认为getUserInfo返回的数据集顺序和参数ID集保持一致）
              infos.forEach((item, index) => {
                pros[index].resolve(item);
              });
            })
          }, 10);
        }
      } else {
        reject({code: -1, errmsg: 'id不能为空'});
      }
    });
  }
})();

// 测试用例
getUserInfoById(1).then(info => {
  console.log(info);
});
getUserInfoById(2).then(info => {
  console.log(info);
});
setTimeout(()=>{
  getUserInfoById(3).then(info => {
    console.log(info);
  });
},5);
setTimeout(()=>{
  getUserInfoById().then(info => {
    console.log(info);
  }, (rej) => {
    console.log(rej);
  });
},9);

setTimeout(()=>{
  getUserInfoById(4).then(info => {
    console.log(info);
  });
},10);
setTimeout(()=>{
  getUserInfoById(4).then(info => {
    console.log(info);
  });
},18);

setTimeout(()=>{
  getUserInfoById(4).then(info => {
    console.log(info);
  });
},1000);