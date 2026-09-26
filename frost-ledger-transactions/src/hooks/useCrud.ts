import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'

interface UseCrudOptions<T> {
  fetchFn: (userId: string) => Promise<{ data: T[] | null; error: { message: string } | null }>
}

export function useCrud<T extends { id: string }>({ fetchFn }: UseCrudOptions<T>) {
  const { user } = useAuth()
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    const { data: result, error: err } = await fetchFn(user.id)
    if (err) setError(err.message)
    else setData(result ?? [])
    setLoading(false)
  }, [user, fetchFn])

  useEffect(() => { refetch() }, [refetch])
  return { data, loading, error, refetch, setData }
}