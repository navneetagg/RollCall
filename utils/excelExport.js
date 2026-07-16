const ExcelJS = require('exceljs');

module.exports = async function generateExcel(batch, attendanceRecords) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Attendance');


  const headerRow = ['Roll No', 'Student Name'];
  const dateColumns = attendanceRecords.map(record => record.date.toISOString().split('T')[0]);
  headerRow.push(...dateColumns);
  worksheet.addRow(headerRow);


  worksheet.getRow(1).font = { bold: true };

 
  batch.students.sort((a, b) => a.rollNo - b.rollNo).forEach(student => {
    const row = [student.rollNo, student.name];
    dateColumns.forEach((dateStr, index) => {
      const record = attendanceRecords[index];
      const isPresent = record.presentRollNos.includes(student.rollNo);
      row.push(isPresent ? 'P' : 'A');
    });
    worksheet.addRow(row);
  });

  
  worksheet.columns.forEach(column => {
    column.width = 15;
  });

  return workbook.xlsx.writeBuffer();
};