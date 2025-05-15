"use client";

import React, { useState } from 'react';
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { TextInput } from "@repo/ui/textinput";
import * as srp from 'secure-remote-password/client';
import Link from 'next/link';

export default function SRPDemoPage() {
  // Form state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Demo state
  const [isRegistering, setIsRegistering] = useState(true);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // SRP protocol values
  const [srpValues, setSrpValues] = useState<{
    salt?: string;
    privateKey?: string;
    verifier?: string;
    clientEphemeral?: { secret: string; public: string };
    serverPublicEphemeral?: string;
    sessionKey?: string;
    clientProof?: string;
    serverProof?: string;
    userId?: number;
    sessionToken?: string;
  }>({});

  // Console logs for visualization
  const [logs, setLogs] = useState<Array<{ type: 'info' | 'error' | 'success'; message: string; timestamp: Date }>>([]);

  const addLog = (type: 'info' | 'error' | 'success', message: string) => {
    setLogs(prev => [...prev, { type, message, timestamp: new Date() }]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const resetDemo = () => {
    setStep(0);
    setSrpValues({});
    setError(null);
    setSuccess(null);
    clearLogs();
  };

  // Handle SRP registration
  const handleSrpRegister = async () => {
    resetDemo();
    setLoading(true);
    
    try {
      addLog('info', `Starting SRP registration for phone: ${phoneNumber}`);
      
      // Step 1: Generate salt, private key and verifier
      const salt = srp.generateSalt();
      addLog('info', `Generated salt: ${salt.substring(0, 16)}...`);
      
      const privateKey = srp.derivePrivateKey(salt, phoneNumber, password);
      addLog('info', `Derived private key: ${privateKey.substring(0, 16)}...`);
      
      const verifier = srp.deriveVerifier(privateKey);
      addLog('info', `Derived verifier: ${verifier.substring(0, 16)}...`);
      
      setSrpValues({ salt, privateKey, verifier });
      setStep(1);
      
      // Step 2: Send registration to server
      addLog('info', 'Sending registration data to server...');
      
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
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      addLog('success', `Registration successful! User ID: ${data.userId}`);
      setSrpValues(prev => ({ ...prev, userId: data.userId }));
      setStep(2);
      setSuccess('Registration successful! You can now proceed to login.');
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
      addLog('error', `Registration error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle SRP login
  const handleSrpLogin = async () => {
    resetDemo();
    setLoading(true);
    
    try {
      addLog('info', `Starting SRP login for phone: ${phoneNumber}`);
      
      // Step 1: Generate client ephemeral key pair
      const clientEphemeral = srp.generateEphemeral();
      addLog('info', `Generated client ephemeral: 
        Secret: ${clientEphemeral.secret.substring(0, 16)}...
        Public: ${clientEphemeral.public.substring(0, 16)}...`);
      
      setSrpValues({ clientEphemeral });
      setStep(1);
      
      // Step 2: Request salt and server ephemeral from server
      addLog('info', 'Requesting salt and server ephemeral...');
      
      const step1Response = await fetch("/api/auth/srp/step1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber,
          clientPublicEphemeral: clientEphemeral.public
        })
      });
      
      const step1Data = await step1Response.json();
      
      if (!step1Response.ok) {
        throw new Error(step1Data.error || 'Authentication failed at step 1');
      }
      
      const { 
        serverPublicEphemeral, 
        salt, 
        sessionToken,
        userId
      } = step1Data;
      
      addLog('success', `Received from server:
        Salt: ${salt.substring(0, 16)}...
        Server Public Ephemeral: ${serverPublicEphemeral.substring(0, 16)}...
        Session Token: ${sessionToken.substring(0, 16)}...
        User ID: ${userId}`);
      
      setSrpValues(prev => ({ 
        ...prev, 
        serverPublicEphemeral, 
        salt, 
        sessionToken,
        userId
      }));
      setStep(2);
      
      // Step 3: Compute session key and proof
      addLog('info', 'Computing client proof...');
      
      const privateKey = srp.derivePrivateKey(salt, phoneNumber, password);
      addLog('info', `Derived private key: ${privateKey.substring(0, 16)}...`);
      
      const clientSession = srp.deriveSession(
        clientEphemeral.secret,
        serverPublicEphemeral,
        salt,
        phoneNumber,
        privateKey
      );
      
      addLog('info', `Derived client session:
        Key: ${clientSession.key.substring(0, 16)}...
        Proof: ${clientSession.proof.substring(0, 16)}...`);
      
      setSrpValues(prev => ({ 
        ...prev, 
        privateKey,
        sessionKey: clientSession.key,
        clientProof: clientSession.proof
      }));
      setStep(3);
      
      // Step 4: Send client proof and verify server proof
      addLog('info', 'Sending client proof to server...');
      
      const step2Response = await fetch("/api/auth/srp/step2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionToken,
          clientProof: clientSession.proof
        })
      });
      
      const step2Data = await step2Response.json();
      
      if (!step2Response.ok) {
        throw new Error(step2Data.error || 'Authentication failed at step 2');
      }
      
      addLog('info', `Verifying server proof: ${step2Data.serverProof.substring(0, 16)}...`);
      
      // Verify server proof
      srp.verifySession(clientEphemeral.public, clientSession, step2Data.serverProof);
      
      addLog('success', 'Server verification successful!');
      setSrpValues(prev => ({ ...prev, serverProof: step2Data.serverProof }));
      setStep(4);
      
      setSuccess('Authentication successful! Server proof verified.');
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Authentication failed');
      addLog('error', `Authentication error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">SRP Authentication Demo</h1>
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800">
            Back to Dashboard
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column: Controls */}
          <div className="space-y-6">
            <Card title="SRP Authentication Controls">
              <div className="p-6 space-y-6">
                <div className="flex space-x-4">
                  <Button 
                    onClick={() => setIsRegistering(true)} 
                    className={`flex-1 py-2 ${isRegistering ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    Registration
                  </Button>
                  <Button 
                    onClick={() => setIsRegistering(false)} 
                    className={`flex-1 py-2 ${!isRegistering ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    Login
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <TextInput
                    label="Phone Number"
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    placeholder="999-999-9999"
                    disabled={loading}
                  />
                  
                  <TextInput
                    label="Password"
                    value={password}
                    onChange={setPassword}
                    placeholder="Password"
                    type="password"
                    disabled={loading}
                  />
                  
                  {isRegistering && (
                    <TextInput
                      label="Name"
                      value={name}
                      onChange={setName}
                      placeholder="Your Name"
                      disabled={loading}
                    />
                  )}
                  
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                      {error}
                    </div>
                  )}
                  
                  {success && (
                    <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded">
                      {success}
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <Button
                      onClick={isRegistering ? handleSrpRegister : handleSrpLogin}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-md"
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : isRegistering ? 'Register with SRP' : 'Login with SRP'}
                    </Button>
                  </div>
                  
                  <div className="text-center">
                    <button 
                      onClick={resetDemo} 
                      className="text-sm text-indigo-600 hover:underline"
                    >
                      Reset Demo
                    </button>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card title="SRP Protocol Steps">
              <div className="p-6">
                <div className="relative">
                  <div className="border-l-2 border-indigo-200 absolute h-full left-4 top-0"></div>
                  
                  <div className={`mb-6 ml-10 relative ${step >= 0 ? 'text-gray-800' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full absolute -left-10 top-0 flex items-center justify-center ${step >= 0 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>1</div>
                    <h3 className="font-medium">Initialization</h3>
                    <p className="text-sm">{isRegistering ? 'Generate salt and verifier from password' : 'Generate client ephemeral key pair'}</p>
                  </div>
                  
                  <div className={`mb-6 ml-10 relative ${step >= 1 ? 'text-gray-800' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full absolute -left-10 top-0 flex items-center justify-center ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>2</div>
                    <h3 className="font-medium">{isRegistering ? 'Registration' : 'Request Challenge'}</h3>
                    <p className="text-sm">{isRegistering ? 'Send salt and verifier to server' : 'Receive salt and server ephemeral'}</p>
                  </div>
                  
                  {!isRegistering && (
                    <>
                      <div className={`mb-6 ml-10 relative ${step >= 2 ? 'text-gray-800' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full absolute -left-10 top-0 flex items-center justify-center ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>3</div>
                        <h3 className="font-medium">Compute Proof</h3>
                        <p className="text-sm">Calculate session key and proof of password</p>
                      </div>
                      
                      <div className={`mb-6 ml-10 relative ${step >= 3 ? 'text-gray-800' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full absolute -left-10 top-0 flex items-center justify-center ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>4</div>
                        <h3 className="font-medium">Verification</h3>
                        <p className="text-sm">Verify server's proof and establish authenticated session</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </div>
          
          {/* Right column: SRP Demo Console */}
          <div className="space-y-6">
            <Card title="SRP Console">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Protocol Values</h3>
                  <button 
                    onClick={() => setSrpValues({})}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                </div>
                
                <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-xs overflow-auto h-64">
                  {Object.entries(srpValues).length > 0 ? (
                    <pre>{JSON.stringify(srpValues, (key, value) => {
                      // Truncate long strings for better display
                      if (typeof value === 'string' && value.length > 40) {
                        return value.substring(0, 20) + '...' + value.substring(value.length - 20);
                      }
                      return value;
                    }, 2)}</pre>
                  ) : (
                    <div className="text-gray-500 italic">No SRP values generated yet.</div>
                  )}
                </div>
              </div>
            </Card>
            
            <Card title="Log Console">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Operation Log</h3>
                  <button 
                    onClick={clearLogs}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                </div>
                
                <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-xs overflow-auto h-96">
                  {logs.length > 0 ? (
                    <div className="space-y-2">
                      {logs.map((log, i) => (
                        <div key={i} className={`
                          ${log.type === 'error' ? 'text-red-400' : 
                            log.type === 'success' ? 'text-green-400' : 'text-blue-300'}
                        `}>
                          <span className="text-gray-500">
                            [{log.timestamp.toLocaleTimeString()}]
                          </span> {log.message}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 italic">No logs yet.</div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">About SRP Authentication</h2>
            <p className="text-gray-700 mb-4">
              Secure Remote Password (SRP) is a password-authenticated key exchange protocol that allows secure authentication
              without sending the password over the network, even over insecure channels.
            </p>
            <p className="text-gray-700 mb-4">
              Key benefits of SRP include:
            </p>
            <ul className="list-disc list-inside text-left text-gray-700 mb-4">
              <li>The server never stores your actual password</li>
              <li>The password is never transmitted over the network</li>
              <li>Resistant to dictionary attacks, man-in-the-middle attacks, and replay attacks</li>
              <li>Provides mutual authentication - both client and server verify each other</li>
            </ul>
            <p className="text-gray-700">
              This demo visualizes each step of the SRP protocol for educational purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}