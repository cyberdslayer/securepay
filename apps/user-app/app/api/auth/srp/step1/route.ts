import { NextRequest, NextResponse } from "next/server";
import db from "@repo/db/client";
import * as srp from 'secure-remote-password/server';

export async function POST(req: NextRequest) {
  try {
    console.log("SRP Step 1 request received, attempting to parse body...");
    
    // Use direct JSON parsing to avoid NextRequest body limitations
    const rawBody = await req.text();
    console.log("Raw request body length:", rawBody.length);
    
    let body;
    try {
      body = JSON.parse(rawBody);
      console.log("Parsed request body successfully");
    } catch (err) {
      console.error("Failed to parse request JSON:", err);
      return NextResponse.json({
        error: "Invalid JSON in request body",
        rawBodyStart: rawBody ? rawBody.substring(0, 100) + "..." : "(empty)"
      }, { status: 400 });
    }
    
    const { phoneNumber, clientPublicEphemeral } = body;
    
    console.log("SRP Step 1 parsed values:", { 
      phoneNumber, 
      hasClientPublicEphemeral: !!clientPublicEphemeral,
      clientPublicEphemeralLength: clientPublicEphemeral ? clientPublicEphemeral.length : 0 
    });
    
    if (!phoneNumber) {
      console.log("Missing phone number");
      return NextResponse.json({
        error: "Phone number is required"
      }, { status: 400 });
    }
    
    if (!clientPublicEphemeral) {
      console.log("Missing client public ephemeral");
      return NextResponse.json({
        error: "Client public ephemeral is required"
      }, { status: 400 });
    }
    
    // Find user by phone number
    const user = await db.user.findFirst({
      where: {
        number: phoneNumber
      }
    });
    
    if (!user || !user.srpSalt || !user.srpVerifier) {
      // Important: Don't reveal whether user exists or not for security
      console.log(`User validation failed: exists=${!!user}, hasSalt=${!!user?.srpSalt}, hasVerifier=${!!user?.srpVerifier}`);
      return NextResponse.json({
        error: "Authentication failed"
      }, { status: 401 });
    }
    
    console.log(`User found with salt (length: ${user.srpSalt.length}) and verifier (length: ${user.srpVerifier.length})`);
    
    // Generate server ephemeral
    try {
      const serverEphemeral = srp.generateEphemeral(user.srpVerifier);
      console.log("Generated server ephemeral, public length:", serverEphemeral.public.length);
      
      // Store session data for Step 2
      const sessionData = {
        userId: user.id,
        phoneNumber,
        serverSecretEphemeral: serverEphemeral.secret,
        clientPublicEphemeral,
        salt: user.srpSalt,
        verifier: user.srpVerifier
      };
      
      // For simplicity in this example, we'll encode the session data as base64
      const sessionToken = Buffer.from(JSON.stringify(sessionData)).toString('base64');
      
      console.log("SRP Step 1 completed successfully");
      
      return NextResponse.json({
        success: true,
        serverPublicEphemeral: serverEphemeral.public,
        salt: user.srpSalt,
        userId: user.id,
        sessionToken
      });
    } catch (srpError) {
      console.error("SRP error generating server ephemeral:", srpError);
      return NextResponse.json({
        error: "SRP authentication failed",
        details: srpError instanceof Error ? srpError.message : String(srpError)
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("SRP Step 1 error:", error);
    return NextResponse.json({
      error: "Authentication process failed",
      details: error.message || String(error)
    }, { status: 500 });
  }
}