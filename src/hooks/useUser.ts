// @/hooks/useUser.ts

import { useEffect, useState } from "react"
import type { User } from "@/types"

const sampleUser: User = {
  id: 1,
  username: "abebekebede",
  email: "abebekebede@example.com",
  password_hash: "********",
  created_at: new Date().toISOString(),
}

export function useUser(userId: number | null) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    const timeout = setTimeout(() => {
      setUser(sampleUser)
      setLoading(false)
    }, 300)

    return () => clearTimeout(timeout)
  }, [userId])

  return { user, loading }
}
