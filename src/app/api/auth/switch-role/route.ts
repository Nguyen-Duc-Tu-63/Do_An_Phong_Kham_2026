import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { role } = await request.json();

    // Find first user matching requested role
    let targetUser = await prisma.user.findFirst({
      where: { role: role as string },
      include: { doctorInfo: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: `No demo user found for role ${role}` }, { status: 404 });
    }

    const sessionData = {
      id: targetUser.id,
      fullName: targetUser.fullName,
      email: targetUser.email,
      phone: targetUser.phone,
      role: targetUser.role,
      avatarUrl: targetUser.avatarUrl,
      doctorId: targetUser.doctorInfo?.id || null,
    };

    const response = NextResponse.json({ success: true, user: sessionData });
    response.cookies.set(AUTH_COOKIE_NAME, JSON.stringify(sessionData), {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Switch role error' }, { status: 500 });
  }
}
