import { prisma } from '../lib/prisma';

async function main() {
  const appts = await prisma.appointment.findMany({
    include: {
      patient: { select: { fullName: true } },
      doctor: { include: { user: { select: { fullName: true } } } },
      specialty: { select: { name: true } },
    },
  });
  console.log('--- ALL APPOINTMENTS IN DB ---');
  console.log('Total Count:', appts.length);
  appts.forEach((a) => {
    console.log(
      `- ID: ${a.id.slice(0, 8)} | Date: ${a.appointmentDate} | Time: ${a.appointmentTime} | Status: ${a.status} | Patient: ${a.patient.fullName} | Doctor: ${a.doctor?.user?.fullName || 'None'} | Specialty: ${a.specialty.name}`
    );
  });

  const todayVN = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

  const todayUTC = new Date().toISOString().split('T')[0];
  console.log('\n--- DATE CHECK ---');
  console.log('todayVN (Asia/Ho_Chi_Minh):', todayVN);
  console.log('todayUTC (toISOString):', todayUTC);

  // Group appointments by date
  const dateCounts: Record<string, number> = {};
  appts.forEach((a) => {
    dateCounts[a.appointmentDate] = (dateCounts[a.appointmentDate] || 0) + 1;
  });
  console.log('\n--- APPOINTMENTS BY DATE ---');
  console.log(dateCounts);

  // Group appointments by status
  const statusCounts: Record<string, number> = {};
  appts.forEach((a) => {
    statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
  });
  console.log('\n--- APPOINTMENTS BY STATUS ---');
  console.log(statusCounts);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
