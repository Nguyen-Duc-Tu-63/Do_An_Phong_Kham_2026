import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phone = (body.phone || '').trim();

    if (!phone || phone.length < 9) {
      return NextResponse.json(
        { error: 'Vui lòng nhập số điện thoại hợp lệ (10 số)' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: { phone },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Không tìm thấy tài khoản nào gắn với số điện thoại này' },
        { status: 404 }
      );
    }

    // Generate simulated 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    return NextResponse.json({
      success: true,
      phone,
      otp, // Return OTP for demo simulation
      message: `Mã OTP xác thực đặt lại mật khẩu đã được gửi đến số điện thoại ${phone}`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi khi gửi mã xác thực' }, { status: 500 });
  }
}
