"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import srp from "secure-remote-password/client";
import { Input } from "../../../../../packages/ui/src/Input";
import { Button } from "@repo/ui/button";

export default function SignInPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debug, setDebug] = useState<any>(null);

  // Add a new function to test API connectivity
  const testApiConnection = async () => {
    setLoading(true);
    setError("");
    setDebug(null);
    
    try {
      // Test basic API endpoint
      const testResponse = await fetch("/api/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: "connection" })
      });
      
      const testResponseText = await testResponse.text();
      console.log("Test API response text:", testResponseText);
      
      try {
        const testData = JSON.parse(testResponseText);
        setDebug({ 
          testApiSuccess: true, 
          testEndpoint: '/api/test',
          response: testData
        });
      } catch (parseError) {
        console.error("Test API JSON parse error:", parseError);
        setDebug({ 
          testApiError: true,
          parseError: parseError instanceof Error ? parseError.message : "Unknown error",
          responseText: testResponseText.substring(0, 500) + (testResponseText.length > 500 ? '...(truncated)' : '')
        });
      }
    } catch (error) {
      console.error("Test API error:", error);
      setDebug({
        testApiError: true,
        errorMessage: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to handle traditional login
  const handleTraditionalLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        phone: phoneNumber,
        password: password
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle SRP registration
  const handleSrpRegister = async () => {
    setLoading(true);
    setError("");
    setDebug(null);

    console.log("Starting registration with phone:", phoneNumber);

    if (!phoneNumber || phoneNumber.trim() === '') {
      setError("Phone number is required");
      setLoading(false);
      return;
    }

    if (!password || password.trim() === '') {
      setError("Password is required");
      setLoading(false);
      return;
    }

    try {
      // Generate SRP credentials - only show partial values to avoid exposing sensitive data
      console.log("Generating SRP credentials...");
      const salt = srp.generateSalt();
      console.log(`Generated salt (${salt.length} chars)`);
      
      const privateKey = srp.derivePrivateKey(salt, phoneNumber, password);
      console.log("Generated private key");
      
      const verifier = srp.deriveVerifier(privateKey);
      console.log(`Generated verifier (${verifier.length} chars)`);

      console.log("Sending registration request...");
      
      // Register with the server using a simple direct fetch instead of custom fetch
      const response = await fetch("/api/auth/srp/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber,
          name,
          salt,
          verifier
        })
      });

      let responseText;
      try {
        responseText = await response.text();
        console.log("Raw response:", responseText.substring(0, 100) + (responseText.length > 100 ? "..." : ""));
      } catch (err) {
        console.error("Failed to read response text:", err);
        throw new Error("Failed to read server response");
      }
      
      let data;
      try {
        data = JSON.parse(responseText);
        setDebug(data);
      } catch (parseErr) {
        console.error("Failed to parse response as JSON:", parseErr);
        console.error("Response text was:", responseText.substring(0, 500));
        setDebug({ 
          parseError: parseErr instanceof Error ? parseErr.message : String(parseErr), 
          responseText: responseText.substring(0, 500) + (responseText.length > 500 ? "..." : "") 
        });
        throw new Error("Server returned invalid JSON");
      }

      if (!response.ok) {
        console.error("API error:", {
          status: response.status,
          statusText: response.statusText,
          data
        });
        throw new Error(data.error || "Registration failed");
      }

      console.log("Registration successful!");
      setIsRegistering(false);
      setError("");
      alert("SRP registration successful! You can now log in.");
    } catch (error) {
      console.error("Registration failed:", error);
      setError(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle SRP authentication
  const handleSrpLogin = async () => {
    setLoading(true);
    setError("");
    setDebug(null);

    try {
      if (!phoneNumber) {
        setError("Phone number is required");
        setLoading(false);
        return;
      }

      if (!password) {
        setError("Password is required");
        setLoading(false);
        return;
      }

      // Step 1: Generate client ephemeral using SRP
      console.log("Starting SRP login with phone:", phoneNumber);
      
      // Generate fresh client ephemeral
      const clientEphemeral = srp.generateEphemeral();
      console.log("Generated client ephemeral public:", clientEphemeral.public);
      console.log("Client ephemeral public length:", clientEphemeral.public.length);
      
      if (!clientEphemeral.public || clientEphemeral.public.length === 0) {
        throw new Error("Failed to generate client ephemeral");
      }
      
      // Create request payload
      const requestPayload = {
        phoneNumber: phoneNumber,
        clientPublicEphemeral: clientEphemeral.public
      };
      
      // Log the full request before sending
      const requestJson = JSON.stringify(requestPayload);
      console.log("Full request payload length:", requestJson.length);
      console.log("Request payload sample:", requestJson.substring(0, 100) + "...");

      // Request salt and server ephemeral from server
      const step1Response = await fetch("/api/auth/srp/step1", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: requestJson
      });

      let step1Data;
      try {
        const responseText = await step1Response.text();
        console.log("Step1 response status:", step1Response.status);
        console.log("Step1 response text:", responseText.substring(0, 100) + (responseText.length > 100 ? "..." : ""));
        
        if (!step1Response.ok) {
          setDebug({
            error: true,
            status: step1Response.status,
            response: responseText
          });
          throw new Error(responseText || "SRP authentication failed at step 1");
        }
        
        step1Data = JSON.parse(responseText);
        setDebug({step1: step1Data});
      } catch (parseErr) {
        console.error("Failed to parse step1 response:", parseErr);
        throw new Error("Server returned invalid JSON");
      }

      // Rest of the function remains the same
      const { salt, serverPublicEphemeral, userId, sessionToken } = step1Data;

      // Step 2: Generate client session and proof
      const privateKey = srp.derivePrivateKey(salt, phoneNumber, password);
      const clientSession = srp.deriveSession(
        clientEphemeral.secret,
        serverPublicEphemeral,
        salt,
        phoneNumber,
        privateKey
      );

      // Send client proof to server
      const step2Response = await fetch("/api/auth/srp/step2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionToken,
          clientProof: clientSession.proof
        })
      });

      let step2Data;
      try {
        const responseText = await step2Response.text();
        console.log("Step2 response text:", responseText.substring(0, 100) + (responseText.length > 100 ? "..." : ""));
        step2Data = JSON.parse(responseText);
        setDebug(prev => ({...prev, step2: step2Data}));
      } catch (parseErr) {
        console.error("Failed to parse step2 response:", parseErr);
        throw new Error("Server returned invalid JSON");
      }

      if (!step2Response.ok) {
        throw new Error(step2Data.error || "SRP authentication failed at step 2");
      }

      // Verify server proof
      try {
        srp.verifySession(clientEphemeral.public, clientSession, step2Data.serverProof);
        console.log("Server proof verified successfully");
      } catch (error) {
        console.error("Server proof verification failed:", error);
        throw new Error("Server verification failed");
      }

      // If we get here, SRP was successful - now sign in with NextAuth
      const result = await signIn("srp", {
        redirect: false,
        phoneNumber: step2Data.phoneNumber,
        userId: step2Data.userId,
        clientProof: clientSession.proof
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("SRP login error:", error);
      setError(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isRegistering ? "Create an account" : "Sign in to your account"}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1">
                <Input
                  id="phoneNumber"
                  type="string"
                  value={phoneNumber}
                  onChange={(e) => {
                    console.log("Phone input changed:", e.target.value);
                    setPhoneNumber(e.target.value);
                  }}
                  required
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {isRegistering && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name (Optional)
                </label>
                <div className="mt-1">
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <div className="flex flex-col space-y-3">
              {isRegistering ? (
                <Button
                  onClick={() => {
                    console.log("Register button clicked, phone:", phoneNumber);
                    handleSrpRegister();
                  }}
                  // disabled={loading}
                  // className="w-full"
                >
                  {loading ? "Registering..." : "Register with SRP"}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleSrpLogin}
                    // disabled={loading}
                    // className="w-full"
                  >
                    {loading ? "Processing..." : "Sign in with SRP"}
                  </Button>
                  <Button
                    onClick={handleTraditionalLogin}
                    // disabled={loading}
                    // className="w-full"
                    // variant="outline"
                  >
                    {loading ? "Processing..." : "Sign in with traditional method"}
                  </Button>
                </>
              )}

              <Button
                onClick={() => setIsRegistering(!isRegistering)}
              >
                {isRegistering
                  ? "Already have an account? Sign in"
                  : "Need an account? Register with SRP"}
              </Button>

              <Button
                onClick={testApiConnection}
                // className="w-full"
                // variant="outline"
              >
                Test API Connection
              </Button>
            </div>

            {debug && (
              <div className="mt-4 p-2 bg-gray-100 rounded">
                <p className="text-xs font-mono">Debug info:</p>
                <pre className="text-xs font-mono overflow-auto max-h-40">
                  {JSON.stringify(debug, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}