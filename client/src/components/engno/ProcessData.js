import React from 'react'

function ProcessData({processNo}) {
  const processNoElements = processNo.map(item=><div className="p-2 border ">{item.label}</div>)
  console.log(processNo, "process No")
  return (
    <div>
    <div className="h5">Process data </div>
    <div className="d-flex flex-wrap gap-1 prosMach ">
      {processNoElements}    
    
    </div>
  </div>
  )
}

export default ProcessData