"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import { login } from "../actions/actions"
import { useState } from "react"
import { toast } from "sonner"

export default function LoginPage() {
   const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const result = await login(formData)

      if (!result.success) {
        toast.warning("Invalid email or password. Please try again.")
        // Show error toast
 
      } else {
        // Show success toast
        toast.success(
          "Login successful. Redirecting...",
        )
        
      
      }
    } catch (err: any) {
             toast.warning("something went wrong try later !")

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

          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your account to continue building</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input name="email" type="email" placeholder="you@example.com" className="w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <Input name="password" type="password" placeholder="••••••••" className="w-full" />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              Remember me
            </label>
            <Link href="#" className="text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button disabled={loading} className="w-full" size="lg">
            Sign In
          </Button>
        </form>

        {/* Divider */}
  
 

        {/* Sign Up Link */}
        <p className="text-center text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
