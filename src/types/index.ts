export type UserRole = 'ADMIN' | 'DOCTOR' | 'PATIENT';

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NEEDS_REASSIGNMENT';

export type BookingType = 'SELF_SELECTED' | 'AUTO_ASSIGN';

export type NotificationType = 'URGENT_DOCTOR_BUSY' | 'NEW_BOOKING' | 'GENERAL';

export interface UserSession {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string | null;
  doctorId?: string | null;
}

export interface Specialty {
  id: string;
  name: string;
  description: string;
  iconUrl?: string | null;
}

export interface DoctorSchedule {
  id: string;
  doctorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
}

export interface DoctorInfo {
  id: string;
  userId: string;
  specialtyId: string;
  degree: string;
  experienceYears: number;
  bio: string;
  consultationFee: number;
  user: {
    fullName: string;
    email: string;
    phone: string;
    avatarUrl?: string | null;
  };
  specialty: Specialty;
  schedules?: DoctorSchedule[];
}

export interface Prescription {
  id?: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string | null;
}

export interface MedicalRecord {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  symptoms: string;
  diagnosis: string;
  notes?: string | null;
  createdAt: string;
  doctor?: DoctorInfo | null;
  patient?: {
    fullName: string;
    email: string;
    phone: string;
  } | null;
  appointment?: Appointment | null;
  prescriptions: Prescription[];
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId?: string | null;
  specialtyId: string;
  appointmentDate: string;
  appointmentTime: string;
  status: AppointmentStatus;
  bookingType: BookingType;
  patientNotes?: string | null;
  createdAt: string;
  patient?: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    avatarUrl?: string | null;
  };
  doctor?: DoctorInfo | null;
  specialty?: Specialty;
  medicalRecord?: MedicalRecord | null;
}

export interface NotificationItem {
  id: string;
  userId: string;
  appointmentId?: string | null;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  appointment?: Appointment | null;
}
