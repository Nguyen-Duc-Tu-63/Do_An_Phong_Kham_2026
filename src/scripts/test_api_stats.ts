import { GET } from '../app/api/admin/stats/route';

async function test() {
  const res = await GET();
  const data = await res.json();
  console.log('=== API STATS RESPONSE ===');
  console.log('todayStr:', data.todayStr);
  console.log('KPIS:', JSON.stringify(data.kpis, null, 2));
  console.log('weeklyTrend:', JSON.stringify(data.weeklyTrend, null, 2));
  console.log('statusDistribution:', JSON.stringify(data.statusDistribution, null, 2));
  console.log('topDoctors:', JSON.stringify(data.topDoctors, null, 2));
}

test().catch(console.error);
