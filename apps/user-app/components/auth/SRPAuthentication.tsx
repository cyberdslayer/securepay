import { useState, useEffect } from 'react';
import { SRPClient } from 'fast-srp-hap';
import { useRouter } from 'next/navigation';

interface SRPAuthenticationProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function SRPAuthentication({ onSuccess, onError }: SRPAuthenticationProps) {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'init' | 'challenge'>('init');
  const [userId, setUserId] = useState<number | null>(null);
  const [srpClientData, setSrpClientData] = useState<any>(null);

  // Step 1: Initialize SRP authentication
  const initiateAuthentication = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || !password) {
      onError?.('Please enter both phone number and password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create SRP client with user credentials
      const srpClient = new SRPClient(phoneNumber, password);
      setSrpClientData(srpClient);
      
      // Generate client public key
      const clientPublicKey = srpClient.getPublicKey();
      
      // Send the public key to server to initiate SRP authentication
      const response = await fetch('/api/auth/srp/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          clientPublicKey: clientPublicKey.toString('hex'),
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to initiate authentication');
      }
      
      // Save userId and salt for the next step
      setUserId(data.userId);
      
      // Set salt and server public key for SRP client
      srpClient.setSalt(Buffer.from(data.salt, 'hex'));
      srpClient.setServerPublicKey(Buffer.from(data.serverPublicKey, 'hex'));
      
      // Move to challenge step
      setStep('challenge');
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Step 2: Complete SRP authentication with proof
  const completeAuthentication = async () => {
    if (!srpClientData || !userId) {
      onError?.('Authentication session invalid');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Generate proof using SRP client
      const clientProof = srpClientData.getProof().toString('hex');
      
      const response = await fetch('/api/auth/srp/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          phoneNumber,
          clientProof,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to verify authentication');
      }
      
      // Verify server proof
      const serverProof = Buffer.from(data.serverProof, 'hex');
      
      if (!srpClientData.verifyServerProof(serverProof)) {
        throw new Error('Server verification failed');
      }
      
      // Authentication successful, call sign-in endpoint with verified credentials
      await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          phoneNumber,
          srpVerified: true,
        }),
      });
      
      onSuccess?.();
      router.push('/dashboard');
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Verification failed');
      // Reset to initial step on failure
      setStep('init');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Auto-proceed to challenge completion once initialized
  useEffect(() => {
    if (step === 'challenge') {
      completeAuthentication();
    }
  }, [step]);

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={initiateAuthentication} className="space-y-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter your phone number"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
            disabled={isLoading || step === 'challenge'}
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
            disabled={isLoading || step === 'challenge'}
            required
          />
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isLoading || step === 'challenge'}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {step === 'init' ? 'Signing In...' : 'Verifying...'}
              </span>
            ) : (
              'Sign In Securely'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}