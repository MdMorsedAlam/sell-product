"use client"

import { useParams } from "next/navigation"
import ArticleEditor from "@/components/article-editor"

export default function AdminEditArticlePage() {
  const { id } = useParams()

  return <ArticleEditor articleId={id as string} isAdmin={true} />
}
