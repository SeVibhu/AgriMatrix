// utils/fetchExcel.ts
import * as XLSX from 'xlsx';

export async function fetchExcel(url: string): Promise<any[][]> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const contentType = response.headers.get('Content-Type');
    if (!contentType?.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
      const text = await response.text();
      console.warn('Unexpected content:', text.slice(0, 300));
      throw new Error('Invalid file type. Expected an Excel file.');
    }

    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    return jsonData;
  } catch (error) {
    console.error('Error fetching Excel file:', error);
    throw error;
  }
}