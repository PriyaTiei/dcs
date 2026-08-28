import React, { useState } from 'react';
import { TbFileSpreadsheet } from 'react-icons/tb';

export const ExportButton = ({ engineNo, oracleData, processNoALCData }) => {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);

      // Lazy load ExcelJS only when user clicks Export
      const ExcelJS = (await import('exceljs')).default;
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Toyota TIEI DCS Traceability';
      workbook.created = new Date();

      const worksheet = workbook.addWorksheet(`Engine_${engineNo || 'Report'}`);

      // Title header
      worksheet.mergeCells('A1:G1');
      worksheet.getCell('A1').value = `ENGINE TRACEABILITY DOSSIER: ${engineNo || 'N/A'}`;
      worksheet.getCell('A1').font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
      worksheet.getCell('A1').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1D4ED8' },
      };
      worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
      worksheet.getRow(1).height = 36;

      // Section 1: Assembly Timeline
      worksheet.getCell('A3').value = '1. ASSEMBLY & LINE EVENTS';
      worksheet.getCell('A3').font = { bold: true, size: 12, color: { argb: 'FF1E40AF' } };

      const assemblyRows =
        oracleData?.data?.map((item) => [item[17] || '-', item[21] || '-']) || [];

      if (assemblyRows.length > 0) {
        worksheet.addTable({
          name: 'AssemblyProgression',
          ref: 'A4',
          headerRow: true,
          columns: [{ name: 'Station / Event' }, { name: 'Date & Time' }],
          rows: assemblyRows,
        });
      }

      // Generate blob & trigger download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Engine_Traceability_${engineNo || 'Dossier'}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating Excel export:', err);
      alert('Failed to generate Excel export file.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      className="dcs-btn dcs-btn-secondary"
      onClick={handleExport}
      disabled={exporting || !engineNo}
    >
      <TbFileSpreadsheet size={18} color="var(--primary-600)" />
      {exporting ? 'Generating Excel...' : 'Export Dossier (.xlsx)'}
    </button>
  );
};

export default ExportButton;
