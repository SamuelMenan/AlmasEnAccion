export function downloadIcs({ title, startISO, durationMinutes, location, description }: { title: string; startISO: string; durationMinutes: number; location?: string; description?: string }) {
  const dt = new Date(startISO);
  const pad = (n: number) => String(n).padStart(2, '0');
  const toUtc = (d: Date) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
  const dtStart = toUtc(dt);
  const dtEnd = toUtc(new Date(dt.getTime() + durationMinutes * 60 * 1000));
  const uid = `${Date.now()}@almasenaccion`;
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AlmasEnAcción//ES',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStart}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeText(title)}`,
    location ? `LOCATION:${escapeText(location)}` : '',
    description ? `DESCRIPTION:${escapeText(description)}` : '',
    'END:VEVENT',
    'END:VCALENDAR'
  ].filter(Boolean).join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/\s+/g,'_')}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeText(s: string) {
  return s.replace(/([,;])/g, '\\$1').replace(/\n/g, '\\n');
}
