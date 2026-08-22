import { z } from 'zod';

const phoneRegex = /^(0|\+84)[3|5|7|8|9|1][0-9]{8}$|^[0-9]{10,11}$/;

export const bookingFormSchema = z.object({
  specialtyId: z.string().min(1, 'Vui lòng chọn chuyên khoa khám'),
  doctorId: z.string().nullable().optional(),
  bookingType: z.enum(['SELF_SELECTED', 'AUTO_ASSIGN']),
  appointmentDate: z
    .string()
    .min(1, 'Vui lòng chọn ngày khám bệnh')
    .refine((dateStr) => {
      const selectedDate = new Date(dateStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, { message: 'Ngày khám không thể ở trong quá khứ' }),
  appointmentTime: z.string().min(1, 'Vui lòng chọn khung giờ khám'),
  fullName: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
  email: z.union([z.string().email('Vui lòng nhập địa chỉ email hợp lệ'), z.literal('')]).optional(),
  phone: z.string().regex(phoneRegex, 'Số điện thoại phải đúng định dạng 10 số (ví dụ: 0901234567)'),
  patientNotes: z.string().optional(),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

export const loginSchema = z.object({
  phone: z.string().min(1, 'Vui lòng nhập số điện thoại'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  phone: z.string().regex(phoneRegex, 'Số điện thoại phải đúng định dạng 10 số (ví dụ: 0901234567)'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

export type RegisterValues = z.infer<typeof registerSchema>;

export const prescriptionItemSchema = z.object({
  medicineName: z.string().min(1, 'Vui lòng nhập tên thuốc'),
  dosage: z.string().min(1, 'Vui lòng nhập hàm lượng (ví dụ: 500mg)'),
  frequency: z.string().min(1, 'Vui lòng nhập cách dùng (ví dụ: Uống 2 lần/ngày)'),
  duration: z.string().min(1, 'Vui lòng nhập thời gian (ví dụ: 7 ngày)'),
  notes: z.string().optional(),
});

export const consultationSchema = z.object({
  appointmentId: z.string().min(1),
  symptoms: z.string().min(3, 'Vui lòng mô tả triệu chứng bệnh nhân'),
  diagnosis: z.string().min(3, 'Vui lòng nhập chẩn đoán y khoa'),
  notes: z.string().optional(),
  prescriptions: z.array(prescriptionItemSchema),
});

export type ConsultationValues = z.infer<typeof consultationSchema>;

export const doctorUnavailabilitySchema = z.object({
  reason: z.string().min(5, 'Vui lòng nhập rõ lý do báo bận'),
});

export type DoctorUnavailabilityValues = z.infer<typeof doctorUnavailabilitySchema>;

export const specialtySchema = z.object({
  name: z.string().min(2, 'Vui lòng nhập tên chuyên khoa'),
  description: z.string().min(5, 'Vui lòng nhập mô tả chuyên khoa'),
  iconUrl: z.string().optional(),
});

export type SpecialtyValues = z.infer<typeof specialtySchema>;

export const doctorProfileSchema = z.object({
  fullName: z.string().min(2, 'Vui lòng nhập họ tên bác sĩ'),
  email: z.string().email('Vui lòng nhập email bác sĩ'),
  phone: z.string().regex(phoneRegex, 'Vui lòng nhập số điện thoại hợp lệ'),
  specialtyId: z.string().min(1, 'Vui lòng chọn chuyên khoa'),
  degree: z.string().min(2, 'Vui lòng nhập bằng cấp bác sĩ'),
  experienceYears: z.number().min(0, 'Kinh nghiệm phải lớn hơn hoặc bằng 0'),
  consultationFee: z.number().min(0, 'Giá khám phải lớn hơn hoặc bằng 0'),
  bio: z.string().min(10, 'Tiểu sử bác sĩ phải có ít nhất 10 ký tự'),
  avatarUrl: z.string().optional(),
});

export type DoctorProfileValues = z.infer<typeof doctorProfileSchema>;
