import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function About() {
  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold'>關於我們</h1>
      <Card>
        <CardHeader>
          <CardTitle>專案介紹</CardTitle>
          <CardDescription>了解這個專案的背景和目標</CardDescription>
        </CardHeader>
        <CardContent>
          <p className='mb-4'>
            這是一個使用 React Router 與 HashRouter 的示範專案，專為 GitHub Pages 部署而設計。
          </p>
          <p className='mb-4'>
            HashRouter 使用 URL 的 hash 部分來保持 UI 與 URL 的同步，這對於靜態檔案託管服務（如
            GitHub Pages）來說是完美的解決方案。
          </p>
          <p>透過這種方式，我們可以在不需要伺服器端路由配置的情況下實現客戶端路由。</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default About;
