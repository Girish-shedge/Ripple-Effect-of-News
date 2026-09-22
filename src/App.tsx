import { Navigate, Route, Routes } from 'react-router-dom'
import { MarketMarquee } from './components/MarketMarquee'
import { NewsListPage } from './components/NewsListPage'
import { StoryDetailRoute } from './components/StoryDetailRoute'

export default function App() {
  return (
    <>
      <MarketMarquee />
      <Routes>
        <Route path="/" element={<NewsListPage />} />
        <Route path="/story/:id" element={<StoryDetailRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
