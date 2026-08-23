import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Bắt đầu tạo dữ liệu mẫu Tiếng Việt chuẩn 10 Chuyên Khoa (mỗi khoa 3 Bác Sĩ)...');

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

  // 2. Các Chuyên Khoa (10 Chuyên Khoa Toàn Diện)
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

  // 3. Danh Sách 30 Bác Sĩ Chuyên Khoa (3 Bác Sĩ Mỗi Khoa)
  const doctorsData = [
    // --- KHOA TIM MẠCH (3 Bác Sĩ) ---
    {
      fullName: 'BS CKI. Lê Thị Thanh Hà',
      email: 'doctor1@clinic.com',
      phone: '0912345601',
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=250&q=80',
      specialtyId: cardio.id,
      degree: 'Bác sĩ CKI. Tim Mạch Học',
      experienceYears: 14,
      bio: 'Bác sĩ giàu kinh nghiệm trong tầm soát tăng huyết áp, rối loạn nhịp tim và bệnh mạch vành.',
      consultationFee: 45.0,
    },
    {
      fullName: 'BS CKI. Phan Thị Kim Ngân',
      email: 'doctor11@clinic.com',
      phone: '0912345611',
      avatarUrl: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=250&q=80',
      specialtyId: cardio.id,
      degree: 'Bác sĩ CKI. Tim Mạch & Can Thiệp',
      experienceYears: 11,
      bio: 'Tư vấn điều trị rối loạn mỡ máu, xơ vữa động mạch và theo dõi sức khỏe tim mạch người cao tuổi.',
      consultationFee: 40.0,
    },
    {
      fullName: 'BS CKII. Nguyễn Hoàng Nam',
      email: 'doctor13@clinic.com',
      phone: '0912345613',
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=250&q=80',
      specialtyId: cardio.id,
      degree: 'Bác sĩ CKII. Tim Mạch Lâm Sàng',
      experienceYears: 17,
      bio: 'Chuyên gia đầu ngành về điều trị tăng huyết áp kháng trị, suy tim và bệnh lý van tim.',
      consultationFee: 50.0,
    },

    // --- KHOA NHI (3 Bác Sĩ) ---
    {
      fullName: 'ThS BS. Nguyễn Minh Triết',
      email: 'doctor2@clinic.com',
      phone: '0912345602',
      avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=250&q=80',
      specialtyId: peds.id,
      degree: 'Thạc sĩ Bác sĩ Nhi Khoa',
      experienceYears: 10,
      bio: 'Bác sĩ Nhi khoa tận tâm, nhẹ nhàng với trẻ em, tư vấn phát triển chiều cao và dinh dưỡng cho bé.',
      consultationFee: 35.0,
    },
    {
      fullName: 'ThS BS. Đoàn Nhật Huy',
      email: 'doctor12@clinic.com',
      phone: '0912345612',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      specialtyId: peds.id,
      degree: 'Thạc sĩ Bác sĩ Nhi - Hô Hấp',
      experienceYears: 9,
      bio: 'Chuyên khám và điều trị viêm phế quản, hen suyễn trẻ em, tư vấn tiêm chủng và tăng cường miễn dịch.',
      consultationFee: 35.0,
    },
    {
      fullName: 'BS CKI. Đỗ Thị Thu Trang',
      email: 'doctor14@clinic.com',
      phone: '0912345614',
      avatarUrl: 'https://images.unsplash.com/photo-1594824813566-88855ce7890b?auto=format&fit=crop&w=250&q=80',
      specialtyId: peds.id,
      degree: 'Bác sĩ CKI. Nhi Sơ Sinh & Dinh Dưỡng',
      experienceYears: 12,
      bio: 'Chuyên gia tư vấn phát triển thể chất, chứng biếng ăn, rối loạn tiêu hóa và theo dõi sức khỏe trẻ sơ sinh.',
      consultationFee: 40.0,
    },

    // --- KHOA DA LIỄU (3 Bác Sĩ) ---
    {
      fullName: 'BS. Trần Hoàng Yến',
      email: 'doctor3@clinic.com',
      phone: '0912345603',
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=250&q=80',
      specialtyId: derma.id,
      degree: 'Bác sĩ Chuyên Khoa Da Liễu',
      experienceYears: 8,
      bio: 'Chuyên gia điều trị viêm da cơ địa, dị ứng thời tiết, trị mụn và phục hồi da nhạy cảm.',
      consultationFee: 40.0,
    },
    {
      fullName: 'ThS BS. Trần Tuấn Anh',
      email: 'doctor15@clinic.com',
      phone: '0912345615',
      avatarUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=250&q=80',
      specialtyId: derma.id,
      degree: 'Thạc sĩ Bác sĩ Da Liễu & Thẩm Mỹ Da',
      experienceYears: 11,
      bio: 'Chuyên sâu điều trị sẹo rỗ, nám sạm, viêm da tiếp xúc và ứng dụng Laser thẩm mỹ y khoa.',
      consultationFee: 45.0,
    },
    {
      fullName: 'BS CKI. Lê Mai Phương',
      email: 'doctor16@clinic.com',
      phone: '0912345616',
      avatarUrl: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=250&q=80',
      specialtyId: derma.id,
      degree: 'Bác sĩ CKI. Da Liễu Học',
      experienceYears: 13,
      bio: 'Khám và điều trị vảy nến, chàm mạn tính, mụn nội tiết và chăm sóc phục hồi hàng rào bảo vệ da.',
      consultationFee: 40.0,
    },

    // --- KHOA NỘI TỔNG QUÁT (3 Bác Sĩ) ---
    {
      fullName: 'ThS BS. Phạm Quốc Bảo',
      email: 'doctor4@clinic.com',
      phone: '0912345604',
      avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=250&q=80',
      specialtyId: internal.id,
      degree: 'Thạc sĩ Bác sĩ Nội Khoa',
      experienceYears: 12,
      bio: 'Tư vấn tầm soát sức khỏe tổng quát, điều trị bệnh lý dạ dày, đái tháo đường và rối loạn mỡ máu.',
      consultationFee: 30.0,
    },
    {
      fullName: 'BS CKII. Đặng Hữu Phúc',
      email: 'doctor17@clinic.com',
      phone: '0912345617',
      avatarUrl: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=250&q=80',
      specialtyId: internal.id,
      degree: 'Bác sĩ CKII. Nội Tổng Quát',
      experienceYears: 19,
      bio: 'Chuyên gia đầu ngành về quản lý bệnh đái tháo đường tuýp 2, rối loạn chuyển hóa và hội chứng chuyển hóa.',
      consultationFee: 45.0,
    },
    {
      fullName: 'ThS BS. Nguyễn Bích Ngọc',
      email: 'doctor18@clinic.com',
      phone: '0912345618',
      avatarUrl: 'https://images.unsplash.com/photo-1594824813566-88855ce7890b?auto=format&fit=crop&w=250&q=80',
      specialtyId: internal.id,
      degree: 'Thạc sĩ Bác sĩ Nội Tiết & Dinh Dưỡng',
      experienceYears: 10,
      bio: 'Tư vấn tầm soát sức khỏe người cao tuổi, điều trị bệnh tuyến giáp và rối loạn mỡ máu mạn tính.',
      consultationFee: 35.0,
    },

    // --- KHOA TAI MŨI HỌNG (3 Bác Sĩ) ---
    {
      fullName: 'BS CKII. Võ Minh Hoàng',
      email: 'doctor5@clinic.com',
      phone: '0912345605',
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=250&q=80',
      specialtyId: ent.id,
      degree: 'Bác sĩ CKII. Tai Mũi Họng',
      experienceYears: 16,
      bio: 'Chuyên gia đầu ngành về điều trị viêm xoang mạn tính, polyp mũi xoang và phẫu thuật nội soi Tai Mũi Họng.',
      consultationFee: 40.0,
    },
    {
      fullName: 'ThS BS. Hoàng Minh Quân',
      email: 'doctor19@clinic.com',
      phone: '0912345619',
      avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=250&q=80',
      specialtyId: ent.id,
      degree: 'Thạc sĩ Bác sĩ Tai Mũi Họng',
      experienceYears: 12,
      bio: 'Chuyên điều trị viêm xoang dị ứng, viêm thanh quản hạt xơ dây thanh, ù tai và suy giảm thính lực.',
      consultationFee: 35.0,
    },
    {
      fullName: 'BS CKI. Lê Thị Hải Yến',
      email: 'doctor20@clinic.com',
      phone: '0912345620',
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=250&q=80',
      specialtyId: ent.id,
      degree: 'Bác sĩ CKI. Tai Mũi Họng Nhi',
      experienceYears: 10,
      bio: 'Chuyên sâu về nạo VA, điều trị viêm amidan bằng công nghệ không đau và viêm tai giữa ứ dịch ở trẻ em.',
      consultationFee: 35.0,
    },

    // --- KHOA MẮT (NHÃN KHOA) (3 Bác Sĩ) ---
    {
      fullName: 'ThS BS. Đặng Ngọc Anh',
      email: 'doctor6@clinic.com',
      phone: '0912345606',
      avatarUrl: 'https://images.unsplash.com/photo-1594824813566-88855ce7890b?auto=format&fit=crop&w=250&q=80',
      specialtyId: eye.id,
      degree: 'Thạc sĩ Bác sĩ Nhãn Khoa',
      experienceYears: 11,
      bio: 'Bác sĩ chuyên sâu về tật khúc xạ học đường, kiểm soát cận thị tiến triển ở trẻ em và điều trị khô mắt.',
      consultationFee: 35.0,
    },
    {
      fullName: 'BS CKII. Vũ Đình Trọng',
      email: 'doctor21@clinic.com',
      phone: '0912345621',
      avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=250&q=80',
      specialtyId: eye.id,
      degree: 'Bác sĩ CKII. Nhãn Khoa',
      experienceYears: 18,
      bio: 'Chuyên gia phẫu thuật Phaco đục thủy tinh thể, Glaucoma (cườm nước) và bệnh võng mạc tiểu đường.',
      consultationFee: 50.0,
    },
    {
      fullName: 'ThS BS. Phan Thảo My',
      email: 'doctor22@clinic.com',
      phone: '0912345622',
      avatarUrl: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=250&q=80',
      specialtyId: eye.id,
      degree: 'Thạc sĩ Bác sĩ Nhãn Khoa Trẻ Em',
      experienceYears: 9,
      bio: 'Chuyên khám tật khúc xạ, kiểm soát tiến triển cận thị bằng kính Ortho-K và luyện tập thị giác nhược thị.',
      consultationFee: 35.0,
    },

    // --- KHOA RĂNG HÀM MẶT (3 Bác Sĩ) ---
    {
      fullName: 'BS CKI. Bùi Tuấn Kiệt',
      email: 'doctor7@clinic.com',
      phone: '0912345607',
      avatarUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=250&q=80',
      specialtyId: dental.id,
      degree: 'Bác sĩ CKI. Răng Hàm Mặt & Chỉnh Nha',
      experienceYears: 9,
      bio: 'Bác sĩ nha khoa thẩm mỹ tận tâm, chuyên sâu về cấy ghép Implant, chỉnh nha niềng răng và phục hình nụ cười.',
      consultationFee: 30.0,
    },
    {
      fullName: 'ThS BS. Nguyễn Thành Long',
      email: 'doctor23@clinic.com',
      phone: '0912345623',
      avatarUrl: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=250&q=80',
      specialtyId: dental.id,
      degree: 'Thạc sĩ Bác sĩ Chỉnh Nha & Răng Trẻ Em',
      experienceYears: 11,
      bio: 'Chuyên sâu niềng răng trong suốt Invisalign, điều trị khớp cắn ngược và chỉnh hình răng mặt cho trẻ em.',
      consultationFee: 35.0,
    },
    {
      fullName: 'BS CKI. Phạm Minh Châu',
      email: 'doctor24@clinic.com',
      phone: '0912345624',
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=250&q=80',
      specialtyId: dental.id,
      degree: 'Bác sĩ CKI. Cấy Ghép Implant & Phục Hình',
      experienceYears: 13,
      bio: 'Chuyên cấy ghép Implant kỹ thuật số không đau, dán sứ Veneer thẩm mỹ và tiểu phẫu răng khôn mọc lệch.',
      consultationFee: 40.0,
    },

    // --- KHOA CƠ XƯƠNG KHỚP (3 Bác Sĩ) ---
    {
      fullName: 'TS BS. Hoàng Đức Thắng',
      email: 'doctor8@clinic.com',
      phone: '0912345608',
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=250&q=80',
      specialtyId: ortho.id,
      degree: 'Tiến sĩ Bác sĩ Cơ Xương Khớp',
      experienceYears: 18,
      bio: 'Bác sĩ giàu kinh nghiệm trong chẩn đoán thoái hóa khớp gối, loãng xương, tiêm huyết tương giàu tiểu cầu (PRP).',
      consultationFee: 50.0,
    },
    {
      fullName: 'BS CKII. Bùi Quang Huy',
      email: 'doctor25@clinic.com',
      phone: '0912345625',
      avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=250&q=80',
      specialtyId: ortho.id,
      degree: 'Bác sĩ CKII. Chấn Thương Chỉnh Hình',
      experienceYears: 16,
      bio: 'Điều trị thoái hóa cột sống cổ - thắt lưng, tổn thương sụn chêm, rách dây chằng và nắn chỉnh cơ xương khớp.',
      consultationFee: 45.0,
    },
    {
      fullName: 'ThS BS. Trần Thị Ánh Tuyết',
      email: 'doctor26@clinic.com',
      phone: '0912345626',
      avatarUrl: 'https://images.unsplash.com/photo-1594824813566-88855ce7890b?auto=format&fit=crop&w=250&q=80',
      specialtyId: ortho.id,
      degree: 'Thạc sĩ Bác sĩ Thấp Khớp Học',
      experienceYears: 10,
      bio: 'Chuyên sâu điều trị viêm khớp dạng thấp, viêm cột sống dính khớp, loãng xương và cơn Gút cấp mạn tính.',
      consultationFee: 35.0,
    },

    // --- KHOA SẢN PHỤ KHOA (3 Bác Sĩ) ---
    {
      fullName: 'BS CKI. Vũ Thùy Linh',
      email: 'doctor9@clinic.com',
      phone: '0912345609',
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=250&q=80',
      specialtyId: obgyn.id,
      degree: 'Bác sĩ CKI. Sản Phụ Khoa',
      experienceYears: 12,
      bio: 'Bác sĩ phụ khoa nhẹ nhàng, thấu hiểu tâm lý phụ nữ, chuyên theo dõi thai kỳ nguy cơ cao và tư vấn tiền sản.',
      consultationFee: 45.0,
    },
    {
      fullName: 'BS CKII. Đặng Thanh Nga',
      email: 'doctor27@clinic.com',
      phone: '0912345627',
      avatarUrl: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=250&q=80',
      specialtyId: obgyn.id,
      degree: 'Bác sĩ CKII. Sản Phụ Khoa',
      experienceYears: 17,
      bio: 'Chuyên gia siêu âm dị tật thai nhi 4D/5D, quản lý thai kỳ nguy cơ cao và tư vấn hỗ trợ sinh sản.',
      consultationFee: 50.0,
    },
    {
      fullName: 'ThS BS. Lê Hồng Hạnh',
      email: 'doctor28@clinic.com',
      phone: '0912345628',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
      specialtyId: obgyn.id,
      degree: 'Thạc sĩ Bác sĩ Phụ Khoa & Nội Tiết Sinh Sản',
      experienceYears: 11,
      bio: 'Tư vấn sức khỏe tiền hôn nhân, điều trị u xơ tử cung, u nang buồng trứng và tầm soát ung thư cổ tử cung.',
      consultationFee: 40.0,
    },

    // --- KHOA TIÊU HÓA - GAN MẬT (3 Bác Sĩ) ---
    {
      fullName: 'ThS BS. Trương Gia Bảo',
      email: 'doctor10@clinic.com',
      phone: '0912345610',
      avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=250&q=80',
      specialtyId: gastro.id,
      degree: 'Thạc sĩ Bác sĩ Tiêu Hóa & Nội Soi',
      experienceYears: 13,
      bio: 'Chuyên gia điều trị hội chứng ruột kích thích (IBS), trào ngược GERD, viêm gan siêu vi B/C và gan nhiễm mỡ.',
      consultationFee: 40.0,
    },
    {
      fullName: 'BS CKII. Ngô Văn Dũng',
      email: 'doctor29@clinic.com',
      phone: '0912345629',
      avatarUrl: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=250&q=80',
      specialtyId: gastro.id,
      degree: 'Bác sĩ CKII. Gan Mật Tụy',
      experienceYears: 18,
      bio: 'Chuyên gia điều trị viêm gan B, C mạn tính, xơ gan giai đoạn sớm, sỏi đường mật và bệnh lý tụy.',
      consultationFee: 50.0,
    },
    {
      fullName: 'ThS BS. Hoàng Thị Diệu Linh',
      email: 'doctor30@clinic.com',
      phone: '0912345630',
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=250&q=80',
      specialtyId: gastro.id,
      degree: 'Thạc sĩ Bác sĩ Nội Soi Tiêu Hóa',
      experienceYears: 10,
      bio: 'Nội soi dạ dày đại tràng không đau, can thiệp cắt polyp ống tiêu hóa và điều trị vi khuẩn HP kháng thuốc.',
      consultationFee: 40.0,
    },
  ];

  const createdDoctorInfos: any[] = [];

  for (const docData of doctorsData) {
    const user = await prisma.user.create({
      data: {
        fullName: docData.fullName,
        email: docData.email,
        phone: docData.phone,
        passwordHash: defaultPasswordHash,
        role: 'DOCTOR',
        avatarUrl: docData.avatarUrl,
      },
    });

    const info = await prisma.doctorInfo.create({
      data: {
        userId: user.id,
        specialtyId: docData.specialtyId,
        degree: docData.degree,
        experienceYears: docData.experienceYears,
        bio: docData.bio,
        consultationFee: docData.consultationFee,
      },
    });

    createdDoctorInfos.push(info);

    // 4. Lịch làm việc trong tuần (Thứ 2 - Chủ Nhật: 08:00 - 17:00)
    for (let day = 0; day <= 6; day++) {
      await prisma.doctorSchedule.create({
        data: {
          doctorId: info.id,
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
  // Lịch 1: Đã hoàn thành khám hôm nay với BS Lê Thị Thanh Hà (Khoa Tim Mạch)
  const appt1 = await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      doctorId: createdDoctorInfos[0].id,
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
      doctorId: createdDoctorInfos[0].id,
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

  // Lịch 2: Đã xác nhận hôm nay với ThS BS Nguyễn Minh Triết (Khoa Nhi)
  await prisma.appointment.create({
    data: {
      patientId: patient2.id,
      doctorId: createdDoctorInfos[3].id,
      specialtyId: peds.id,
      appointmentDate: todayStr,
      appointmentTime: '10:30',
      status: 'CONFIRMED',
      bookingType: 'SELF_SELECTED',
      patientNotes: 'Khám sức khỏe tổng quát và tư vấn dinh dưỡng cho bé.',
    },
  });

  // Lịch 3: Đặt tự động cho ngày mai (Khoa Da Liễu)
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

  // Lịch 4: Đột xuất báo bận cần đổi bác sĩ (Khoa Nội Tổng Quát)
  const appt4 = await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      doctorId: createdDoctorInfos[9].id,
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

  console.log(`✅ Đã tạo thành công 10 Chuyên Khoa và ${createdDoctorInfos.length} Bác Sĩ phụ trách (mỗi khoa 3 Bác Sĩ đầy đủ lịch làm việc)!`);
}

main()
  .catch((e) => {
    console.error('❌ Lỗi seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
