import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import mongoose from 'mongoose';

const RecruitSchema = new mongoose.Schema({
  email: { type: String, required: true }, // No unique constraint
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
    
    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(ds|es)\.study\.iitm\.ac\.in$/i;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format. Must be an IITM email." },
        { status: 400 }
      );
    }
    
    // Optional: Check for existing submission with this email
    // Since we're allowing multiple submissions, this is just for user information
    const existingByEmail = await Recruit.findOne({ email: data.email });
    if (existingByEmail) {
      console.log(`Duplicate submission from email: ${data.email}`);
      // We're still allowing the submission to proceed
    }
    
    // Validate required fields
    const requiredFields = ['fullName', 'degreeType', 'year', 'house', 'experience', 'timeCommitment'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Create the record
    await Recruit.create(data);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    // Generic error handling
    console.error("Recruit form submission error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while processing your application." },
      { status: 500 }
    );
  }
}