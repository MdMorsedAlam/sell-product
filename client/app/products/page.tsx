import { Suspense } from "react"
import NewsGrid from "@/components/news-grid"
import Footer from "@/components/footer"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <NewsGrid category="all"  limit={20}/>
        </Suspense>
      </div>
      <Footer />
    </main>
  )
}
