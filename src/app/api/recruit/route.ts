import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import mongoose from 'mongoose';

const RecruitSchema = new mongoose.Schema({
  email: { type: String, required: true },
  fullName: { type: String, required: true },
  degreeType: { type: String, required: true },
  year: { type: String, required: true },
  house: { type: String, required: true },
  linkedin: String,
  github: String,
  domains: [String],
  domainWhy: String,
  teams: [String],
  teamWhy: String,
  experience: { type: String, required: true },
  motivation: String,
  timeCommitment: { type: String, required: true },
  interviewDates: [String],
  interviewTimes: [String],
  additionalInfo: String,
  createdAt: { type: Date, default: Date.now },
});

const Recruit = mongoose.models.Recruit || mongoose.model('Recruit', RecruitSchema);

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();
    await Recruit.create(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
