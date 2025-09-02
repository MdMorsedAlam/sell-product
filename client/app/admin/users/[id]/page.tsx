"use client"

import { useParams } from "next/navigation"
import UserCreate from "@/components/create-user"

export default function AdminEditUserPage() {
  const { id } = useParams()

  return <UserCreate userId={id as string} />
}
