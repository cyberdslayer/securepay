import { NextRequest, NextResponse } from "next/server";
import db from "@repo/db/client";
import * as srp from 'secure-remote-password/server';

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    const { sessionToken, clientProof } = body;
    
    if (!sessionToken || !clientProof) {
      return NextResponse.json({
        error: "Missing required fields",
        received: {
          sessionToken: !!sessionToken,
          clientProof: !!clientProof
        }
      }, { status: 400 });
    }
    
    // Decode session data
    let sessionData;
    try {
      const decodedData = Buffer.from(sessionToken, 'base64').toString();
      sessionData = JSON.parse(decodedData);
    } catch (e) {
      console.error("Invalid session token:", e);
      return NextResponse.json({ error: "Invalid session token" }, { status: 401 });
    }
    
    // Extract session variables
    const {
      userId,
      phoneNumber,
      serverSecretEphemeral,
      clientPublicEphemeral,
      salt,
      verifier
    } = sessionData;
    
    if (!userId || !serverSecretEphemeral || !clientPublicEphemeral || !salt || !verifier) {
      return NextResponse.json({ error: "Invalid session data" }, { status: 401 });
    }
    
    try {
      // Calculate server session key
      const serverSession = srp.deriveSession(
        serverSecretEphemeral,
        clientPublicEphemeral,
        salt,
        phoneNumber,
        verifier,
        clientProof
      );
      
      // Return server proof for client verification
      return NextResponse.json({
        success: true,
        userId,
        phoneNumber,
        serverProof: serverSession.proof
      });
    } catch (error) {
      // If verification fails, the deriveSession function will throw
      console.error("SRP verification failed:", error);
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }
  } catch (error: any) {
    console.error("SRP Step 2 error:", error);
    return NextResponse.json({
      error: "Authentication process failed",
      details: error.message || String(error)
    }, { status: 500 });
  }
}