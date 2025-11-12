"use client"

import { useState } from "react"
import { Mail, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ConfirmEmailPage() {
  // const searchParams = useSearchParams()
  const email = 'test@email.com'
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleResend = async () => {
    if (!email) {
      setMessage("Email address not found")
      return
    }

    setLoading(true)
    setMessage("")

    const result ={error:""};

    if (result.error) {
      setMessage(result.error)
    } else {
      setMessage("Confirmation email sent! Check your inbox.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Check Your Email</h1>
          <p className="text-muted-foreground">
            We sent a confirmation link to
          </p>
          {email && (
            <p className="text-lg font-medium mt-2">{email}</p>
          )}
        </div>

        <div className="space-y-4 p-6 bg-secondary/50 rounded-lg">
          <div className="flex items-start gap-3 text-left">
            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Check your inbox</p>
              <p className="text-xs text-muted-foreground">
                Click the confirmation link in the email
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-left">
            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Verify your phone</p>
              <p className="text-xs text-muted-foreground">
                After email confirmation, you&apos;ll verify your phone number
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-left">
            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Access your account</p>
              <p className="text-xs text-muted-foreground">
                Sign in after both verifications are complete
              </p>
            </div>
          </div>
        </div>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${
            message.includes('sent') 
              ? 'bg-green-50 text-green-800 dark:bg-green-900/10 dark:text-green-200' 
              : 'bg-destructive/10 text-destructive'
          }`}>
            {message}
          </div>
        )}

        <div className="mt-6 space-y-3">
          <Button
            onClick={handleResend}
            disabled={loading || !email}
            variant="outline"
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              'Resend Confirmation Email'
            )}
          </Button>

          <p className="text-xs text-muted-foreground">
            Can&apos;t find the email? Check your spam folder
          </p>
        </div>
      </div>
    </div>
  )
}