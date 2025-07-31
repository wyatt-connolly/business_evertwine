'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FaGoogle, FaPhone } from 'react-icons/fa';
import { ConfirmationResult } from 'firebase/auth';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface LoginFormProps {
  onToggleMode: () => void;
  isLogin: boolean;
}

type AuthMode = 'email' | 'phone' | 'verify-phone';

export default function LoginForm({ onToggleMode, isLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('email');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  
  const { signIn, signUp, signInWithGoogle, signInWithPhone, confirmPhoneSignIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authMode === 'email') {
      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }
      
      try {
        setError('');
        setLoading(true);
        
        if (isLogin) {
          await signIn(email, password);
        } else {
          await signUp(email, password, displayName);
        }
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      }
      
      setLoading(false);
    } else if (authMode === 'phone') {
      if (!phoneNumber) {
        setError('Please enter a phone number');
        return;
      }
      
      try {
        setError('');
        setLoading(true);
        const result = await signInWithPhone(phoneNumber);
        setConfirmationResult(result);
        setAuthMode('verify-phone');
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'Failed to send verification code');
      }
      
      setLoading(false);
    } else if (authMode === 'verify-phone') {
      if (!verificationCode || !confirmationResult) {
        setError('Please enter the verification code');
        return;
      }
      
      try {
        setError('');
        setLoading(true);
        await confirmPhoneSignIn(confirmationResult, verificationCode);
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'Invalid verification code');
      }
      
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Google sign in failed');
    }
    setLoading(false);
  };

  const handleTestLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await signIn('test@example.com', 'password123');
    } catch (error: unknown) {
      setError('Test login failed. You may need to create the test account first.');
    }
    setLoading(false);
  };

  const resetForm = () => {
    setAuthMode('email');
    setConfirmationResult(null);
    setError('');
    setVerificationCode('');
    setPhoneNumber('');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">
          {authMode === 'verify-phone' 
            ? 'Verify Phone Number'
            : isLogin ? 'Sign In' : 'Create Account'
          }
        </CardTitle>
        <CardDescription className="text-center">
          {authMode === 'verify-phone'
            ? 'Enter the verification code sent to your phone'
            : authMode === 'phone'
            ? 'Enter your phone number to receive a verification code'
            : isLogin 
            ? 'Enter your credentials to sign in' 
            : 'Create an account to get started'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {authMode === 'email' && (
          <>
            {/* Google Sign In */}
            <Button
              type="button"
              variant="outline"
              className="w-full mb-4"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <FaGoogle className="w-4 h-4 mr-2" />
              Continue with Google
            </Button>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Auth Method Selector */}
            <div className="flex space-x-2 mb-4">
              <Button
                type="button"
                variant={authMode === 'email' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setAuthMode('email')}
                disabled={loading}
              >
                Email
              </Button>
              <Button
                type="button"
                variant={'outline'}
                className="flex-1"
                onClick={() => setAuthMode('phone')}
                disabled={loading}
              >
                <FaPhone className="w-3 h-3 mr-2" />
                Phone
              </Button>
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'email' && (
            <>
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Your name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    disabled={loading}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </>
          )}

          {authMode === 'phone' && (
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <PhoneInput
                id="phone"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(value) => setPhoneNumber(value || '')}
                defaultCountry="US"
                disabled={loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {/* Recaptcha container */}
              <div id="recaptcha-container" className="mt-2"></div>
            </div>
          )}

          {authMode === 'verify-phone' && (
            <div className="space-y-2">
              <Label htmlFor="verificationCode">Verification Code</Label>
              <Input
                id="verificationCode"
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                disabled={loading}
                maxLength={6}
              />
            </div>
          )}
          
          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Loading...' : 
             authMode === 'verify-phone' ? 'Verify Code' :
             authMode === 'phone' ? 'Send Code' :
             (isLogin ? 'Sign In' : 'Create Account')}
          </Button>
          
          {authMode === 'email' && isLogin && (
            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              onClick={handleTestLogin}
              disabled={loading}
            >
              Test Login
            </Button>
          )}

          {authMode === 'verify-phone' && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={resetForm}
              disabled={loading}
            >
              Back to Sign In
            </Button>
          )}
        </form>
        
        {authMode === 'email' && (
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={onToggleMode}
              disabled={loading}
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Sign in'
              }
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
