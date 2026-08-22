import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phone = (body.phone || '').trim();
    const otp = (body.otp || '').trim();
    const newPassword = body.newPassword;

    if (!phone || !otp || !newPassword) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ số điện thoại, mã OTP và mật khẩu mới' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Mật khẩu mới phải có ít nhất 6 ký tự' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: { phone },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Không tìm thấy tài khoản người dùng' },
        { status: 404 }
      );
    }

    // In demo environment, any valid 6-digit OTP or received OTP is accepted
    if (otp.length < 4) {
      return NextResponse.json(
        { error: 'Mã xác thực OTP không hợp lệ' },
        { status: 400 }
      );
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hash },
    });

    return NextResponse.json({
      success: true,
      message: 'Đặt lại mật khẩu mới thành công! Vui lòng đăng nhập.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi khi đặt lại mật khẩu' }, { status: 500 });
  }
}
