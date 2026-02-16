import logger from "../utils/logger"

export interface Notification {
    id: string
    title: string
    time: string
    read: boolean
}

class NotificationsService {
    async getNotifications(): Promise<Notification[]> {
        // Mock data for frontend implementation
        return [
            {
                id: "1",
                title: "New feature available",
                time: "Just now",
                read: false,
            },
            {
                id: "2",
                title: "Your post was scheduled",
                time: "2 hours ago",
                read: true,
            },
            {
                id: "3",
                title: "Welcome to Vistro",
                time: "1 day ago",
                read: true,
            },
        ]
    }

    async markAsRead(id: string) {
        logger.info(`Marked notification ${id} as read`)
    }

    async markAllAsRead() {
        logger.info("Marked all notifications as read")
    }
}

const notificationsService = new NotificationsService()
export default notificationsService
