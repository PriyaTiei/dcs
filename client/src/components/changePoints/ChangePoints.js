import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from "react-redux"
import {getChangePoints} from "../../redux/slices/changepoints/changePointActions"
import ChangePointEntryForm from './ChangePointEntryForm'
import Headings from "./Headings"
import Rows from './Rows'



function ChangePoints() {

  const [refresh, setRefresh] =useState(true)

  const dispatch = useDispatch()
  useEffect(()=>{
    dispatch(getChangePoints())  
  }, [refresh])


  const changePointsState= useSelector(state=>state.changePoints)
const {changePoints} = changePointsState
  const data = changePoints.length ==0 ? null: changePoints.map(element=>{
    return (
      <div key={element._id}>
        <Rows element={element} />
      </div>
    )
  
  })
  
  return (
    <div >
    
      <h1>Change Point Monitoring Sheet</h1>
      <ChangePointEntryForm setRefresh={setRefresh} refresh={refresh}/>
      <Headings />
      {data}
    
    </div>
    
  )
}

export default ChangePoints