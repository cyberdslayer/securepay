import { NextRequest, NextResponse } from "next/server";
import db from "@repo/db/client";

export async function POST(req: NextRequest) {
  try {
    // Get raw request body for debugging
    const rawBody = await req.text();
    console.log("Raw register request body length:", rawBody.length);
    
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (err) {
      console.error("Failed to parse request JSON:", err);
      return NextResponse.json({
        error: "Invalid JSON in request body"
      }, { status: 400 });
    }
    
    const { phoneNumber, name, salt, verifier } = body;
    
    console.log("Register request values:", {
      phoneNumber: phoneNumber,
      name: name || "(none)",
      saltLength: salt ? salt.length : 0,
      verifierLength: verifier ? verifier.length : 0
    });
    
    if (!phoneNumber || !salt || !verifier) {
      const missingFields = [];
      if (!phoneNumber) missingFields.push("phoneNumber");
      if (!salt) missingFields.push("salt");
      if (!verifier) missingFields.push("verifier");
      
      return NextResponse.json({
        error: "Missing required fields: " + missingFields.join(", ")
      }, { status: 400 });
    }
    
    try {
      // Check if user exists
      const existingUser = await db.user.findFirst({
        where: {
          number: phoneNumber
        }
      });

      if (existingUser) {
        // Update the existing user with SRP credentials
        const updatedUser = await db.user.update({
          where: { id: existingUser.id },
          data: {
            srpSalt: salt,
            srpVerifier: verifier,
            name: name || existingUser.name // Keep existing name if not provided
          }
        });
        
        console.log(`Updated user ${updatedUser.id} with SRP credentials`);
        
        return NextResponse.json({
          success: true,
          message: "User SRP credentials updated",
          userId: updatedUser.id
        });
      } else {
        // Create new user
        const newUser = await db.user.create({
          data: {
            number: phoneNumber,
            name: name || null,
            srpSalt: salt,
            srpVerifier: verifier
          }
        });
        
        // Create balance record for new user
        await db.balance.create({
          data: {
            userId: newUser.id,
            amount: 0,
            locked: 0
          }
        });
        
        console.log(`Created new user ${newUser.id} with SRP credentials`);
        
        return NextResponse.json({
          success: true,
          message: "User registered successfully",
          userId: newUser.id
        });
      }
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({
        error: "Failed to register user",
        details: dbError instanceof Error ? dbError.message : String(dbError)
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({
      error: "Registration failed",
      details: error.message || String(error)
    }, { status: 500 });
  }
}