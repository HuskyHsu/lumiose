import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function App() {
  return (
    <main className='container mx-auto p-8'>
      <h1 className='text-3xl font-bold mb-8'>My shadcn/ui Project</h1>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Learn the basics of shadcn/ui component development.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This card demonstrates the basic structure and styling of shadcn/ui components.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Design System</CardTitle>
            <CardDescription>Explore the systematic approach to UI development.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>shadcn/ui provides a complete design system with consistent tokens and patterns.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Customization</CardTitle>
            <CardDescription>Discover how to customize components for your needs.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Since you own the component code, you can modify anything to match your requirements.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default App;
