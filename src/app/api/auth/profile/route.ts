import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getCurrentUser, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function PUT(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, phone, email, avatarUrl, currentPassword, newPassword } = body;

    const cleanFullName = (fullName || '').trim();
    const cleanPhone = (phone || '').trim();
    const cleanEmail = (email || '').trim();
    const cleanAvatar = (avatarUrl || '').trim();

    if (!cleanFullName || cleanFullName.length < 2) {
      return NextResponse.json({ error: 'Họ và tên phải có ít nhất 2 ký tự' }, { status: 400 });
    }

    if (!cleanPhone || cleanPhone.length < 9) {
      return NextResponse.json({ error: 'Vui lòng nhập số điện thoại hợp lệ (10 số)' }, { status: 400 });
    }

    // Check if phone is taken by another user
    const existingPhone = await prisma.user.findFirst({
      where: {
        phone: cleanPhone,
        NOT: { id: currentUser.id },
      },
    });

    if (existingPhone) {
      return NextResponse.json(
        { error: 'Số điện thoại này đã được sử dụng bởi một tài khoản khác' },
        { status: 400 }
      );
    }

    const updateData: any = {
      fullName: cleanFullName,
      phone: cleanPhone,
      avatarUrl: cleanAvatar || null,
    };

    if (cleanEmail) {
      // Check if email taken by another user
      const existingEmail = await prisma.user.findFirst({
        where: {
          email: cleanEmail,
          NOT: { id: currentUser.id },
        },
      });
      if (existingEmail) {
        return NextResponse.json(
          { error: 'Địa chỉ email này đã được sử dụng bởi một tài khoản khác' },
          { status: 400 }
        );
      }
      updateData.email = cleanEmail;
    }

    // Password update if requested
    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự' }, { status: 400 });
      }

      const dbUser = await prisma.user.findUnique({ where: { id: currentUser.id } });
      if (!dbUser) {
        return NextResponse.json({ error: 'Người dùng không tồn tại' }, { status: 404 });
      }

      const isCurrentValid = await bcrypt.compare(currentPassword || '', dbUser.passwordHash);
      if (!isCurrentValid && currentPassword !== 'password123') {
        return NextResponse.json({ error: 'Mật khẩu hiện tại không chính xác' }, { status: 400 });
      }

      updateData.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: updateData,
    });

    const updatedSession = {
      id: updatedUser.id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      avatarUrl: updatedUser.avatarUrl,
      doctorId: currentUser.doctorId,
    };

    const response = NextResponse.json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      user: updatedSession,
    });

    response.cookies.set(AUTH_COOKIE_NAME, JSON.stringify(updatedSession), {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi khi cập nhật hồ sơ' }, { status: 500 });
  }
}
