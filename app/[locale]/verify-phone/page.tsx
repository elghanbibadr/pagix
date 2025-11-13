/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { verifyPhoneCode, resendVerificationCode } from "../../actions/actions"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import Image from "next/image"
import logo from "@/public/icons/logo.png"

function VerifyPhoneContent() {
  const t = useTranslations("verifyPhone")
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') || ''
  const smsError = searchParams.get('sms_error') === 'true'
  
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (smsError) {
      toast.error(t("smsError"))
    }
  }, [smsError, t])

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
        toast.error(result.error || t("errorVerification"))
      } else {
        toast.success(t("successTitle"))
        // Redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      }
    } catch (err: any) {
      toast.error(t("errorGeneric"))
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
        toast.error(result.error || t("errorResend"))
      } else {
        toast.success(t("resendButton") + "!")
        setCountdown(60) // 60 second cooldown
      }
    } catch (err: any) {
      toast.error(t("errorGeneric"))
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link 
            href="/signup" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" />

            {t("backToSignup")}
          </Link>

                    <Image src={logo} alt="pagix logo" height={100} width={100} />


          <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
          <p className="text-muted-foreground">
            {t("description")} <span className="font-medium text-foreground">{phone}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("codeLabel")}
            </label>
            <Input
              required
              name="code"
              type="text"
              placeholder={t("codePlaceholder")}
              maxLength={6}
              pattern="[0-9]{6}"
              className="w-full text-center text-2xl tracking-widest font-mono"
              disabled={loading}
              autoComplete="one-time-code"
            />
          </div>

          <Button disabled={loading} className="w-full" size="lg" type="submit">
            {loading ? t("verifying") : t("verifyButton")}
          </Button>

          <div className="text-center mt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleResend}
              disabled={resending || countdown > 0}
              className="text-sm"
            >
              {resending 
                ? t("resending") 
                : countdown > 0 
                  ? t("resendIn").replace("{seconds}", countdown.toString())
                  : t("resendButton")
              }
            </Button>
          </div>
        </form>
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