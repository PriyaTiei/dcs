import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AppLayout from './components/layout/AppLayout.jsx';
import EngineTraceabilityScreen from './screens/EngineTraceabilityScreen.jsx';
import SupplierTraceabilityScreen from './screens/SupplierTraceabilityScreen.jsx';
import DefectFormScreen from './screens/DefectFormScreen.jsx';
import DefectReportsScreen from './screens/DefectReportsScreen.jsx';
import ChangePointsScreen from './screens/ChangePointsScreen.jsx';
import ReworkGalleryScreen from './screens/ReworkGalleryScreen.jsx';
import ToolConfigScreen from './screens/ToolConfigScreen.jsx';

import './styles/global.css';

export function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <AppLayout>
        <Routes>
          {/* 1. Engine Full Traceability (Flagship) */}
          <Route path="/" element={<EngineTraceabilityScreen />} />

          {/* 2. Supplier & Machining Deep Traceability */}
          <Route path="/supplierPartDeatils" element={<SupplierTraceabilityScreen />} />

          {/* 3. Assembly Offline Treatment Defect Entry Form */}
          <Route path="/add-form" element={<DefectFormScreen />} />

          {/* 4. Defect Reports & Quality Records */}
          <Route path="/traceability" element={<DefectReportsScreen />} />

          {/* 5. 4M Change Point Monitoring Sheet */}
          <Route path="/changePoints" element={<ChangePointsScreen />} />

          {/* 6. Visual Rework & Inspection Photo Gallery */}
          <Route path="/searchReworkImages" element={<ReworkGalleryScreen />} />

          {/* 7. Station Tool Map Configuration Manager */}
          <Route path="/edit-tool-details" element={<ToolConfigScreen />} />

          {/* Fallback to Engine Traceability */}
          <Route path="*" element={<EngineTraceabilityScreen />} />
        </Routes>
      </AppLayout>
    </>
  );
}

export default App;
