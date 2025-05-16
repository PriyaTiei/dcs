
import React, { useState } from 'react';
import axios from 'axios';
import './CrankStyle.css'; 
import moment from "moment";
// import { Search } from "bootstrap-icons-react";


//use state 
const CrankInfo = ({crankinfo}) => {

  
  // console.log("***")
  // console.log(crankinfo);
  // console.log("****")

  

//   return (
//       <div className="crank-info-container">
//         <h2>Crank Information</h2>
       

//       {crankinfo && (
//         <div className="info-table-container">
//           <table className="info-table">
//             <thead>
//               <tr>
//                 <th>Engine Number</th>
//                 <th>Crank Housing Number</th>
//                 <th>Crank Housing Casting Number</th>
//                 <th>Date Created</th>
//                 <th>Time Created</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td>{crankinfo.engineNo}</td>
//                 <td>{crankinfo.crankHousingNum}</td>
//                 <td>{crankinfo.crankHousingCastingNum}</td>
//                 <td>{new Date(crankinfo.createdAt).toLocaleDateString()}</td>
//                 <td>{new Date(crankinfo.createdAt).toLocaleTimeString()}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };


// export default CrankInfo;
return (
  <div className="crank-info-container">
    <h5>Crank Case Stiffner</h5>

    {crankinfo && (
      <table className="info-table">
        <tbody>
          {/* <tr>
            <td className="info-label">Engine Number:</td>
            <td className="info-value">{crankinfo.engineNo}</td>
          </tr> */}
          <tr>
            <td className="info-label">Crank Housing Number:</td>
            <td className="info-value">{crankinfo.crankHousingNum}</td>
          </tr>
          <tr>
            <td className="info-label">Crank Housing Casting Number:</td>
            <td className="info-value">{crankinfo.crankHousingCastingNum}</td>
          </tr>
              <td className="info-label">Date and Time Assembled:</td>
              <td className="info-value">
                {moment(crankinfo.createdAt).format('YYYY-MM-DDTHH:mm:ssZ')}
              </td>
        </tbody>
      </table>
    )}
  </div>
);
};

export default CrankInfo;



