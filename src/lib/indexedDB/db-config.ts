export const dbConfig = {
    name: "AdminDashboardDB",
    version: 4,
    stores: [
        {
            name: "users",
            keyPath: "id",
            indices: [
                { name: "email", keyPath: "email", options: { unique: true } },
                { name: "role", keyPath: "role" },
            ],
        },
        {
            name: "leads",
            keyPath: "id",
            indices: [
                { name: "name", keyPath: "name" },
                { name: "stage", keyPath: "stage" },
                { name: "createdAt", keyPath: "createdAt" },
            ],
        },
        {
            name: "clients",
            keyPath: "id",
            indices: [
                { name: "name", keyPath: "name" },
                { name: "status", keyPath: "status" },
            ],
        },
        {
            name: "projects",
            keyPath: "id",
            indices: [
                { name: "name", keyPath: "name" },
                { name: "clientId", keyPath: "clientId" },
                { name: "status", keyPath: "status" },
                { name: "deadline", keyPath: "deadline" },
            ],
        },
        {
            name: "tasks",
            keyPath: "id",
            indices: [
                { name: "projectId", keyPath: "projectId" },
                { name: "status", keyPath: "status" },
                { name: "priority", keyPath: "priority" },
            ],
        },
        {
            name: "invoices",
            keyPath: "id",
            indices: [
                { name: "clientId", keyPath: "clientId" },
                { name: "projectId", keyPath: "projectId" },
                { name: "status", keyPath: "status" },
                { name: "date", keyPath: "date" },
                { name: "dueDate", keyPath: "dueDate" },
                { name: "invoiceNumber", keyPath: "invoiceNumber", options: { unique: true } },
            ],
        },
        {
            name: "notifications",
            keyPath: "id",
            indices: [
                { name: "read", keyPath: "read" },
                { name: "time", keyPath: "time" },
            ],
        },
        {
            name: "twoFactorCodes",
            keyPath: "id",
            indices: [
                { name: "email", keyPath: "email" },
                { name: "expiresAt", keyPath: "expiresAt" },
            ],
        },
        {
            name: "aiPreferences",
            keyPath: "id",
            indices: [
                { name: "type", keyPath: "type" },
                { name: "messageId", keyPath: "messageId" },
            ],
        },
        {
            name: "aiChats",
            keyPath: "id",
            indices: [
                { name: "userId", keyPath: "userId" },
                { name: "isArchived", keyPath: "isArchived" },
                { name: "updatedAt", keyPath: "updatedAt" }
            ],
        },
    ],
}
