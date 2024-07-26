
import React, { useState } from 'react';
import axios from 'axios';
import './CrankStyle.css'; 
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
    <h2>Crank Information</h2>

    {crankinfo && (
      <table className="info-table">
        <tbody>
          <tr>
            <td className="info-label">Engine Number:</td>
            <td className="info-value">{crankinfo.engineNo}</td>
          </tr>
          <tr>
            <td className="info-label">Crank Housing Number:</td>
            <td className="info-value">{crankinfo.crankHousingNum}</td>
          </tr>
          <tr>
            <td className="info-label">Crank Housing Casting Number:</td>
            <td className="info-value">{crankinfo.crankHousingCastingNum}</td>
          </tr>
          <tr>
            <td className="info-label">Date Created:</td>
            <td className="info-value">{new Date(crankinfo.createdAt).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td className="info-label">Time Created:</td>
            <td className="info-value">{new Date(crankinfo.createdAt).toLocaleTimeString()}</td>
          </tr>
        </tbody>
      </table>
    )}
  </div>
);
};

export default CrankInfo;



