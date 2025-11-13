'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { signup } from "../../actions/actions"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import Image from "next/image"
import logo from "@/public/icons/logo.png"
import { Link } from "@/i18n/routing"

export default function SignupPage() {
  const t = useTranslations("signup")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)

    try {
      const result = await signup(formData)
      if (!result.success) {
        toast(result.error)
      } else {
        toast('Welcome !')
        setTimeout(() => router.push(result.redirectTo), 1000)
      }
    } catch {
      toast(t("error"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" />
            {t("backHome")}
          </Link>

       
                <span className="text-xl font-bold">
                            <Image className="mb-4" src={logo} alt="pagix logo" height={100} width={100} />
                          </span>

          <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium mb-2">
              {t("fullName")}
            </label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder={t("fullNamePlaceholder")}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              {t("email")}
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">
              {t("phone")}
            </label>
            <Input
              id="phone"
              name="phone"
              type="phone"
              placeholder={t("phonePlaceholder")}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              {t("password")}
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={t("passwordPlaceholder")}
              minLength={6}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              {t("confirmPassword")}
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder={t("confirmPasswordPlaceholder")}
              minLength={6}
              required
              disabled={loading}
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? t("creatingAccount") : t("createAccount")}
          </Button>
        </form>

        {/* Benefits */}
        <div className="mt-8 space-y-3 p-4 bg-secondary rounded-lg">
          <p className="text-sm font-medium">{t("benefitsTitle")}</p>
          {[t("benefit1"), t("benefit2"), t("benefit3")].map((benefit, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {/* Sign In */}
        <p className="text-center text-muted-foreground mt-6">
          {t("alreadyHaveAccount")}{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            {t("signIn")}
          </Link>
        </p>
      </div>
    </div>
  )
}
