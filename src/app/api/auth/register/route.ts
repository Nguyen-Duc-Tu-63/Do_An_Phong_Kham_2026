import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fullName = (body.fullName || '').trim();
    const phone = (body.phone || '').trim();
    const password = body.password;

    if (!fullName || fullName.length < 2) {
      return NextResponse.json({ error: 'Họ và tên phải có ít nhất 2 ký tự' }, { status: 400 });
    }

    if (!phone || phone.length < 9) {
      return NextResponse.json({ error: 'Vui lòng nhập số điện thoại hợp lệ (10 số)' }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Mật khẩu phải có ít nhất 6 ký tự' }, { status: 400 });
    }

    // Check if phone already registered
    const existingUser = await prisma.user.findFirst({
      where: { phone },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Số điện thoại này đã được đăng ký tài khoản. Vui lòng đăng nhập.' },
        { status: 400 }
      );
    }

    const hash = await bcrypt.hash(password, 10);
    const email = body.email?.trim() || `patient_${phone}@careplus.vn`;

    const newUser = await prisma.user.create({
      data: {
        fullName,
        phone,
        email,
        passwordHash: hash,
        role: 'PATIENT',
      },
    });

    const sessionData = {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      avatarUrl: newUser.avatarUrl,
      doctorId: null,
    };

    const response = NextResponse.json({ success: true, user: sessionData }, { status: 201 });
    response.cookies.set(AUTH_COOKIE_NAME, JSON.stringify(sessionData), {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi khi đăng ký tài khoản' }, { status: 500 });
  }
}
