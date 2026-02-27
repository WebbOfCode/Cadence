import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

interface SupportResource {
  name: string;
  type: 'VA Vet Center' | 'VA Medical Center' | 'VA Benefits Office' | 'VSO' | 'Community';
  url: string;
  description?: string;
}

function getStateByZip(zip: string): string | null {
  try {
    const csvPath = path.join(process.cwd(), 'data', 'zip_state.csv');
    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.split(/\r?\n/);
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const [z, st] = line.split(',');
      if (z === zip) return st || null;
    }
  } catch (e) {
    console.error('Failed to read zip_state.csv', e);
  }
  return null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const zip = (searchParams.get('zip') || '').replace(/[^0-9]/g, '').slice(0, 5);

  if (!/^\d{5}$/.test(zip)) {
    return NextResponse.json({ error: 'Invalid ZIP' }, { status: 400 });
  }

  const state = getStateByZip(zip);

  const resources: SupportResource[] = [
    {
      name: 'VA Vet Centers (Readjustment Counseling)',
      type: 'VA Vet Center',
      url: `https://www.va.gov/find-locations/?address=${zip}&facilityType=vet_center`,
      description: 'Confidential counseling, outreach, and referral services for combat veterans and families.'
    },
    {
      name: 'VA Medical Centers & Clinics',
      type: 'VA Medical Center',
      url: `https://www.va.gov/find-locations/?address=${zip}&facilityType=health`,
      description: 'Primary and specialty care, mental health, and community-based outpatient clinics.'
    },
    {
      name: 'VA Regional Benefits Offices',
      type: 'VA Benefits Office',
      url: `https://www.va.gov/find-locations/?address=${zip}&facilityType=benefits`,
      description: 'File claims, manage benefits, and get assistance with compensation and education.'
    },
    {
      name: 'DAV – Disabled American Veterans (Find Local Office)',
      type: 'VSO',
      url: 'https://www.dav.org/find-your-local-office/',
      description: 'Accredited veterans service officers help file and manage VA claims.'
    },
    {
      name: 'VFW – Veterans of Foreign Wars (Find a Post)',
      type: 'Community',
      url: 'https://www.vfw.org/Find-a-Post',
      description: 'Local posts offer camaraderie, advocacy, and community service.'
    },
    {
      name: 'American Legion – Post Locator',
      type: 'Community',
      url: 'https://www.legion.org/posts',
      description: 'Nationwide network of posts supporting veterans and families.'
    },
    {
      name: 'Vet Center – Crisis & Chat',
      type: 'Community',
      url: 'https://www.veteranscrisisline.net/',
      description: '24/7, confidential crisis support for veterans and their loved ones.'
    }
  ];

  return NextResponse.json({ resources, state });
}
