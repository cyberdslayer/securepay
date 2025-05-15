"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import srp from "secure-remote-password/client";
import { Input } from "../../../../../packages/ui/src/Input";
import { Button } from "@repo/ui/button";
import Image from "next/image";
import Link from "next/link";
import { FiLock, FiShield, FiUser, FiPhone, FiEye, FiEyeOff, FiArrowRight, FiAlertCircle } from "react-icons/fi";

export default function SignInPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [debug, setDebug] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(false); // For development only
  
  // Phone validation
  const [phoneValid, setPhoneValid] = useState<boolean | null>(null);
  const validatePhone = (value: string) => {
    // Basic validation - can be enhanced with country-specific formats
    const isValid = /^\+?[0-9]{10,15}$/.test(value);
    setPhoneValid(value ? isValid : null);
    return isValid;
  };
  
  // Password validation
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);
  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordStrength(null);
      return false;
    }
    
    if (value.length < 8) {
      setPasswordStrength('weak');
      return false;
    } else if (!/[A-Z]/.test(value) || !/[0-9]/.test(value) || !/[^A-Za-z0-9]/.test(value)) {
      setPasswordStrength('medium');
      return true;
    } else {
      setPasswordStrength('strong');
      return true;
    }
  };

  // Add a new function to test API connectivity (hidden in production)
  const testApiConnection = async () => {
    // Development code omitted for production build
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
      
      try {
        const testData = JSON.parse(testResponseText);
        setDebug({ 
          testApiSuccess: true, 
          testEndpoint: '/api/test',
          response: testData
        });
      } catch (parseError) {
        setDebug({ 
          testApiError: true,
          parseError: parseError instanceof Error ? parseError.message : "Unknown error",
          responseText: testResponseText.substring(0, 500) + (testResponseText.length > 500 ? '...(truncated)' : '')
        });
      }
    } catch (error) {
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
      if (!validatePhone(phoneNumber)) {
        setError("Please enter a valid phone number");
        setLoading(false);
        return;
      }

      if (!password) {
        setError("Password is required");
        setLoading(false);
        return;
      }

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

    if (!validatePhone(phoneNumber)) {
      setError("Please enter a valid phone number");
      setLoading(false);
      return;
    }

    if (!password || password.trim() === '') {
      setError("Password is required");
      setLoading(false);
      return;
    }
    
    if (passwordStrength === 'weak') {
      setError("Please choose a stronger password (minimum 8 characters)");
      setLoading(false);
      return;
    }

    try {
      // Generate SRP credentials
      const salt = srp.generateSalt();
      const privateKey = srp.derivePrivateKey(salt, phoneNumber, password);
      const verifier = srp.deriveVerifier(privateKey);

      // Register with the server
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
      } catch (err) {
        throw new Error("Failed to read server response");
      }
      
      let data;
      try {
        data = JSON.parse(responseText);
        if (showDebug) setDebug(data);
      } catch (parseErr) {
        if (showDebug) {
          setDebug({ 
            parseError: parseErr instanceof Error ? parseErr.message : String(parseErr), 
            responseText: responseText.substring(0, 500) + (responseText.length > 500 ? "..." : "") 
          });
        }
        throw new Error("Server returned invalid JSON");
      }

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setIsRegistering(false);
      setError("");
      
      // Show success notification
      const successMessage = document.getElementById('successNotification');
      if (successMessage) {
        successMessage.classList.remove('hidden');
        setTimeout(() => {
          successMessage.classList.add('hidden');
        }, 5000);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle SRP authentication
  const handleSrpLogin = async () => {
    setLoading(true);
    setError("");

    try {
      if (!validatePhone(phoneNumber)) {
        setError("Please enter a valid phone number");
        setLoading(false);
        return;
      }

      if (!password) {
        setError("Password is required");
        setLoading(false);
        return;
      }

      // Generate client ephemeral
      const clientEphemeral = srp.generateEphemeral();
      
      if (!clientEphemeral.public || clientEphemeral.public.length === 0) {
        throw new Error("Failed to generate client ephemeral");
      }
      
      // Create request payload
      const requestPayload = {
        phoneNumber: phoneNumber,
        clientPublicEphemeral: clientEphemeral.public
      };
      
      // Request salt and server ephemeral from server
      const step1Response = await fetch("/api/auth/srp/step1", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(requestPayload)
      });

      let step1Data;
      try {
        const responseText = await step1Response.text();
        
        if (!step1Response.ok) {
          if (showDebug) {
            setDebug({
              error: true,
              status: step1Response.status,
              response: responseText
            });
          }
          throw new Error(responseText || "Authentication failed");
        }
        
        step1Data = JSON.parse(responseText);
        if (showDebug) setDebug({step1: step1Data});
      } catch (parseErr) {
        throw new Error("Server returned invalid JSON");
      }

      const { salt, serverPublicEphemeral, userId, sessionToken } = step1Data;

      // Generate client session and proof
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
        step2Data = JSON.parse(responseText);
        if (showDebug) setDebug(prev => ({...prev, step2: step2Data}));
      } catch (parseErr) {
        throw new Error("Server returned invalid JSON");
      }

      if (!step2Response.ok) {
        throw new Error(step2Data.error || "Authentication failed");
      }

      // Verify server proof
      try {
        srp.verifySession(clientEphemeral.public, clientSession, step2Data.serverProof);
      } catch (error) {
        throw new Error("Server verification failed");
      }

      // Sign in with NextAuth
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
      setError(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle keypress for form submission
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (isRegistering) {
        handleSrpRegister();
      } else {
        handleSrpLogin();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Success notification */}
      <div id="successNotification" className="hidden fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50 transition-all duration-500 ease-in-out transform">
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Registration successful! You can now log in.</span>
        </div>
      </div>
      
      {/* Logo and branding header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 relative">
            <Image 
              src="/pana.png" 
              alt="PaySmart logo" 
              layout="fill" 
              objectFit="contain"
              priority 
            />
          </div>
        </div>
        <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
          {isRegistering ? "Create your PaySmart account" : "Welcome back"}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isRegistering 
            ? "Join thousands of users managing their finances securely" 
            : "Access your account securely with PaySmart"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10 border border-gray-100">
          {/* Form tabs */}
          <div className="mb-6 flex border-b border-gray-200">
            <button
              onClick={() => setIsRegistering(false)}
              className={`flex-1 py-3 text-center font-medium ${!isRegistering ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsRegistering(true)}
              className={`flex-1 py-3 text-center font-medium ${isRegistering ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
              Register
            </button>
          </div>

          <div className="space-y-6">
            {/* Phone number field */}
            <div className="space-y-1">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="text-gray-400" />
                </div>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    validatePhone(e.target.value);
                  }}
                  onBlur={() => validatePhone(phoneNumber)}
                  required
                  className={`pl-10 block w-full rounded-md ${
                    phoneValid === false ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' :
                    phoneValid === true ? 'border-green-300 focus:ring-green-500 focus:border-green-500' :
                    'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="e.g. +1 555 123 4567"
                  onKeyPress={handleKeyPress}
                />
                {phoneValid === false && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <FiAlertCircle className="text-red-500" />
                  </div>
                )}
              </div>
              {phoneValid === false && (
                <p className="mt-1 text-sm text-red-600">Please enter a valid phone number</p>
              )}
            </div>

            {/* Password field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                {!isRegistering && (
                  <div className="text-sm">
                    <Link href="/auth/reset-password" className="font-medium text-blue-600 hover:text-blue-500">
                      Forgot your password?
                    </Link>
                  </div>
                )}
              </div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                  required
                  className={`pl-10 pr-10 block w-full rounded-md ${
                    passwordStrength === 'weak' ? 'border-red-300 focus:ring-red-500 focus:border-red-500' :
                    passwordStrength === 'medium' ? 'border-yellow-300 focus:ring-yellow-500 focus:border-yellow-500' :
                    passwordStrength === 'strong' ? 'border-green-300 focus:ring-green-500 focus:border-green-500' :
                    'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="Enter your password"
                  onKeyPress={handleKeyPress}
                />
                <div 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 
                    <FiEyeOff className="text-gray-400 hover:text-gray-600" /> : 
                    <FiEye className="text-gray-400 hover:text-gray-600" />
                  }
                </div>
              </div>
              
              {/* Password strength indicator (only for registration) */}
              {isRegistering && password && (
                <div className="mt-2">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          passwordStrength === 'weak' ? 'bg-red-500 w-1/3' :
                          passwordStrength === 'medium' ? 'bg-yellow-500 w-2/3' :
                          passwordStrength === 'strong' ? 'bg-green-500 w-full' : ''
                        }`}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs">
                      {passwordStrength === 'weak' && "Weak"}
                      {passwordStrength === 'medium' && "Medium"}
                      {passwordStrength === 'strong' && "Strong"}
                    </span>
                  </div>
                  
                  {passwordStrength === 'weak' && (
                    <p className="mt-1 text-xs text-red-600">
                      Password must be at least 8 characters
                    </p>
                  )}
                  
                  {passwordStrength === 'medium' && (
                    <p className="mt-1 text-xs text-yellow-800">
                      Add uppercase letters, numbers, and special characters for a stronger password
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Name field (only for registration) */}
            {isRegistering && (
              <div className="space-y-1">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your full name"
                    onKeyPress={handleKeyPress}
                  />
                </div>
              </div>
            )}

            {/* Error messages */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div>
              <Button
                onClick={isRegistering ? handleSrpRegister : handleSrpLogin}
                disabled={loading}
                className="w-full flex justify-center py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    {isRegistering ? "Create Account" : "Sign In Securely"} 
                    <FiArrowRight className="ml-2" />
                  </div>
                )}
              </Button>
            </div>
            
            {/* Security indicators */}
            <div className="mt-4">
              <div className="flex items-center justify-center text-xs text-gray-500">
                <FiShield className="text-blue-500 mr-1" /> 
                <span>End-to-end encryption with Secure Remote Password protocol</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer section */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to PaySmart's <Link href="/terms" className="text-blue-600 hover:text-blue-500">Terms of Service</Link> and <Link href="/privacy" className="text-blue-600 hover:text-blue-500">Privacy Policy</Link>.
          </p>
          
          <div className="mt-4 flex justify-center space-x-4">
            <div className="flex items-center text-xs text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Bank-grade security</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Fast & secure</span>
            </div>
          </div>
        </div>
        
        {/* Debug section - only visible in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8">
            <button 
              onClick={() => setShowDebug(!showDebug)}
              className="text-xs text-gray-500 underline"
            >
              {showDebug ? "Hide" : "Show"} Debug Info
            </button>
            
            {showDebug && debug && (
              <div className="mt-2 p-2 bg-gray-100 rounded text-left">
                <p className="text-xs font-mono">Debug info:</p>
                <pre className="text-xs font-mono overflow-auto max-h-40">
                  {JSON.stringify(debug, null, 2)}
                </pre>
              </div>
            )}
            
            {showDebug && (
              <button 
                onClick={testApiConnection}
                className="mt-2 text-xs text-blue-600"
              >
                Test API Connection
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}