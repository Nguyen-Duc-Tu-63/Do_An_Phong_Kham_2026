import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Helper to remove Vietnamese diacritics for flexible fuzzy symptom matching
function removeVietnameseTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

interface SpecialtyMatchRule {
  specialtyName: string;
  keywords: string[];
  explanation: string;
  advice: string;
}

const SPECIALTY_RULES: SpecialtyMatchRule[] = [
  {
    specialtyName: 'Khoa Tim Mạch',
    keywords: [
      'tim', 'dau nguc', 'nhoc nguc', 'nhoi nguc', 'tuc nguc', 'hoi hop', 'danh trong nguc',
      'kho tho khi gang suc', 'tang huyet ap', 'huyet ap cao', 'ha huyet ap', 'mo mau',
      'xo vua', 'mach vanh', 'suy tim', 'loan nhip', 'nhip tim nhanh', 'nhip tim cham', 'dien tim'
    ],
    explanation: 'Các biểu hiện đau tức vùng ngực, hồi hộp trống ngực hay bất thường về huyết áp là những dấu hiệu chỉ điểm quan trọng của bệnh lý hệ tim mạch.',
    advice: 'Bạn nên nghỉ ngơi, tránh vận động gắng sức, hạn chế ăn mặn và các chất kích thích (cà phê, thuốc lá). Cần được đo điện tâm đồ (ECG), siêu âm tim và kiểm tra chỉ số huyết áp sớm.',
  },
  {
    specialtyName: 'Khoa Nhi',
    keywords: [
      'be', 'em be', 'tre', 'tre nho', 'tre so sinh', 'chau', 'con toi', 'bieng an',
      'sot o tre', 'sot cao tre', 'non tro', 'cham lon', 'coi xuong', 'phat ban o be',
      'quay khoc', 'tiem chung', 'tiem phong', 'vac xin', 'tay chan mieng', 'viem phe quan tre'
    ],
    explanation: 'Trẻ sơ sinh và trẻ nhỏ có đặc điểm sinh lý miễn dịch chuyên biệt, cần được Bác sĩ Chuyên khoa Nhi thăm khám nhẹ nhàng và chỉ định liều lượng thuốc chuẩn xác theo cân nặng.',
    advice: 'Theo dõi sát nhiệt độ của bé, cho bé uống nhiều nước hoặc bù điện giải oresol theo chỉ dẫn, cho ăn thức ăn mềm, lỏng dễ tiêu. Nếu bé sốt cao liên tục hoặc li bì cần đi khám ngay.',
  },
  {
    specialtyName: 'Khoa Da Liễu',
    keywords: [
      'da', 'ngua', 'ngua da', 'man do', 'noi man', 'di ung da', 'mun', 'mun trung ca',
      'viem da', 'vay nen', 'cham', 'eczema', 'me day', 'noi me day', 'rung toc',
      'nam da', 'hac lao', 'lang ben', 'seo', 'tham', 'nam da', 'tan nhang', 'zona', 'thuy dau'
    ],
    explanation: 'Các tổn thương trên bề mặt da như ngứa ngáy, nổi mẩn, phát ban hay mụn viêm cần được bác sĩ da liễu soi da và xác định chính xác căn nguyên dị ứng, vi nấm hoặc nội tiết.',
    advice: 'Không nên tự ý gãi hay bôi các loại thuốc chứa corticoid không rõ nguồn gốc. Giữ vệ sinh vùng da sạch sẽ, mặc đồ thoáng mát và tránh tiếp xúc với hóa chất tẩy rửa mạnh.',
  },
  {
    specialtyName: 'Khoa Tai Mũi Họng',
    keywords: [
      'tai', 'mui', 'hong', 'viem hong', 'dau hong', 'rat hong', 'ho', 'ho dam', 'ho khan',
      'nuot vuong', 'nuot dau', 'amidan', 'va', 'viem xoang', 'nghet mui', 'so mui',
      'chay nuoc mui', 'u tai', 'dau tai', 'chay mu tai', 'khan tieng', 'mat giong', 'ngay to', 'viem mui di ung'
    ],
    explanation: 'Vùng tai mũi họng là cửa ngõ hô hấp trên thường xuyên bị viêm nhiễm do thời tiết và vi khuẩn, cần được nội soi để đánh giá mức độ sưng viêm niêm mạc.',
    advice: 'Súc họng bằng nước muối sinh lý ấm mỗi ngày, giữ ấm vùng cổ họng, đeo khẩu trang khi ra ngoài và uống nhiều nước ấm. Tránh uống nước đá lạnh.',
  },
  {
    specialtyName: 'Khoa Mắt (Nhãn Khoa)',
    keywords: [
      'mat', 'mo mat', 'dau mat', 'do mat', 'com mat', 'xom mat', 'rat mat', 'chay nuoc mat',
      'can thi', 'vien thi', 'loan thi', 'tat khuc xa', 'duc thuy tinh the', 'cuom kho', 'cuom nuoc',
      'glaucoma', 'viem ket mac', 'dau mat do', 'nhin doi', 'moi mat', 'loa mat'
    ],
    explanation: 'Các triệu chứng nhìn mờ, cộm xốn, đỏ mắt hoặc giảm thị lực cần kiểm tra chuyên sâu bằng máy đo khúc xạ tự động và đèn sinh hiển vi khám mắt.',
    advice: 'Hạn chế nhìn màn hình điện thoại/máy tính liên tục quá 30 phút, chớp mắt thường xuyên hoặc nhỏ nước muối sinh lý nhỏ mắt. Tuyệt đối không dụi mắt khi có cảm giác cộm xốn.',
  },
  {
    specialtyName: 'Khoa Răng Hàm Mặt',
    keywords: [
      'rang', 'nuou', 'loi', 'dau rang', 'nhuc rang', 'buot rang', 'rang khon', 'sau rang',
      'sung loi', 'sung nuou', 'chay mau chan rang', 'viem loi', 'nho rang', 'nieng rang',
      'chinh nha', 'implant', 'trong rang', 'hoi mieng', 'me rang', 'lay cao rang', 'cao voi'
    ],
    explanation: 'Cơn đau buốt răng, sưng lợi hoặc răng khôn mọc lệch cần được chụp X-quang răng toàn cảnh để can thiệp kịp thời, tránh tổn thương tủy răng và lan rộng sang xương hàm.',
    advice: 'Đánh răng nhẹ nhàng bằng bàn chải lông mềm sau khi ăn, súc miệng nước muối. Tránh nhai thức ăn cứng hoặc quá nóng/lạnh tại vùng răng đang đau buốt.',
  },
  {
    specialtyName: 'Khoa Cơ Xương Khớp',
    keywords: [
      'khop', 'xuong', 'co', 'dau lung', 'dau khop', 'sung khop', 'thoai hoa khop',
      'thoat vi dia dem', 'dau goi', 'keu luc cuc', 'moi goi', 'dau vai gay', 'co vai gay',
      'te bi chan tay', 'gut', 'gout', 'axit uric', 'loang xuong', 'cot song', 'kho van dong'
    ],
    explanation: 'Cảm giác đau nhức xương khớp, thoái hóa khớp gối hoặc đau mỏi cột sống thắt lưng/cổ vai gáy cần được khám chức năng vận động và chụp phim chẩn đoán hình ảnh.',
    advice: 'Hạn chế mang vác vật nặng, không ngồi hay đứng một tư thế quá lâu, có thể chườm ấm vị trí đau mỏi và thực hiện các động tác giãn cơ nhẹ nhàng.',
  },
  {
    specialtyName: 'Khoa Sản Phụ Khoa',
    keywords: [
      'thai', 'co thai', 'mang thai', 'kham thai', 'sieu am thai', 'tre kinh', 'cham kinh',
      'rong kinh', 'dau bung kinh', 'kinh nguyet', 'phu khoa', 'khi hu', 'huyet trang',
      'ngua vung kin', 'viem am dao', 'u xo tu cung', 'buong trung', 'tien man kinh', 'ngua phu khoa'
    ],
    explanation: 'Các vấn đề chu kỳ kinh nguyệt, dấu hiệu mang thai hoặc viêm nhiễm phụ khoa cần được Bác sĩ Sản phụ khoa thăm khám tế nhị, siêu âm và tư vấn cặn kẽ.',
    advice: 'Giữ vệ sinh vùng kín khô thoáng bằng dung dịch dịu nhẹ, không thụt rửa sâu. Chú ý theo dõi chu kỳ kinh và chuẩn bị các thông tin ngày đầu kỳ kinh gần nhất khi đến khám.',
  },
  {
    specialtyName: 'Khoa Tiêu Hóa - Gan Mật',
    keywords: [
      'da day', 'bao tu', 'dai trang', 'ruot', 'tieu hoa', 'dau bung', 'thuong vi',
      'o chua', 'o nong', 'trao nguoc', 'gerd', 'buon non', 'non', 'kho tieu', 'day bung',
      'chuong bung', 'phan long', 'tieu chay', 'tao bon', 'men gan', 'viem gan', 'gan nhiem mo', 'vang da', 'soi mat'
    ],
    explanation: 'Các biểu hiện ợ chua, trào ngược thực quản, đau vùng thượng vị hoặc rối loạn tiêu hóa là dấu hiệu của bệnh lý dạ dày, đại tràng hoặc chức năng gan mật.',
    advice: 'Ăn đúng giờ, không để bụng quá đói hoặc quá no, kiêng đồ ăn cay nóng nhiều dầu mỡ và đồ uống có cồn. Tránh nằm ngay sau khi ăn ít nhất 2 giờ.',
  },
  {
    specialtyName: 'Khoa Nội Tổng Quát',
    keywords: [
      'met moi', 'sut can', 'sot', 'sot nhe', 'ue oai', 'chong mat', 'hoa mat',
      'mat ngu', 'tieu duong', 'dai thao duong', 'kham tong quat', 'kiem tra tong quat',
      'tam soat', 'kham dinh ky', 'suy nhuoc', 'sut can khong ro', 'met moi keo dai'
    ],
    explanation: 'Nếu bạn có triệu chứng mệt mỏi, sụt cân, sốt kéo dài hoặc muốn tầm soát sức khỏe tổng thể định kỳ, Khoa Nội Tổng Quát là điểm xuất phát phù hợp nhất.',
    advice: 'Uống đủ 2 lít nước mỗi ngày, ngủ đủ giấc, duy trì chế độ dinh dưỡng cân bằng và chuẩn bị các kết quả xét nghiệm cũ (nếu có) khi đến khám.',
  },
];

