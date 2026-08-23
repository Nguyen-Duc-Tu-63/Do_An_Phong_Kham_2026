import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Bắt đầu thêm chuyên khoa và bác sĩ mới...');

  const defaultPasswordHash = await bcrypt.hash('password123', 10);

  // 1. Thêm các Chuyên Khoa mới nếu chưa có
  const specialtiesData = [
    {
      name: 'Khoa Tim Mạch',
      description: 'Chăm sóc sức khỏe tim mạch toàn diện, chẩn đoán tầm soát bệnh lý tim và điều trị tăng huyết áp.',
      iconUrl: 'HeartPulse',
    },
    {
      name: 'Khoa Nhi',
      description: 'Khám và theo dõi phát triển toàn diện cho trẻ sơ sinh, trẻ nhỏ và trẻ vị thành niên.',
      iconUrl: 'Baby',
    },
    {
      name: 'Khoa Da Liễu',
      description: 'Khám điều trị chuyên sâu các bệnh lý về da, viêm da dị ứng, mụn trứng cá và phục hồi da.',
      iconUrl: 'Sparkles',
    },
    {
      name: 'Khoa Nội Tổng Quát',
      description: 'Khám sức khỏe tổng quát, tầm soát bệnh lý người lớn, đái tháo đường và tư vấn dinh dưỡng.',
      iconUrl: 'Stethoscope',
    },
    {
      name: 'Khoa Tai Mũi Họng',
      description: 'Khám điều trị viêm xoang, viêm họng, viêm amidan, ù tai, nghẹt mũi và các bệnh lý hô hấp trên.',
      iconUrl: 'Headphones',
    },
    {
      name: 'Khoa Mắt (Nhãn Khoa)',
      description: 'Đo khám thị lực, tật khúc xạ cận - viễn - loạn thị, điều trị viêm kết mạc và đục thủy tinh thể.',
      iconUrl: 'Eye',
    },
    {
      name: 'Khoa Răng Hàm Mặt',
      description: 'Khám nha khoa tổng quát, cạo vôi răng, điều trị sâu răng, nhổ răng khôn và thẩm mỹ nụ cười.',
      iconUrl: 'Smile',
    },
    {
      name: 'Khoa Cơ Xương Khớp',
      description: 'Chẩn đoán điều trị thoái hóa khớp, thoát vị đĩa đệm cột sống, viêm khớp dạng thấp và gút.',
      iconUrl: 'Bone',
    },
    {
      name: 'Khoa Sản Phụ Khoa',
      description: 'Khám thai định kỳ, siêu âm sản khoa 4D, tầm soát ung thư cổ tử cung và bệnh phụ khoa.',
      iconUrl: 'HeartPulse',
    },
    {
      name: 'Khoa Tiêu Hóa - Gan Mật',
      description: 'Nội soi tiêu hóa không đau, tầm soát ung thư dạ dày - đại tràng và điều trị bệnh gan mật.',
      iconUrl: 'Stethoscope',
    },
  ];

  const specialtyMap = new Map<string, string>();

  for (const s of specialtiesData) {
    let spec = await prisma.specialty.findFirst({ where: { name: s.name } });
    if (!spec) {
      spec = await prisma.specialty.create({
        data: {
          name: s.name,
          description: s.description,
          iconUrl: s.iconUrl,
        },
      });
      console.log(`+ Đã thêm chuyên khoa mới: ${s.name}`);
    } else {
      console.log(`= Đã tồn tại chuyên khoa: ${s.name}`);
    }
    specialtyMap.set(s.name, spec.id);
  }

  // 2. Thêm các Bác sĩ mới nếu chưa có
  const doctorsData = [
    {
      fullName: 'BS CKII. Võ Minh Hoàng',
      email: 'doctor5@clinic.com',
      phone: '0912345605',
      specialtyName: 'Khoa Tai Mũi Họng',
      degree: 'Bác sĩ CKII. Tai Mũi Họng',
      experienceYears: 16,
      bio: 'Chuyên gia đầu ngành về điều trị viêm xoang mạn tính, polyp mũi xoang và phẫu thuật nội soi Tai Mũi Họng.',
      consultationFee: 40.0,
      avatarUrl: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=250&q=80',
    },
    {
      fullName: 'ThS BS. Đặng Ngọc Anh',
      email: 'doctor6@clinic.com',
      phone: '0912345606',
      specialtyName: 'Khoa Mắt (Nhãn Khoa)',
      degree: 'Thạc sĩ Bác sĩ Nhãn Khoa',
      experienceYears: 11,
      bio: 'Bác sĩ chuyên sâu về tật khúc xạ học đường, kiểm soát cận thị tiến triển ở trẻ em và điều trị khô mắt.',
      consultationFee: 35.0,
      avatarUrl: 'https://images.unsplash.com/photo-1594824813566-88855ce7890b?auto=format&fit=crop&w=250&q=80',
    },
    {
      fullName: 'BS CKI. Bùi Tuấn Kiệt',
      email: 'doctor7@clinic.com',
      phone: '0912345607',
      specialtyName: 'Khoa Răng Hàm Mặt',
      degree: 'Bác sĩ CKI. Răng Hàm Mặt & Chỉnh Nha',
      experienceYears: 9,
      bio: 'Bác sĩ nha khoa thẩm mỹ tận tâm, chuyên sâu về cấy ghép Implant, chỉnh nha niềng răng và phục hình nụ cười.',
      consultationFee: 30.0,
      avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=250&q=80',
    },
    {
      fullName: 'TS BS. Hoàng Đức Thắng',
      email: 'doctor8@clinic.com',
      phone: '0912345608',
      specialtyName: 'Khoa Cơ Xương Khớp',
      degree: 'Tiến sĩ Bác sĩ Cơ Xương Khớp',
      experienceYears: 18,
      bio: 'Bác sĩ giàu kinh nghiệm trong chẩn đoán thoái hóa khớp gối, loãng xương, tiêm huyết tương giàu tiểu cầu (PRP).',
      consultationFee: 50.0,
      avatarUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=250&q=80',
    },
    {
      fullName: 'BS CKI. Vũ Thùy Linh',
      email: 'doctor9@clinic.com',
      phone: '0912345609',
      specialtyName: 'Khoa Sản Phụ Khoa',
      degree: 'Bác sĩ CKI. Sản Phụ Khoa',
      experienceYears: 12,
      bio: 'Bác sĩ phụ khoa nhẹ nhàng, thấu hiểu tâm lý phụ nữ, chuyên theo dõi thai kỳ nguy cơ cao và tư vấn tiền sản.',
      consultationFee: 45.0,
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=250&q=80',
    },
    {
      fullName: 'ThS BS. Trương Gia Bảo',
      email: 'doctor10@clinic.com',
      phone: '0912345610',
      specialtyName: 'Khoa Tiêu Hóa - Gan Mật',
      degree: 'Thạc sĩ Bác sĩ Tiêu Hóa & Nội Soi',
      experienceYears: 13,
      bio: 'Chuyên gia điều trị hội chứng ruột kích thích (IBS), trào ngược GERD, viêm gan siêu vi B/C và gan nhiễm mỡ.',
      consultationFee: 40.0,
      avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=250&q=80',
    },
    {
      fullName: 'BS CKI. Phan Thị Kim Ngân',
      email: 'doctor11@clinic.com',
      phone: '0912345611',
      specialtyName: 'Khoa Tim Mạch',
      degree: 'Bác sĩ CKI. Tim Mạch & Can Thiệp',
      experienceYears: 11,
      bio: 'Tư vấn điều trị rối loạn mỡ máu, xơ vữa động mạch và theo dõi sức khỏe tim mạch người cao tuổi.',
      consultationFee: 40.0,
      avatarUrl: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=250&q=80',
    },
    {
      fullName: 'ThS BS. Đoàn Nhật Huy',
      email: 'doctor12@clinic.com',
      phone: '0912345612',
      specialtyName: 'Khoa Nhi',
      degree: 'Thạc sĩ Bác sĩ Nhi - Hô Hấp',
      experienceYears: 9,
      bio: 'Chuyên khám và điều trị viêm phế quản, hen suyễn trẻ em, tư vấn tiêm chủng và tăng cường miễn dịch cho bé.',
      consultationFee: 35.0,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    },
  ];

  for (const doc of doctorsData) {
    const specialtyId = specialtyMap.get(doc.specialtyName);
    if (!specialtyId) {
      console.warn(`! Không tìm thấy ID cho chuyên khoa: ${doc.specialtyName}`);
      continue;
    }

    let user = await prisma.user.findFirst({ where: { email: doc.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          fullName: doc.fullName,
          email: doc.email,
          phone: doc.phone,
          passwordHash: defaultPasswordHash,
          role: 'DOCTOR',
          avatarUrl: doc.avatarUrl,
        },
      });

      const docInfo = await prisma.doctorInfo.create({
        data: {
          userId: user.id,
          specialtyId,
          degree: doc.degree,
          experienceYears: doc.experienceYears,
          bio: doc.bio,
          consultationFee: doc.consultationFee,
        },
      });

      // Tạo lịch làm việc cho tất cả các ngày trong tuần (Thứ 2 - Chủ Nhật)
      for (let day = 0; day <= 6; day++) {
        await prisma.doctorSchedule.create({
          data: {
            doctorId: docInfo.id,
            dayOfWeek: day,
            startTime: '08:00',
            endTime: '17:00',
            slotDurationMinutes: 30,
          },
        });
      }

      console.log(`+ Đã thêm bác sĩ mới: ${doc.fullName} (${doc.specialtyName})`);
    } else {
      console.log(`= Đã tồn tại bác sĩ với email: ${doc.email}`);
    }
  }

  // Đảm bảo tất cả các bác sĩ hiện tại đều có lịch từ Chủ Nhật đến Thứ Bảy
  const allDocInfos = await prisma.doctorInfo.findMany();
  for (const docInfo of allDocInfos) {
    for (let day = 0; day <= 6; day++) {
      const exists = await prisma.doctorSchedule.findFirst({
        where: { doctorId: docInfo.id, dayOfWeek: day },
      });
      if (!exists) {
        await prisma.doctorSchedule.create({
          data: {
            doctorId: docInfo.id,
            dayOfWeek: day,
            startTime: '08:00',
            endTime: '17:00',
            slotDurationMinutes: 30,
          },
        });
      }
    }
  }

  console.log('✅ Hoàn tất thêm chuyên khoa và bác sĩ mới thành công!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi thêm dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
