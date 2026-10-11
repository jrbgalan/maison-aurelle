import { NextRequest, NextResponse } from "next/server";

export interface AppointmentRecord {
  id: string;
  reference: string;
  patientName: string;
  email: string;
  phone: string;
  serviceName?: string;
  specialistName?: string;
  date?: string;
  time?: string;
  status: string;
  notes: string;
  createdAt: string;
}

// In-memory appointments cache for the portfolio demo session
const appointments: AppointmentRecord[] = [];

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const reference =
      body.reference || "MA-" + Date.now().toString(36).toUpperCase().slice(-6);

    const appointment: AppointmentRecord = {
      id: "apt_" + Date.now(),
      reference,
      patientName: body.patientName || body.name || "Guest",
      email: body.email,
      phone: body.phone || "",
      serviceName: body.serviceName,
      specialistName: body.specialistName || "First available",
      date: body.date,
      time: body.time,
      status: "Confirmed",
      notes: body.notes || "",
      createdAt: new Date().toISOString(),
    };

    appointments.push(appointment);

    return NextResponse.json({
      success: true,
      message: "Appointment reservation created successfully",
      appointment,
    });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record booking" },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    success: true,
    appointments,
  });
}

