import { useEffect, useState } from "react"

const useLocalStorageState = (
  key: string
): [string | null, (token: string) => void] => {
  const [userToken, setUserToken] = useState<string | null>(null)

  useEffect(() => {
    const storedUserToken = localStorage.getItem(key)
    if (storedUserToken) setUserToken(storedUserToken)
  }, [])

  const setToken = (token: string) => {
    setUserToken(token)
    localStorage.setItem(key, token)
  }

  return [userToken, setToken]
}

export default useLocalStorageState
