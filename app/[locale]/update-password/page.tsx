"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Phone, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { sendPasswordVerificationEmail, sendPasswordVerificationSMS, verifyPasswordResetCode } from "../../actions/actions"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { Link, useRouter } from "@/i18n/routing"

type ResetMethod = "email" | "phone"
type Step = "method" | "otp" | "success"

export default function ForgotPasswordPage() {
  const t = useTranslations("forgotPassword")
  const router = useRouter()
  const [step, setStep] = useState<Step>("method")
  const [resetMethod, setResetMethod] = useState<ResetMethod>("email")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (resetMethod === "email") {
      if (!email) {
        setError(t("errorRequired"))
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setError(t("errorInvalid"))
        return
      }

      setIsLoading(true)

      const result = await sendPasswordVerificationEmail(email)
      if (!result.success) {
        toast.error(result.error)
        setIsLoading(false)
        return
      }

      setIsLoading(false)
      setStep("success")
    } else {
      // Phone option
      if (!phone) {
        setError(t("phoneErrorRequired"))
        return
      }

      const phoneRegex = /^[\d\s\-\+\(\)]+$/
      if (!phoneRegex.test(phone)) {
        setError(t("phoneErrorInvalid"))
        return
      }

      setIsLoading(true)

      const result = await sendPasswordVerificationSMS(phone)
      if (!result.success) {
        toast.error(result.error)
        setIsLoading(false)
        return
      }

      setIsLoading(false)
      // Go directly to OTP screen
      setStep("otp")
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = pastedData.split("").concat(Array(6 - pastedData.length).fill(""))
    setOtp(newOtp.slice(0, 6))

    const focusIndex = Math.min(pastedData.length, 5)
    const input = document.getElementById(`otp-${focusIndex}`)
    input?.focus()
  }

  const handleVerifyOtp = async () => {
    const otpCode = otp.join("")
    
    if (otpCode.length !== 6) {
      setError(t("otpIncomplete"))
      return
    }

    setIsLoading(true)
    setError("")

    const result = await verifyPasswordResetCode(phone, otpCode)
    
    if (!result.success) {
      toast.error(result.error || t("otpInvalid"))
      setIsLoading(false)
      return
    }

    setIsLoading(false)
    
    // Redirect to  reset password page
    router.push(`/reset-password?token=${result.token}&phone=${encodeURIComponent(phone)}`)
  }

  const handleResendOtp = async () => {
    setIsLoading(true)
    setError("")
    setOtp(["", "", "", "", "", ""])

    const result = await sendPasswordVerificationSMS(phone)
    
    if (!result.success) {
      toast.error(result.error)
      setIsLoading(false)
      return
    }

    toast.success(t("otpResent"))
    setIsLoading(false)
  }

  const handleBackFromOtp = () => {
    setStep("method")
    setOtp(["", "", "", "", "", ""])
    setError("")
  }

  // OTP Verification Step (ONLY for phone)
  if (step === "otp") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md p-8">
          <div className="mb-8">
            <button
              onClick={handleBackFromOtp}
              className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("back")}
            </button>

            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-primary" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-center text-foreground mb-2">
              {t("otpTitle")}
            </h1>

            <p className="text-center text-muted-foreground">
              {t("otpDescription")} <strong>{phone}</strong>
            </p>
          </div>

          {/* OTP Input */}
          <div className="space-y-6">
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={index === 0 ? handleOtpPaste : undefined}
                  disabled={isLoading}
                  className="w-12 h-14 text-center text-xl font-semibold"
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <Button
              onClick={handleVerifyOtp}
              className="w-full h-11 font-semibold"
              disabled={isLoading || otp.join("").length !== 6}
            >
              {isLoading ? (
                <>
                  <span className="inline-block w-4 h-4 mr-2 border-2 border-background border-t-foreground rounded-full animate-spin" />
                  {t("verifying")}
                </>
              ) : (
                t("verifyButton")
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {t("didntReceiveCode")}
              </p>
              <Button
                variant="ghost"
                onClick={handleResendOtp}
                disabled={isLoading}
                className="text-primary hover:text-primary/80"
              >
                {t("resendCode")}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // Success Step (ONLY for email)
  if (step === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-foreground mb-2">
            {t("successTitle")}
          </h1>

          <p className="text-center text-muted-foreground mb-6">
            {t("successDescription")} <strong>{email}</strong>. {t("successInstructions")}
          </p>

          <p className="text-sm text-center text-muted-foreground mb-6">
            {t("noEmail")}
          </p>

          <Button onClick={() => setStep("method")} variant="outline" className="w-full mb-3">
            {t("tryAnother")}
          </Button>

          <Link href="/login">
            <Button variant="ghost" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("backToLogin")}
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  // Initial Method Selection Step
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8">
          <Link
            href="/login"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("backToLogin")}
          </Link>

          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              {resetMethod === "email" ? (
                <Mail className="w-6 h-6 text-primary" />
              ) : (
                <Phone className="w-6 h-6 text-primary" />
              )}
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-foreground mb-2">
            {t("title")}
          </h1>

          <p className="text-center text-muted-foreground">
            {t("description")}
          </p>
        </div>

        {/* Method Selection Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-muted rounded-lg">
          <button
            type="button"
            onClick={() => {
              setResetMethod("email")
              setError("")
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
              resetMethod === "email"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Mail className="w-4 h-4" />
            {t("emailMethod")}
          </button>
          <button
            type="button"
            onClick={() => {
              setResetMethod("phone")
              setError("")
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
              resetMethod === "phone"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Phone className="w-4 h-4" />
            {t("phoneMethod")}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {resetMethod === "email" ? (
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                {t("emailLabel")}
              </label>
              <Input
                id="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="h-11"
                aria-label={t("emailLabel")}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          ) : (
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-foreground">
                {t("phoneLabel")}
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder={t("phonePlaceholder")}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
                className="h-11"
                aria-label={t("phoneLabel")}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          )}

          <Button type="submit" className="w-full h-11 font-semibold" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="inline-block w-4 h-4 mr-2 border-2 border-background border-t-foreground rounded-full animate-spin" />
                {t("sending")}
              </>
            ) : resetMethod === "email" ? (
              t("sendButton")
            ) : (
              t("sendSMSButton")
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            {t("rememberPassword")}{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              {t("signIn")}
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}