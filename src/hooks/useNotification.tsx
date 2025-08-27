import { useState, useCallback } from 'react'
import type { NotificationType } from '../components/Notification'

interface NotificationState {
  isOpen: boolean
  type: NotificationType
  title: string
  message?: string
}

export const useNotification = () => {
  const [notification, setNotification] = useState<NotificationState>({
    isOpen: false,
    type: 'info',
    title: '',
    message: undefined
  })

  const showNotification = useCallback((
    type: NotificationType,
    title: string,
    message?: string
  ) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message
    })
  }, [])

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, isOpen: false }))
  }, [])

  return {
    notification,
    showNotification,
    hideNotification
  }
}