// Emergency red flag terms
const EMERGENCY_KEYWORDS = [
  'cap cuu', 'hon me', 'bat tinh', 'co giat', 'kho tho du doi', 'ngat tho', 'tim tai',
  'dau nguc du doi', 'nhoi tim', 'non ra mau', 'ho ra mau', 'liet nua nguoi', 'meo mieng',
  'dot quy', 'tai bien', 'mat y thuc', 'mat tri nho dot ngot', 'chay mau khong cam', 'uong nham thuoc'
];

// Booking inquiry terms
const BOOKING_KEYWORDS = [
  'dat lich', 'cach dat lich', 'huong dan dat lich', 'quy trinh', 'lam sao dat',
  'hen gio', 'khung gio', 'gia kham', 'chi phi', 'dang ky kham', 'cach kham', 'book lich'
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userMessage: string = (body?.message || '').trim();

    if (!userMessage) {
      return NextResponse.json(
        { error: 'Tin nhắn không được để trống' },
        { status: 400 }
      );
    }

    const normText = removeVietnameseTones(userMessage);

    // 1. Check for Emergency Red Flags
    const isEmergency = EMERGENCY_KEYWORDS.some((kw) => normText.includes(kw));
    if (isEmergency) {
      return NextResponse.json({
        reply: `🚨 **CẢNH BÁO Y TẾ KHẨN CẤP!**\n\nTriệu chứng bạn vừa mô tả có dấu hiệu nguy hiểm hoặc đe dọa tính mạng. Vui lòng **gọi ngay cấp cứu 115** hoặc đến phòng cấp cứu của bệnh viện gần nhất ngay lập tức!\n\n📞 **Hotline Cấp Cứu Phòng Khám CarePlus+:** **090-123-4567** (Hoạt động 24/7)\n\n*Lưu ý: Không tự ý dùng thuốc hay di chuyển một mình khi đang có triệu chứng cấp cứu.*`,
        suggestedSpecialty: null,
        suggestedDoctors: [],
        quickReplies: [
          'Gọi cấp cứu 115 ngay',
          'Hotline hỗ trợ: 090-123-4567',
          'Tư vấn triệu chứng thông thường khác',
        ],
        isEmergency: true,
        action: 'GENERAL',
      });
    }

    // 2. Fetch specialties & doctors from Database
    const dbSpecialties = await prisma.specialty.findMany({
      include: {
        doctors: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { experienceYears: 'desc' },
          take: 3,
        },
      },
    });

    // 3. Check if user is asking for Booking Guide
    const isBookingInquiry = BOOKING_KEYWORDS.some((kw) => normText.includes(kw));
    if (isBookingInquiry) {
      return NextResponse.json({
        reply: `Chào bạn! Dưới đây là **Quy trình 3 bước Đặt lịch khám** cực kỳ nhanh chóng tại CarePlus+:\n\n` +
          `1️⃣ **Bước 1: Chọn Chuyên khoa & Bác sĩ**\n` +
          `• Chọn chuyên khoa khám theo triệu chứng của bạn.\n` +
          `• Bạn có thể chọn bác sĩ chuyên khoa mong muốn hoặc chọn *"Hệ thống tự động sắp xếp"* để phòng khám bố trí bác sĩ tối ưu nhất.\n\n` +
          `2️⃣ **Bước 2: Chọn Ngày & Khung giờ khám**\n` +
          `• Lựa chọn ngày khám thuận tiện. Khung giờ sáng (08:00 - 11:30) hoặc chiều (13:30 - 16:30).\n\n` +
          `3️⃣ **Bước 3: Nhập thông tin & Xác nhận**\n` +
          `• Điền Họ tên, Số điện thoại và mô tả ngắn triệu chứng. Nhấn *"Xác nhận đặt lịch"*, bạn sẽ nhận được thông báo xác nhận và dễ dàng theo dõi hồ sơ khám trực tuyến.\n\n` +
          `👉 Bạn có thể nhấn nút đặt lịch bên dưới để bắt đầu ngay!`,
        suggestedSpecialty: null,
        suggestedDoctors: [],
        quickReplies: [
          'Đặt lịch khám ngay',
          'Tư vấn chọn khoa khám',
          'Xem danh sách bác sĩ giỏi',
          'Xem bảng giá khám',
        ],
        isEmergency: false,
        action: 'BOOK_APPOINTMENT',
      });
    }

    // 4. Match Symptoms to Specialty
    let bestMatch: SpecialtyMatchRule | null = null;
    let highestScore = 0;

    for (const rule of SPECIALTY_RULES) {
      let score = 0;
      for (const kw of rule.keywords) {
        if (normText.includes(kw)) {
          // Exact keyword hit
          score += kw.split(' ').length >= 2 ? 3 : 1;
        }
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = rule;
      }
    }

    // If score is found, look up corresponding database specialty
    if (bestMatch && highestScore > 0) {
      const dbSpec = dbSpecialties.find((s) =>
        removeVietnameseTones(s.name).includes(removeVietnameseTones(bestMatch!.specialtyName))
      ) || dbSpecialties[0];

      const topDoctors = dbSpec?.doctors?.map((d) => ({
        id: d.id,
        name: d.user.fullName,
        degree: d.degree,
        experienceYears: d.experienceYears,
        consultationFee: d.consultationFee,
        avatarUrl: d.user.avatarUrl,
      })) || [];

      const docListText = topDoctors.length > 0
        ? topDoctors
            .map((doc) => `• **${doc.name}** (${doc.degree} - ${doc.experienceYears} năm KN)`)
            .join('\n')
        : 'Đội ngũ bác sĩ giàu kinh nghiệm phụ trách.';

      const reply = `Xin chào bạn! Dựa trên các triệu chứng bạn vừa chia sẻ, CareBot xin đưa ra tư vấn định hướng như sau:\n\n` +
        `🏥 **Gợi ý Chuyên khoa phù hợp:** **${dbSpec?.name || bestMatch.specialtyName}**\n\n` +
        `🔍 **Đánh giá ban đầu:** ${bestMatch.explanation}\n\n` +
        `👨‍⚕️ **Bác sĩ phụ trách tiêu biểu:**\n${docListText}\n\n` +
        `💡 **Lời khuyên chăm sóc:** ${bestMatch.advice}\n\n` +
        `📅 Bạn nên đặt lịch khám sớm để được bác sĩ trực tiếp thăm khám và đưa ra phác đồ điều trị phù hợp nhất!`;

      return NextResponse.json({
        reply,
        suggestedSpecialty: dbSpec
          ? {
              id: dbSpec.id,
              name: dbSpec.name,
              description: dbSpec.description,
              iconUrl: dbSpec.iconUrl,
            }
          : null,
        suggestedDoctors: topDoctors,
        quickReplies: [
          `Đặt lịch ${dbSpec?.name || 'ngay'}`,
          'Xem các bác sĩ chuyên khoa này',
          'Hướng dẫn quy trình khám',
          'Tư vấn thêm triệu chứng khác',
        ],
        isEmergency: false,
        action: 'BOOK_APPOINTMENT',
      });
    }

    // 5. Default Friendly Medical Greeting / General Guidance
    return NextResponse.json({
      reply: `Xin chào! Tôi là **CareBot - Trợ lý Bác sĩ Ảo** của Phòng Khám Đa Khoa CarePlus+ 🩺✨\n\n` +
        `Tôi luôn sẵn sàng hỗ trợ bạn:\n` +
        `• 📋 **Phân tích triệu chứng** (ví dụ: đau ngực, sốt ho, nổi mẩn đỏ, đau răng, mỏi khớp...)\n` +
        `• 🏥 **Gợi ý đúng Chuyên khoa y tế** cần khám\n` +
        `• 👨‍⚕️ **Giới thiệu Bác sĩ chuyên khoa giàu kinh nghiệm**\n` +
        `• 📅 **Hướng dẫn đặt lịch khám nhanh chóng**\n\n` +
        `👉 Hãy gõ mô tả triệu chứng hoặc chọn một câu hỏi gợi ý bên dưới để CareBot hỗ trợ bạn nhé!`,
      suggestedSpecialty: null,
      suggestedDoctors: [],
      quickReplies: [
        'Đau thắt ngực, khó thở',
        'Bé bị sốt và ho về đêm',
        'Nổi mẩn đỏ ngứa da dị ứng',
        'Đau nhức răng buốt',
        'Đau khớp gối khi đi lại',
        'Đau dạ dày, ợ chua trào ngược',
        'Hướng dẫn đặt lịch khám',
      ],
      isEmergency: false,
      action: 'GENERAL',
    });
  } catch (error: any) {
    console.error('Lỗi AI Chatbot:', error);
    return NextResponse.json(
      {
        error: 'Có lỗi xảy ra trong quá trình xử lý tin nhắn.',
        reply: 'Xin lỗi, hệ thống tư vấn đang bận. Bạn vui lòng thử lại hoặc liên hệ Hotline **090-123-4567** để được nhân viên y tế hỗ trợ trực tiếp!',
      },
      { status: 500 }
    );
  }
}
