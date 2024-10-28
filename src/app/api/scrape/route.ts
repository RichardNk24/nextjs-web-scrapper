import axios from 'axios';
import * as cheerio from 'cheerio';
import { createObjectCsvWriter } from 'csv-writer';
import { NextResponse } from 'next/server';
import path from 'path';

interface Ranking {
  name: string;
  riderNumber: string;
  teamName: string;
  timeHour: number;
  timeMinutes: number;
  timeSeconds: number;
}

export async function GET() {
  try {
    const { data } = await axios.get('https://www.lavuelta.es/en/rankings/stage-4');
    const $ = cheerio.load(data);

    const rankings: Ranking[] = [];
    
    $('table tbody tr').each((index, element) => {
        const name = $(element).find('a.rankingTables__row__profile--name').text().trim();
        const riderNumber = $(element).find('.hidden').text();
        const teamName = $(element).find('td.break-line.team a').text().trim();
        const timeText = $(element).find('.time').text();

      const [timeHour, timeMinutes, timeSeconds] = timeText.match(/\d+/g)?.map(Number) || [0, 0, 0];

      rankings.push({
        name,
        riderNumber,
        teamName,
        timeHour,
        timeMinutes,
        timeSeconds,
      });
    });

    // Write data to CSV
    const csvWriter = createObjectCsvWriter({
      path: path.join(process.cwd(), 'public', 'rankings.csv'),
      header: [
        { id: 'name', title: 'Name' },
        { id: 'riderNumber', title: 'Rider Number' },
        { id: 'teamName', title: 'Team Name' },
        { id: 'timeHour', title: 'Time Hour' },
        { id: 'timeMinutes', title: 'Time Minutes' },
        { id: 'timeSeconds', title: 'Time Seconds' },
      ],
    });

    await csvWriter.writeRecords(rankings);

    return NextResponse.json({ message: 'CSV created successfully', url: '/rankings.csv' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred during scraping' }, { status: 500 });
  }
}