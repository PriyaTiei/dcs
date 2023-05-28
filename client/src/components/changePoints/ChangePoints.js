import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { changePointsDocsPerPage, changePointsPagination, getChangePoints, getChangePointsPagination } from "../../redux/slices/changepoints/changePointActions"
import ChangePointEntryForm from './ChangePointEntryForm'
import Headings from "./Headings"
import Rows from './Rows'
import { Pagination, Select } from 'semantic-ui-react'

function ChangePoints() {

  const [refresh, setRefresh] = useState(true)
  const [filtered, setfiltered] = useState({
    startDate: "",
    endDate: "",
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

  const dispatch = useDispatch()

  console.log(filtered);

  // useEffect(() => {
  //   dispatch(getChangePointsPagination())
  // }, [])

  const changePointsState = useSelector(state => state.changePoints)
  const { changePoints, changePointPagination } = changePointsState

  useEffect(() => {
    dispatch(changePointsPagination(1))
  }, [refresh, filtered])

  useEffect(() => {
    dispatch(getChangePoints(filtered, changePointPagination.currentPage, changePointPagination.docsPerPage))
  }, [refresh, filtered, changePointPagination.currentPage, changePointPagination.docsPerPage])

  const changeDocsPerPage = (val) => {
    dispatch(changePointsDocsPerPage(val))
  }

  const data = changePoints.length == 0 ? null : changePoints.map(element => {
    return (
      <div key={element._id}>
        <Rows element={element} />
      </div>
    )
  })

  return (
    <div >

      <h1>Change Point Monitoring Sheet</h1>
      <ChangePointEntryForm setRefresh={setRefresh} />
      <hr />
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 10
      }}>
        <button type="submit" className="btn btn-primary" onClick={() => {
          setfiltered({
            startDate: "",
            endDate: "",
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
        <Select value={changePointPagination.docsPerPage} onChange={(e, { value }) => changeDocsPerPage(value)} options={[
          { key: '2 docs/page', value: 2, text: '2 docs/page' },
          { key: '10 docs/page', value: 10, text: '10 docs/page' },
          { key: '100 docs/page', value: 100, text: '100 docs/page' },
          { key: '200 docs/page', value: 200, text: '200 docs/page' },
        ]} />
      <Pagination onPageChange={(e, a) => dispatch(changePointsPagination(a.activePage))} activePage={changePointPagination.currentPage} defaultActivePage={changePointPagination.currentPage} totalPages={changePointPagination.totalPages} />

      </div>

      <Headings filtered={filtered} setfiltered={setfiltered} />
      {data}

    </div>

  )
}

export default ChangePoints