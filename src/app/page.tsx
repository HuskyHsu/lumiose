import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My shadcn/ui Project</h1>
        <Button>Get Started</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Getting Started</CardTitle>
              <Badge>New</Badge>
            </div>
            <CardDescription>
              Learn the basics of shadcn/ui component development.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">shadcn</p>
                <p className="text-xs text-muted-foreground">Component Author</p>
              </div>
            </div>
            <p className="text-sm">
              This card demonstrates the basic structure and styling of shadcn/ui components.
            </p>
            <Button variant="outline" size="sm" className="mt-4">
              Learn More
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Design System</CardTitle>
              <Badge variant="secondary">Core</Badge>
            </div>
            <CardDescription>
              Explore the systematic approach to UI development.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              shadcn/ui provides a complete design system with consistent tokens and patterns.
            </p>
            <div className="flex gap-2">
              <Button variant="default" size="sm">Primary</Button>
              <Button variant="secondary" size="sm">Secondary</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Customization</CardTitle>
              <Badge variant="outline">Advanced</Badge>
            </div>
            <CardDescription>
              Discover how to customize components for your needs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              Since you own the component code, you can modify anything to match your requirements.
            </p>
            <Button variant="destructive" size="sm" className="w-full">
              Customize Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}