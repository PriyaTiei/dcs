// import React,{useState} from 'react'
// import Select from "react-select"

// function SubOptions({sectionData, indexI, s2}) {
//   const mappedValues = s2?.map((item) => {
    
//     return { value: item.value, label: item.value };
//   });

//   const [subSectionOptions2, setSubSectionOptions2,] = useState([
//     s2,
//   ]);
//   console.log(s2, "sub --2")
//   console.log(subSectionOptions2, "sub --2")
//   console.log(mappedValues , "Mapped 2")
//   const [subSection, setSubSection] = useState("Shipment");
//   const [indexJ, setIndexJ]= useState(0);
//   return (
//     <>
//       <Select
//                 options={mappedValues}
//                 defaultValue={mappedValues[0]}
//                 onChange={(e) => {setSubSection(e.value)
//                   const j = sectionData[indexI]["subSection"].findIndex(item=>item.name===e.value)
//                   setIndexJ(j)
//                   console.log(j)
//                 }}
//               />
//       </>
//   )
// }

// export default SubOptions



// import React, { useState } from 'react';
// import Select from 'react-select';

// const sectionData = 
//   [
//     {
//       section: "Assembly",
//       subSection: [
//         { name: "Dhipment", processNo: [1, 2,3,4,5,6,7,8,9,10,11] },
//         { name: "FTB", processNo: [11, 21] },
//         { name: "MTB", processNo: [1, 2] },
//         { name: "Oil/water leak", processNo: [1, 2] },
//         { name: "Fuel Leak", processNo: [1, 2] },
//         { name: "CHS", processNo: [1, 2] },
//         { name: "BS", processNo: [1, 2] },
//         { name: "PS", processNo: [1, 2] },
//         { name: "SPS", processNo: [1, 2] },
//         { name: "MK line", processNo: [1, 2] },
        
//       ],
//     },
//     {
//       section: "Machining",
//       subSection: [
//         { name: "Cylinder Block", processNo: ["M1", "M2"] },
//         { name: "Cylinder Head", processNo: ["M11", "M21"] },
//         { name: "Crank Shaft", processNo: ["M111", "M211"] },
//       ],
//     },
//     {
//       section: "Supplier part",
//       subSection: [
//         { name: "Shipment", processNo: ["S1", "S2"] },
//         { name: "Cylinder Head", processNo: [1, 2] },
//         { name: "Crank Shaft", processNo: [1, 2] },
//         { name: "Crank Case", processNo: [1, 2] },
//         { name: "Cam housing", processNo: [1, 2] },
//         { name: "Port Injector", processNo: [1, 2] },
//         { name: "Pully Crank Shaft", processNo: [1, 2] },
//       ],
//     },
//   ];



// function App() {
//   const [selectedSection, setSelectedSection] = useState(null);
//   const [selectedSubSection, setSelectedSubSection] = useState(null);

//   const handleSectionChange = (selected) => {
//     setSelectedSection(selected);
//     setSelectedSubSection(null); // Reset subSection selection
//   };

//   const handleSubSectionChange = (selected) => {
//     setSelectedSubSection(selected);
//   };

//   const getSubSections = () => {
//     if (selectedSection) {
//       const section = sectionData.find(item => item.section === selectedSection.value);
//       return section ? section.subSection.map(sub => ({ value: sub.name, label: sub.name })) : [];
//     }
//     return [];
//   };

//   return (
//     <div>
//       <Select
//         options={sectionData.map(item => ({ value: item.section, label: item.section }))}
//         value={selectedSection}
//         onChange={handleSectionChange}
//         placeholder="Select Section"
//       />

//       <Select
//         options={getSubSections()}
//         value={selectedSubSection}
//         onChange={handleSubSectionChange}
//         placeholder="Select SubSection"
//         isDisabled={!selectedSection}
//       />
//     </div>
//   );
// }

// export default App;

// ***********************************************

// import React, { useState } from 'react';
// import Select from 'react-select';

// const sectionData = [
//   // ... your sectionData here ...
//   {
//     section: "Assembly",
//     subSection: [
//       { name: "Dhipment", processNo: [1, 2,3,4,5,6,7,8,9,10,11] },
//       { name: "FTB", processNo: [11, 21] },
//       { name: "MTB", processNo: [1, 2] },
//       { name: "Oil/water leak", processNo: [1, 2] },
//       { name: "Fuel Leak", processNo: [1, 2] },
//       { name: "CHS", processNo: [1, 2] },
//       { name: "BS", processNo: [1, 2] },
//       { name: "PS", processNo: [1, 2] },
//       { name: "SPS", processNo: [1, 2] },
//       { name: "MK line", processNo: [1, 2] },
      
//     ],
//   },
//   {
//     section: "Machining",
//     subSection: [
//       { name: "Cylinder Block", processNo: ["M1", "M2"] },
//       { name: "Cylinder Head", processNo: ["M11", "M21"] },
//       { name: "Crank Shaft", processNo: ["M111", "M211"] },
//     ],
//   },
//   {
//     section: "Supplier part",
//     subSection: [
//       { name: "Shipment", processNo: ["S1", "S2"] },
//       { name: "Cylinder Head", processNo: [1, 2] },
//       { name: "Crank Shaft", processNo: [1, 2] },
//       { name: "Connecting rod", processNo: [1, 2] },
//       { name: "Crank Case", processNo: [1, 2] },
//       { name: "Cam housing", processNo: [1, 2] },
//       { name: "Port Injector", processNo: [1, 2] },
//       { name: "Pully Crank Shaft", processNo: [1, 2] },
//     ],
//   },
// ];

