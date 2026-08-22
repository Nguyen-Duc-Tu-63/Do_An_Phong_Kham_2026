import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { appointmentId, symptoms, diagnosis, notes, prescriptions } = body;

    if (!appointmentId || !symptoms || !diagnosis) {
      return NextResponse.json(
        { error: 'appointmentId, symptoms, and diagnosis are required' },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    if (!appointment.doctorId) {
      return NextResponse.json({ error: 'Appointment does not have an assigned doctor' }, { status: 400 });
    }

    // 1. Create Medical Record
    const record = await prisma.medicalRecord.create({
      data: {
        appointmentId: appointment.id,
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        symptoms,
        diagnosis,
        notes: notes || null,
      },
    });

    // 2. Create Prescriptions if provided
    if (prescriptions && Array.isArray(prescriptions) && prescriptions.length > 0) {
      await prisma.prescription.createMany({
        data: prescriptions.map((p: any) => ({
          medicalRecordId: record.id,
          medicineName: p.medicineName,
          dosage: p.dosage,
          frequency: p.frequency,
          duration: p.duration,
          notes: p.notes || null,
        })),
      });
    }

    // 3. Mark appointment as COMPLETED
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'COMPLETED' },
    });

    // 4. Return complete record with prescriptions
    const completeRecord = await prisma.medicalRecord.findUnique({
      where: { id: record.id },
      include: {
        prescriptions: true,
        doctor: { include: { user: true, specialty: true } },
        patient: true,
      },
    });

    return NextResponse.json(completeRecord, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
