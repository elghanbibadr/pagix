import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Palette, Code2, Users, Sparkles, CheckCircle2 } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold">Pagix</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full border border-border">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Website Builder</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-balance">Build Websites Without Code</h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Create stunning, responsive websites with our drag-and-drop editor. No coding required. Launch in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                Start Building Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-muted-foreground">Everything you need to create professional websites</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Zap,
              title: "Drag & Drop Editor",
              description: "Intuitive interface for building pages without touching code",
            },
            {
              icon: Palette,
              title: "Design System",
              description: "Pre-built components and templates to get started instantly",
            },
            {
              icon: Code2,
              title: "Code Export",
              description: "Export clean, production-ready HTML, CSS, and JavaScript",
            },
            {
              icon: Sparkles,
              title: "AI Generation",
              description: "Let AI help generate content and design suggestions",
            },
            {
              icon: Users,
              title: "Collaboration",
              description: "Work with your team in real-time on projects",
            },
            {
              icon: CheckCircle2,
              title: "Responsive Design",
              description: "Automatically optimized for all devices and screen sizes",
            },
          ].map((feature, i) => (
            <div key={i} className="p-6 border border-border rounded-lg hover:border-primary transition-colors">
              <feature.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-primary text-primary-foreground rounded-lg p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Build?</h2>
          <p className="text-lg mb-8 opacity-90">Join thousands of creators building amazing websites with Pagix</p>
          <Link href="/signup">
            <Button size="lg" variant="secondary">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">P</span>
              </div>
              <span className="font-semibold">Pagix</span>
            </div>
            <p className="text-muted-foreground text-sm">© 2025 Pagix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
