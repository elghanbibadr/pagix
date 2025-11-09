'use client'

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { verifyPhoneCode, resendVerificationCode } from "../actions/actions"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

function VerifyPhoneContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') || ''
  const smsError = searchParams.get('sms_error') === 'true'
  
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (smsError) {
      toast.error("Failed to send SMS. Please try resending.")
    }
  }, [smsError])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const code = formData.get('code') as string

    try {
      const result = await verifyPhoneCode(code)

      if (!result.success) {
        toast.error(result.error || "Verification failed")
      } else {
        toast.success("Phone verified successfully! Welcome to Pagix!")
        // Redirect to dashboard instead of email confirmation
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      }
    } catch (err: any) {
      toast.error("Something went wrong!")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (countdown > 0) return
    
    setResending(true)

    try {
      const result = await resendVerificationCode(phone)

      if (!result.success) {
        toast.error(result.error || "Failed to resend code")
      } else {
        toast.success("Verification code resent!")
        setCountdown(60) // 60 second cooldown
      }
    } catch (err: any) {
      toast.error("Something went wrong!")
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link href="/signup" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to signup
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">P</span>
            </div>
            <span className="text-xl font-bold">Pagix</span>
          </div>

          <h1 className="text-3xl font-bold mb-2">Verify Your Phone</h1>
          <p className="text-muted-foreground">
            Enter the 6-digit code sent to <span className="font-medium text-foreground">{phone}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Verification Code</label>
            <Input
              required
              name="code"
              type="text"
              placeholder="123456"
              maxLength={6}
              pattern="[0-9]{6}"
              className="w-full text-center text-2xl tracking-widest font-mono"
              disabled={loading}
              autoComplete="one-time-code"
            />
          </div>

          <Button disabled={loading} className="w-full" size="lg" type="submit">
            {loading ? "Verifying..." : "Verify Phone"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Didn't receive the code?
          </p>
          <Button
            variant="ghost"
            onClick={handleResend}
            disabled={resending || countdown > 0}
            className="text-primary hover:text-primary/80"
          >
            {resending ? "Resending..." : countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function VerifyPhonePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyPhoneContent />
    </Suspense>
  )
}