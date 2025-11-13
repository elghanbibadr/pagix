"use client"

import type React from "react"

import { useState } from "react"
import { Lock, ArrowLeft, CheckCircle, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { updateUserPassword } from "../../actions/actions"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"

export default function ResetPasswordPage() {
  const t = useTranslations("resetPassword")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) {
      return t("errorTooShort")
    }
    if (!/[A-Z]/.test(pwd)) {
      return t("errorNoUppercase")
    }
    if (!/[a-z]/.test(pwd)) {
      return t("errorNoLowercase")
    }
    if (!/[0-9]/.test(pwd)) {
      return t("errorNoNumber")
    }
    return ""
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (!password || !confirmPassword) {
      setError(t("errorAllFields"))
      return
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    if (password !== confirmPassword) {
      setError(t("errorNoMatch"))
      return
    }

    setIsLoading(true)

    await updateUserPassword(password)
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 1500)
  }

  if (isSubmitted) {
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

          <p className="text-center text-muted-foreground mb-8">
            {t("successDescription")}
          </p>

          <Link href="/dashboard">
            <Button className="w-full h-11 font-semibold">
              {t("goToDashboard")}
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-8">
        {/* Header */}
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
              <Lock className="w-6 h-6 text-primary" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-foreground mb-2">
            {t("title")}
          </h1>

          <p className="text-center text-muted-foreground">
            {t("description")}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password field */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              {t("newPasswordLabel")}
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={t("newPasswordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-11 pr-10"
                aria-label={t("newPasswordLabel")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? t("hidePassword") : t("showPassword")}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm password field */}
          <div className="space-y-2">
            <label htmlFor="confirm-password" className="text-sm font-medium text-foreground">
              {t("confirmPasswordLabel")}
            </label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t("confirmPasswordPlaceholder")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className="h-11 pr-10"
                aria-label={t("confirmPasswordLabel")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showConfirmPassword ? t("hidePassword") : t("showPassword")}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && <p className="text-sm text-destructive">{error}</p>}

          {/* Password requirements */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <p className="text-xs font-semibold text-foreground">{t("requirementsTitle")}</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>{t("requirement1")}</li>
              <li>{t("requirement2")}</li>
              <li>{t("requirement3")}</li>
              <li>{t("requirement4")}</li>
            </ul>
          </div>

          <Button type="submit" className="w-full h-11 font-semibold" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="inline-block w-4 h-4 mr-2 border-2 border-background border-t-foreground rounded-full animate-spin" />
                {t("resetting")}
              </>
            ) : (
              t("resetButton")
            )}
          </Button>
        </form>
      </Card>
    </div>
  )
}