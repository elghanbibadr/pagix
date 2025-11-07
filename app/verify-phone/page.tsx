'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

export default function VerifyPhonePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const phoneNumber = searchParams.get('phone') || ''
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!otp || otp.length < 6) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter a 6-digit code',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/verify-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otp }),
      })

      if (!response.ok) {
        throw new Error('Verification failed')
      }

      toast({
        title: 'Success!',
        description: 'Phone number verified successfully',
      })
      
      router.push('/dashboard')
    } catch (error) {
      toast({
        title: 'Verification failed',
        description: 'Invalid OTP. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return

    try {
      const response = await fetch('/api/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      })

      if (!response.ok) {
        throw new Error('Resend failed')
      }

      toast({
        title: 'OTP sent',
        description: 'A new code has been sent to your phone',
      })

      setResendCooldown(60)
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to resend OTP',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle>Verify Your Phone Number</CardTitle>
          <CardDescription>
            We've sent a 6-digit code to {phoneNumber}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm font-medium">
                Verification Code
              </label>
              <Input
                id="otp"
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="text-center text-lg tracking-widest"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || otp.length < 6}
              className="w-full"
            >
              {isLoading ? 'Verifying...' : 'Verify Phone'}
            </Button>

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground text-center">
                Didn't receive the code?
              </p>
              <Button
                type="button"
                variant="ghost"
                onClick={handleResendOTP}
                disabled={resendCooldown > 0}
                className="w-full text-xs"
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : 'Resend Code'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}