import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import mongoose from 'mongoose';

const RecruitSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    // Add unique index for faster lookups, although the logic handles duplicates
    index: true,
    // Keep validation here
    match: [/^[a-zA-Z0-9._%+-]+@(ds|es)\.study\.iitm\.ac\.in$/i, 'Invalid email format. Must be an IITM email.']
  },
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
  // Add timestamps for better tracking of creation and updates
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }, // Automatically updated by timestamps option or manually
});

// Add timestamps option to automatically handle createdAt and updatedAt
// Or handle updatedAt manually in the update operation if needed
RecruitSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});


const Recruit = mongoose.models.Recruit || mongoose.model('Recruit', RecruitSchema);

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();

    // --- Basic Validation ---
    // Email is crucial for lookup, ensure it exists and is valid format
    if (!data.email) {
        return NextResponse.json(
            { success: false, error: "Email is required." },
            { status: 400 }
        );
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(ds|es)\.study\.iitm\.ac\.in$/i;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format. Must be an IITM email." },
        { status: 400 }
      );
    }

    // Validate other required fields before hitting the db (optional but good practice)
    const requiredFields = ['fullName', 'degreeType', 'year', 'house', 'experience', 'timeCommitment'];
    for (const field of requiredFields) {
      if (!data[field]) {
        // Mongoose validation will catch this too, but early exit can be clearer
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    // --- End Basic Validation ---


    // --- Upsert Logic ---
    // Find a document with the matching email and update it.
    // If no document is found, create a new one (upsert: true).
    const result = await Recruit.findOneAndUpdate(
      { email: data.email }, // Filter: find the document by email
      {
        ...data, // Update: set the fields using the incoming data
        updatedAt: new Date() // Explicitly set updatedAt on update/upsert
      },
      {
        upsert: true, // << If doc doesn't exist, insert it
        new: true, // << Return the modified document (or new one) rather than the original
        runValidators: true, // << Ensure schema validations are run during update
        setDefaultsOnInsert: true // << Apply schema defaults if inserting
      }
    );
    // --- End Upsert Logic ---

    // result will contain the updated or newly created document if successful

    return NextResponse.json({ success: true, message: "Application submitted/updated successfully." });

  } catch (error: any) {
    // Handle potential validation errors from Mongoose specifically
    if (error instanceof mongoose.Error.ValidationError) {
        console.error("Validation Error:", error.errors);
        // You can extract specific field errors if needed
        const messages = Object.values(error.errors).map(e => e.message);
        return NextResponse.json(
            { success: false, error: "Validation failed.", details: messages },
            { status: 400 }
        );
    }

    // Generic error handling
    console.error("Recruit form submission/update error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while processing your application." },
      { status: 500 }
    );
  }
}