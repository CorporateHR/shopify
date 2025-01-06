import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: NextRequest) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const range = 'Sheet1';

    const { values } = await request.json();

    // First, get the current number of rows
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const currentRows = response.data.values?.length || 0;
    const startRow = currentRows + 1; // Start from the next row

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${range}!A${startRow}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in Google Sheets API:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
