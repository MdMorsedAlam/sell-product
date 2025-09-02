"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Article, Quiz, NewsletterSubscriber } from "@/lib/content-models"
import { Bar, Line, Pie, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, Legend, BarChart, LineChart, PieChart } from "recharts"
import { useApi } from "@/hooks/useApi"
import Link from "next/link"

export default function AdminDashboardPage() {
  const [articles, setArticles] = useState<Article[]>([])
const { data, isLoading, refetch } = useApi(['products'], '/products')

  // Calculate statistics
  const totalArticles = articles.length




  const categoryData = articles.reduce(
    (acc, article) => {
      const category = article.category
      const existingCategory = acc.find((item) => item.name === category)

      if (existingCategory) {
        existingCategory.value += 1
      } else {
        acc.push({ name: category, value: 1 })
      }

      return acc
    },
    [] as { name: string; value: number }[],
  )

  // Sort categories by count
  categoryData.sort((a, b) => b.value - a.value)

  // Prepare recent activity data (mock data for demonstration)

useEffect(() => {
  const fetchData = async () => {
    await refetch()
    if (Array.isArray(data)) {
      setArticles(data)
    }
  }
  fetchData()
}, [data, isLoading])
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
           <Link href="/admin/products">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalArticles}</div>
           
          </CardContent>
          </Link>
        </Card>
        <Card>
          <Link href="/admin/orders">
         <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalArticles}</div>
           
          </CardContent>
          </Link>
        </Card>
      
      </div>

   
    </div>
  )
}
