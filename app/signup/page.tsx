// app/signup/page.tsx
'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { signup } from "../actions/actions"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function SignupPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()


    setLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const result = await signup(formData)

      if (!result.success) {
        toast(
        result.error
        )
      } else {
        toast(
         "Please check your email to confirm your account.",
        )
        
        // Redirect after showing toast
        setTimeout(() => {
          router.push(result.redirectTo )
        }, 1000)
      }
    } catch (err: any) {
      toast(
      "An unexpected error occurred. Please try again.",
      )
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
            Back to home
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">P</span>
            </div>
            <span className="text-xl font-bold">Pagix</span>
          </div>

          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-muted-foreground">Start building amazing websites today</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium mb-2">
              Full Name
            </label>
            <Input 
              id="fullName"
              name="fullName" 
              type="text" 
              placeholder="John Doe" 
              className="w-full"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <Input 
              id="email"
              type="email" 
              name="email" 
              placeholder="you@example.com" 
              className="w-full"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <Input 
              id="password"
              type="password" 
              name="password" 
              placeholder="••••••••" 
              className="w-full"
              minLength={6}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Confirm Password
            </label>
            <Input 
              id="confirmPassword"
              type="password" 
              name="confirmPassword"
              placeholder="••••••••" 
              className="w-full"
              minLength={6}
              required
              disabled={loading}
            />
          </div>


          <Button 
            type="submit"
            className="w-full" 
            size="lg"
            disabled={loading }
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        {/* Benefits */}
        <div className="mt-8 space-y-3 p-4 bg-secondary rounded-lg">
          <p className="text-sm font-medium">What you get:</p>
          {["Unlimited projects", "AI-powered design", "Code export"].map((benefit, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {/* Sign In Link */}
        <p className="text-center text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}