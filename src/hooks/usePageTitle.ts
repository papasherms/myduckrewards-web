import { useEffect } from 'react'

export const usePageTitle = (title: string) => {
  useEffect(() => {
    const prevTitle = document.title
    document.title = `${title} | MyDuckRewards`
    
    return () => {
      document.title = prevTitle
    }
  }, [title])
}

export default usePageTitle