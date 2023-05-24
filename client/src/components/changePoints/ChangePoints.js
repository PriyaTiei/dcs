import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { getChangePoints } from "../../redux/slices/changepoints/changePointActions"
import ChangePointEntryForm from './ChangePointEntryForm'
import Headings from "./Headings"
import Rows from './Rows'

function ChangePoints() {

  const [refresh, setRefresh] = useState(true)
  const [filtered, setfiltered] = useState({
    entryDate: "",
    mmmm: "",
    station: "",
    point: "",
    reason: "",
    action: "",
    traceability: "",
    result: "",
    nextAction: "",
    responsibility: "",
    counteraction: ""
  })

  const [filteredData, setFilteredData] = useState([])

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getChangePoints())
  }, [refresh])

  const changePointsState = useSelector(state => state.changePoints)
  const { changePoints } = changePointsState

  useEffect(() => {
    setFilteredData(changePoints)
    for (var key in filtered.keys()) {
      console.log(key);
      var value = filtered[key];
      if (value) {
        if(key=="entryDate"){
          setFilteredData(changePoints.filter(data => {
            // return data[key].split(" ").slice(0, 4).join(" ") == value.split(" ").slice(0, 4).join(" ")
          }))
        }else{
          setFilteredData(changePoints.filter(data => {
            return data[key].toLowerCase().includes(value)
          }))
        }
      }
    }
  }, [filtered,changePoints])

  const data = filteredData.length == 0 ? null : filteredData.map(element => {
    return (
      <div key={element._id}>
        <Rows element={element} />
      </div>
    )
  })

  return (
    <div >

      <h1>Change Point Monitoring Sheet</h1>
      <ChangePointEntryForm setRefresh={setRefresh} refresh={refresh} />
      <hr />
      <button type="submit" className="btn btn-primary mt-2" onClick={()=>{
        setfiltered({
          entryDate: "",
          mmmm: "",
          station: "",
          point: "",
          reason: "",
          action: "",
          traceability: "",
          result: "",
          nextAction: "",
          responsibility: "",
          counteraction: ""
        })
      }}>
        Reset Filters
      </button>
      <Headings filtered={filtered} setfiltered={setfiltered} />
      {data}

    </div>

  )
}

export default ChangePoints