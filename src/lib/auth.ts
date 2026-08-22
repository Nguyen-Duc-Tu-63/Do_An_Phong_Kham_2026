import { cookies } from 'next/headers';
import { prisma } from './prisma';
import { UserSession } from '@/types';

export const AUTH_COOKIE_NAME = 'phongkham_session_user';

export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    // If no session cookie, user is an unauthenticated guest visitor
    if (!sessionCookie) {
      return null;
    }

    const parsed = JSON.parse(sessionCookie);
    const dbUser = await prisma.user.findUnique({
      where: { id: parsed.id },
      include: { doctorInfo: true },
    });

    if (!dbUser) return null;

    return {
      id: dbUser.id,
      fullName: dbUser.fullName,
      email: dbUser.email,
      phone: dbUser.phone,
      role: dbUser.role as any,
      avatarUrl: dbUser.avatarUrl,
      doctorId: dbUser.doctorInfo?.id || null,
    };
  } catch (error) {
    console.error('Lỗi lấy thông tin session:', error);
    return null;
  }
}
