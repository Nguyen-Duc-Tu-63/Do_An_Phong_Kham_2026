import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Bắt đầu tạo dữ liệu mẫu Tiếng Việt...');

  // Clean existing tables
  await prisma.prescription.deleteMany();
  await prisma.medicalRecord.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.doctorSchedule.deleteMany();
  await prisma.doctorInfo.deleteMany();
  await prisma.specialty.deleteMany();
  await prisma.user.deleteMany();

  const defaultPasswordHash = await bcrypt.hash('password123', 10);

  // 1. Quản lý & Lễ Tân
  const admin = await prisma.user.create({
    data: {
      fullName: 'BS. Trần Văn Hùng (Quản Lý Phụ Trách)',
      email: 'admin@clinic.com',
      phone: '0909000001',
      passwordHash: defaultPasswordHash,
      role: 'ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=250&q=80',
    },
  });

  const receptionist = await prisma.user.create({
    data: {
      fullName: 'Nguyễn Thị Mai (Trưởng Lễ Tân)',
      email: 'receptionist@clinic.com',
      phone: '0909000002',
      passwordHash: defaultPasswordHash,
      role: 'ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    },
  });

  // 2. Các Chuyên Khoa
  const cardio = await prisma.specialty.create({
    data: {
      name: 'Khoa Tim Mạch',
      description: 'Chăm sóc sức khỏe tim mạch toàn diện, chẩn đoán tầm soát bệnh lý tim và điều trị tăng huyết áp.',
      iconUrl: 'HeartPulse',
    },
  });

  const peds = await prisma.specialty.create({
    data: {
      name: 'Khoa Nhi',
      description: 'Khám và theo dõi phát triển toàn diện cho trẻ sơ sinh, trẻ nhỏ và trẻ vị thành niên.',
      iconUrl: 'Baby',
    },
  });

  const derma = await prisma.specialty.create({
    data: {
      name: 'Khoa Da Liễu',
      description: 'Khám điều trị chuyên sâu các bệnh lý về da, viêm da dị ứng, mụn trứng cá và phục hồi da.',
      iconUrl: 'Sparkles',
    },
  });

  const internal = await prisma.specialty.create({
    data: {
      name: 'Khoa Nội Tổng Quát',
      description: 'Khám sức khỏe tổng quát, tầm soát bệnh lý người lớn, đái tháo đường và tư vấn dinh dưỡng.',
      iconUrl: 'Stethoscope',
    },
  });

  const ent = await prisma.specialty.create({
    data: {
      name: 'Khoa Tai Mũi Họng',
      description: 'Khám điều trị viêm xoang, viêm họng, viêm amidan, ù tai, nghẹt mũi và các bệnh lý hô hấp trên.',
      iconUrl: 'Headphones',
    },
  });

  const eye = await prisma.specialty.create({
    data: {
      name: 'Khoa Mắt (Nhãn Khoa)',
      description: 'Đo khám thị lực, tật khúc xạ cận - viễn - loạn thị, điều trị viêm kết mạc và đục thủy tinh thể.',
      iconUrl: 'Eye',
    },
  });

  const dental = await prisma.specialty.create({
    data: {
      name: 'Khoa Răng Hàm Mặt',
      description: 'Khám nha khoa tổng quát, cạo vôi răng, điều trị sâu răng, nhổ răng khôn và thẩm mỹ nụ cười.',
      iconUrl: 'Smile',
    },
  });

  const ortho = await prisma.specialty.create({
    data: {
      name: 'Khoa Cơ Xương Khớp',
      description: 'Chẩn đoán điều trị thoái hóa khớp, thoát vị đĩa đệm cột sống, viêm khớp dạng thấp và gút.',
      iconUrl: 'Bone',
    },
  });

  const obgyn = await prisma.specialty.create({
    data: {
      name: 'Khoa Sản Phụ Khoa',
      description: 'Khám thai định kỳ, siêu âm sản khoa 4D, tầm soát ung thư cổ tử cung và bệnh phụ khoa.',
      iconUrl: 'HeartPulse',
    },
  });

  const gastro = await prisma.specialty.create({
    data: {
      name: 'Khoa Tiêu Hóa - Gan Mật',
      description: 'Nội soi tiêu hóa không đau, tầm soát ung thư dạ dày - đại tràng và điều trị bệnh gan mật.',
      iconUrl: 'Stethoscope',
    },
  });

  // 3. Đội Ngũ Bác Sĩ
  const doc1User = await prisma.user.create({
    data: {
      fullName: 'BS CKI. Lê Thị Thanh Hà',
      email: 'doctor1@clinic.com',
      phone: '0912345601',
      passwordHash: defaultPasswordHash,
      role: 'DOCTOR',
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=250&q=80',
    },
  });

  const doc1Info = await prisma.doctorInfo.create({
    data: {
      userId: doc1User.id,
      specialtyId: cardio.id,
      degree: 'Bác sĩ CKI. Tim Mạch Học',
      experienceYears: 14,
      bio: 'Bác sĩ giàu kinh nghiệm trong tầm soát tăng huyết áp, rối loạn nhịp tim và bệnh mạch vành.',
      consultationFee: 45.0,
    },
  });

  const doc2User = await prisma.user.create({
    data: {
      fullName: 'ThS BS. Nguyễn Minh Triết',
      email: 'doctor2@clinic.com',
      phone: '0912345602',
      passwordHash: defaultPasswordHash,
      role: 'DOCTOR',
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=250&q=80',
    },
  });

  const doc2Info = await prisma.doctorInfo.create({
    data: {
      userId: doc2User.id,
      specialtyId: peds.id,
      degree: 'Thạc sĩ Bác sĩ Nhi Khoa',
      experienceYears: 10,
      bio: 'Bác sĩ Nhi khoa tận tâm, nhẹ nhàng với trẻ em, tư vấn phát triển chiều cao và dinh dưỡng cho bé.',
      consultationFee: 35.0,
    },
  });

  const doc3User = await prisma.user.create({
    data: {
      fullName: 'BS. Trần Hoàng Yến',
      email: 'doctor3@clinic.com',
      phone: '0912345603',
      passwordHash: defaultPasswordHash,
      role: 'DOCTOR',
      avatarUrl: 'https://images.unsplash.com/photo-1594824813566-88855ce7890b?auto=format&fit=crop&w=250&q=80',
    },
  });

  const doc3Info = await prisma.doctorInfo.create({
    data: {
      userId: doc3User.id,
      specialtyId: derma.id,
      degree: 'Bác sĩ Chuyên Khoa Da Liễu',
      experienceYears: 8,
      bio: 'Chuyên gia điều trị viêm da cơ địa, dị ứng thời tiết, trị mụn và phục hồi da nhạy cảm.',
      consultationFee: 40.0,
    },
  });

  const doc4User = await prisma.user.create({
    data: {
      fullName: 'ThS BS. Phạm Quốc Bảo',
      email: 'doctor4@clinic.com',
      phone: '0912345604',
      passwordHash: defaultPasswordHash,
      role: 'DOCTOR',
      avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=250&q=80',
    },
  });

  const doc4Info = await prisma.doctorInfo.create({
    data: {
      userId: doc4User.id,
      specialtyId: internal.id,
      degree: 'Thạc sĩ Bác sĩ Nội Khoa',
      experienceYears: 12,
      bio: 'Tư vấn tầm soát sức khỏe tổng quát, điều trị bệnh lý dạ dày, đái tháo đường và rối loạn mỡ máu.',
      consultationFee: 30.0,
    },
  });

  const doc5User = await prisma.user.create({
    data: {
      fullName: 'BS CKII. Võ Minh Hoàng',
      email: 'doctor5@clinic.com',
      phone: '0912345605',
      passwordHash: defaultPasswordHash,
      role: 'DOCTOR',
      avatarUrl: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=250&q=80',
    },
  });

  const doc5Info = await prisma.doctorInfo.create({
    data: {
      userId: doc5User.id,
      specialtyId: ent.id,
      degree: 'Bác sĩ CKII. Tai Mũi Họng',
      experienceYears: 16,
      bio: 'Chuyên gia đầu ngành về điều trị viêm xoang mạn tính, polyp mũi xoang và phẫu thuật nội soi Tai Mũi Họng.',
      consultationFee: 40.0,
    },
  });

  const doc6User = await prisma.user.create({
    data: {
      fullName: 'ThS BS. Đặng Ngọc Anh',
      email: 'doctor6@clinic.com',
      phone: '0912345606',
      passwordHash: defaultPasswordHash,
      role: 'DOCTOR',
      avatarUrl: 'https://images.unsplash.com/photo-1594824813566-88855ce7890b?auto=format&fit=crop&w=250&q=80',
    },
  });

  const doc6Info = await prisma.doctorInfo.create({
    data: {
      userId: doc6User.id,
      specialtyId: eye.id,
      degree: 'Thạc sĩ Bác sĩ Nhãn Khoa',
      experienceYears: 11,
      bio: 'Bác sĩ chuyên sâu về tật khúc xạ học đường, kiểm soát cận thị tiến triển ở trẻ em và điều trị khô mắt.',
      consultationFee: 35.0,
    },
  });

  const doc7User = await prisma.user.create({
    data: {
      fullName: 'BS CKI. Bùi Tuấn Kiệt',
      email: 'doctor7@clinic.com',
      phone: '0912345607',
      passwordHash: defaultPasswordHash,
      role: 'DOCTOR',
      avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=250&q=80',
    },
  });

  const doc7Info = await prisma.doctorInfo.create({
    data: {
      userId: doc7User.id,
      specialtyId: dental.id,
      degree: 'Bác sĩ CKI. Răng Hàm Mặt & Chỉnh Nha',
      experienceYears: 9,
      bio: 'Bác sĩ nha khoa thẩm mỹ tận tâm, chuyên sâu về cấy ghép Implant, chỉnh nha niềng răng và phục hình nụ cười.',
      consultationFee: 30.0,
    },
  });

  const doc8User = await prisma.user.create({
    data: {
      fullName: 'TS BS. Hoàng Đức Thắng',
      email: 'doctor8@clinic.com',
      phone: '0912345608',
      passwordHash: defaultPasswordHash,
      role: 'DOCTOR',
      avatarUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=250&q=80',
    },
  });

  const doc8Info = await prisma.doctorInfo.create({
    data: {
      userId: doc8User.id,
      specialtyId: ortho.id,
      degree: 'Tiến sĩ Bác sĩ Cơ Xương Khớp',
      experienceYears: 18,
      bio: 'Bác sĩ giàu kinh nghiệm trong chẩn đoán thoái hóa khớp gối, loãng xương, tiêm huyết tương giàu tiểu cầu (PRP).',
      consultationFee: 50.0,
    },
  });

  const doc9User = await prisma.user.create({
    data: {
      fullName: 'BS CKI. Vũ Thùy Linh',
      email: 'doctor9@clinic.com',
      phone: '0912345609',
      passwordHash: defaultPasswordHash,
      role: 'DOCTOR',
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=250&q=80',
    },
  });

  const doc9Info = await prisma.doctorInfo.create({
    data: {
      userId: doc9User.id,
      specialtyId: obgyn.id,
      degree: 'Bác sĩ CKI. Sản Phụ Khoa',
      experienceYears: 12,
      bio: 'Bác sĩ phụ khoa nhẹ nhàng, thấu hiểu tâm lý phụ nữ, chuyên theo dõi thai kỳ nguy cơ cao và tư vấn tiền sản.',
      consultationFee: 45.0,
    },
  });

  const doc10User = await prisma.user.create({
    data: {
      fullName: 'ThS BS. Trương Gia Bảo',
      email: 'doctor10@clinic.com',
      phone: '0912345610',
      passwordHash: defaultPasswordHash,
      role: 'DOCTOR',
      avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=250&q=80',
    },
  });

  const doc10Info = await prisma.doctorInfo.create({
    data: {
      userId: doc10User.id,
      specialtyId: gastro.id,
      degree: 'Thạc sĩ Bác sĩ Tiêu Hóa & Nội Soi',
      experienceYears: 13,
      bio: 'Chuyên gia điều trị hội chứng ruột kích thích (IBS), trào ngược GERD, viêm gan siêu vi B/C và gan nhiễm mỡ.',
      consultationFee: 40.0,
    },
  });

  const doc11User = await prisma.user.create({
    data: {
      fullName: 'BS CKI. Phan Thị Kim Ngân',
      email: 'doctor11@clinic.com',
      phone: '0912345611',
      passwordHash: defaultPasswordHash,
      role: 'DOCTOR',
      avatarUrl: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=250&q=80',
    },
  });

  const doc11Info = await prisma.doctorInfo.create({
    data: {
      userId: doc11User.id,
      specialtyId: cardio.id,
      degree: 'Bác sĩ CKI. Tim Mạch & Can Thiệp',
      experienceYears: 11,
      bio: 'Tư vấn điều trị rối loạn mỡ máu, xơ vữa động mạch và theo dõi sức khỏe tim mạch người cao tuổi.',
      consultationFee: 40.0,
    },
  });

  const doc12User = await prisma.user.create({
    data: {
      fullName: 'ThS BS. Đoàn Nhật Huy',
      email: 'doctor12@clinic.com',
      phone: '0912345612',
      passwordHash: defaultPasswordHash,
      role: 'DOCTOR',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    },
  });

  const doc12Info = await prisma.doctorInfo.create({
    data: {
      userId: doc12User.id,
      specialtyId: peds.id,
      degree: 'Thạc sĩ Bác sĩ Nhi - Hô Hấp',
      experienceYears: 9,
      bio: 'Chuyên khám và điều trị viêm phế quản, hen suyễn trẻ em, tư vấn tiêm chủng và tăng cường miễn dịch cho bé.',
      consultationFee: 35.0,
    },
  });

  // 4. Khung Giờ Làm Việc Bác Sĩ (Tất cả các ngày trong tuần: Thứ 2 - Chủ Nhật)
  const doctorInfos = [
    doc1Info,
    doc2Info,
    doc3Info,
    doc4Info,
    doc5Info,
    doc6Info,
    doc7Info,
    doc8Info,
    doc9Info,
    doc10Info,
    doc11Info,
    doc12Info,
  ];
  for (const doc of doctorInfos) {
    for (let day = 0; day <= 6; day++) {
      await prisma.doctorSchedule.create({
        data: {
          doctorId: doc.id,
          dayOfWeek: day,
          startTime: '08:00',
          endTime: '17:00',
          slotDurationMinutes: 30,
        },
      });
    }
  }

  // 5. Bệnh Nhân Mẫu
  const patient1 = await prisma.user.create({
    data: {
      fullName: 'Nguyễn Văn An',
      email: 'patient1@clinic.com',
      phone: '0901234567',
      passwordHash: defaultPasswordHash,
      role: 'PATIENT',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    },
  });

  const patient2 = await prisma.user.create({
    data: {
      fullName: 'Trần Thị Bình',
      email: 'patient2@clinic.com',
      phone: '0918765432',
      passwordHash: defaultPasswordHash,
      role: 'PATIENT',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    },
  });

  const patient3 = await prisma.user.create({
    data: {
      fullName: 'Lê Văn Cường',
      email: 'patient3@clinic.com',
      phone: '0988112233',
      passwordHash: defaultPasswordHash,
      role: 'PATIENT',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    },
  });

  // Dates
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  // 6. Lịch Hẹn Mẫu
  // Lịch 1: Đã hoàn thành khám hôm nay với BS Thanh Hà
  const appt1 = await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      doctorId: doc1Info.id,
      specialtyId: cardio.id,
      appointmentDate: todayStr,
      appointmentTime: '09:00',
      status: 'COMPLETED',
      bookingType: 'SELF_SELECTED',
      patientNotes: 'Thỉnh thoảng thấy hơi nhói ngực sau khi đi bộ nhanh.',
    },
  });

  const medRecord1 = await prisma.medicalRecord.create({
    data: {
      appointmentId: appt1.id,
      patientId: patient1.id,
      doctorId: doc1Info.id,
      symptoms: 'Thỉnh thoảng nhói ngực nhẹ, huyết áp đo tại chỗ 138/88 mmHg.',
      diagnosis: 'Tăng huyết áp nguyên phát độ 1 kèm căng thẳng lao động.',
      notes: 'Giảm ăn mặn, tập thể dục nhẹ nhàng 30 phút mỗi ngày, tái khám sau 4 tuần.',
    },
  });

  await prisma.prescription.createMany({
    data: [
      {
        medicalRecordId: medRecord1.id,
        medicineName: 'Amlodipine 5mg',
        dosage: '5mg',
        frequency: 'Uống 1 viên mỗi ngày sau ăn sáng',
        duration: '30 ngày',
        notes: 'Uống đều đặn cùng 1 thời điểm trong ngày.',
      },
      {
        medicalRecordId: medRecord1.id,
        medicineName: 'Coenzym Q10 100mg',
        dosage: '100mg',
        frequency: 'Uống 1 viên/ngày trong bữa ăn',
        duration: '30 ngày',
        notes: 'Bổ sung sức khỏe cơ tim.',
      },
    ],
  });

  // Lịch 2: Đã xác nhận hôm nay với ThS BS Nguyễn Minh Triết
  await prisma.appointment.create({
    data: {
      patientId: patient2.id,
      doctorId: doc2Info.id,
      specialtyId: peds.id,
      appointmentDate: todayStr,
      appointmentTime: '10:30',
      status: 'CONFIRMED',
      bookingType: 'SELF_SELECTED',
      patientNotes: 'Khám sức khỏe tổng quát và tư vấn dinh dưỡng cho bé.',
    },
  });

  // Lịch 3: Đặt tự động cho ngày mai
  const appt3 = await prisma.appointment.create({
    data: {
      patientId: patient3.id,
      doctorId: null,
      specialtyId: derma.id,
      appointmentDate: tomorrowStr,
      appointmentTime: '14:00',
      status: 'PENDING',
      bookingType: 'AUTO_ASSIGN',
      patientNotes: 'Nổi mẩn đỏ ngứa ở vùng tay trái.',
    },
  });

  // Lịch 4: Đột xuất báo bận cần đổi bác sĩ
  const appt4 = await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      doctorId: doc4Info.id,
      specialtyId: internal.id,
      appointmentDate: todayStr,
      appointmentTime: '15:00',
      status: 'NEEDS_REASSIGNMENT',
      bookingType: 'SELF_SELECTED',
      patientNotes: 'Khám sức khỏe tổng quát định kỳ.',
    },
  });

  // 7. Thông Báo Admin
  await prisma.notification.create({
    data: {
      userId: admin.id,
      appointmentId: appt4.id,
      message: 'THÔNG BÁO KHẨN: Bác sĩ Phạm Quốc Bảo đột xuất bận ca khám lúc 15:00 hôm nay. Cần phân bác sĩ khác gấp!',
      type: 'URGENT_DOCTOR_BUSY',
      isRead: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: admin.id,
      appointmentId: appt3.id,
      message: 'Có yêu cầu đặt khám tự động mới cho Khoa Da Liễu ngày mai lúc 14:00.',
      type: 'NEW_BOOKING',
      isRead: true,
    },
  });

  console.log('✅ Đã tạo xong dữ liệu mẫu Tiếng Việt thành công!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