// function App() {
//   const defaultSection = sectionData[0].section; // Set the default section
//   const defaultSubSection = sectionData[0].subSection[0].name; // Set the default subSection

//   const [selectedSection, setSelectedSection] = useState(defaultSection);
//   const [selectedSubSection, setSelectedSubSection] = useState(defaultSubSection);

//   const handleSectionChange = (selected) => {
//     setSelectedSection(selected);
//     const section = sectionData.find(item => item.section === selected);
//     if (section) {
//       setSelectedSubSection(section.subSection[0].name);
//     }
//   };

//   const handleSubSectionChange = (selected) => {
//     setSelectedSubSection(selected);
//   };

//   const getSubSections = () => {
//     const section = sectionData.find(item => item.section === selectedSection);
//     return section ? section.subSection.map(sub => ({ value: sub.name, label: sub.name })) : [];
//   };

//   return (
//     <div>
//       <Select
//         options={sectionData.map(item => ({ value: item.section, label: item.section }))}
//         value={{ value: selectedSection, label: selectedSection }}
//         onChange={option => handleSectionChange(option.value)}
//         placeholder="Select Section"
//       />

//       <Select
//         options={getSubSections()}
//         value={{ value: selectedSubSection, label: selectedSubSection }}
//         onChange={option => handleSubSectionChange(option.value)}
//         placeholder="Select SubSection"
//         isDisabled={!selectedSection}
//       />
//     </div>
//   );
// }

// export default App;



// *********************************

import React, { useState } from 'react';
import Select from 'react-select';

const sectionData = [
  // ... your sectionData here ...
  {
    section: "Assembly",
    subSection: [
      { name: "Dhipment", processNo: [1, 2,3,4,5,6,7,8,9,10,11] },
      { name: "FTB", processNo: [11, 21] },
      { name: "MTB", processNo: [1, 2] },
      { name: "Oil/water leak", processNo: [1, 2] },
      { name: "Fuel Leak", processNo: [1, 2] },
      { name: "CHS", processNo: [1, 2] },
      { name: "BS", processNo: [1, 2] },
      { name: "PS", processNo: [1, 2] },
      { name: "SPS", processNo: [1, 2] },
      { name: "MK line", processNo: [1, 2] },
      
    ],
  },
  {
    section: "Machining",
    subSection: [
      { name: "Cylinder Block", processNo: ["M1", "M2"] },
      { name: "Cylinder Head", processNo: ["M11", "M21"] },
      { name: "Crank Shaft", processNo: ["M111", "M211"] },
    ],
  },
  {
    section: "Supplier part",
    subSection: [
      { name: "Shipment", processNo: ["S1", "S2"] },
      { name: "Cylinder Head", processNo: [1, 2] },
      { name: "Crank Shaft", processNo: [1, 2] },
      { name: "Connecting rod", processNo: [1, 2] },
      { name: "Crank Case", processNo: [1, 2] },
      { name: "Cam housing", processNo: [1, 2] },
      { name: "Port Injector", processNo: [1, 2] },
      { name: "Pully Crank Shaft", processNo: [1, 2] },
    ],
  },
];

function App() {
  const defaultSection = sectionData[0].section;
  const defaultSubSection = sectionData[0].subSection[0].name;

  const [selectedSection, setSelectedSection] = useState(defaultSection);
  const [selectedSubSection, setSelectedSubSection] = useState(defaultSubSection);

  const [indexI, setIndexI] = useState(0); // Initialize with 0
  const [indexJ, setIndexJ] = useState(0); // Initialize with 0

  const handleSectionChange = (selected, index) => {
    setSelectedSection(selected);
    setIndexI(index);
    const section = sectionData.find(item => item.section === selected);
    if (section) {
      setSelectedSubSection(section.subSection[0].name);
      setIndexJ(0);
    }
  };

  const handleSubSectionChange = (selected, index) => {
    setSelectedSubSection(selected);
    setIndexJ(index);
  };

  const getSubSections = () => {
    const section = sectionData.find(item => item.section === selectedSection);
    return section ? section.subSection.map((sub, index) => ({ value: sub.name, label: sub.name, index })) : [];
  };

  return (
    <div>
      <Select
        options={sectionData.map((item, index) => ({ value: item.section, label: item.section, index }))}
        value={{ value: selectedSection, label: selectedSection }}
        onChange={option => handleSectionChange(option.value, option.index)}
        placeholder="Select Section"
      />

      <Select
        options={getSubSections()}
        value={{ value: selectedSubSection, label: selectedSubSection }}
        onChange={option => handleSubSectionChange(option.value, option.index)}
        placeholder="Select SubSection"
        isDisabled={!selectedSection}
      />

      <p>Index of selected section: {indexI}</p>
      <p>Index of selected subSection: {indexJ}</p>
    </div>
  );
}

export default App;
