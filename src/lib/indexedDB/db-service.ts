import {
    mockClients,
    mockInvoices,
    mockLeads,
    mockNotifications,
    mockProjects,
    mockTasks,
} from "../mock-data"
import { dbConfig } from "./db-config"
import logger from "../utils/logger"

class DBService {
    private db: IDBDatabase | null = null
    private dbName: string = dbConfig.name
    private dbVersion: number = dbConfig.version
    private isInitialized: boolean = false
    private initPromise: Promise<boolean> | null = null

    constructor() { }

    /**
     * Initialize the database
     * @returns Promise that resolves when the database is initialized
     */
    init(): Promise<boolean> {
        if (this.isInitialized) {
            return Promise.resolve(true)
        }

        if (this.initPromise) {
            return this.initPromise
        }

        this.initPromise = new Promise((resolve, reject) => {
            if (!window.indexedDB) {
                logger.error("IndexedDB not supported in this browser")
                reject(new Error("IndexedDB not supported"))
                return
            }

            const request = window.indexedDB.open(this.dbName, this.dbVersion)

            request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                const target = event.target as IDBOpenDBRequest
                if (!target) return
                const db = target.result

                // Create object stores based on configuration
                for (const store of dbConfig.stores) {
                    if (!db.objectStoreNames.contains(store.name)) {
                        const objectStore = db.createObjectStore(store.name, { keyPath: store.keyPath })

                        // Create indices
                        if (store.indices) {
                            for (const index of store.indices) {
                                objectStore.createIndex(index.name, index.keyPath, index.options)
                            }
                        }
                    }
                }
            }

            request.onsuccess = async (event: Event) => {
                const target = event.target as IDBOpenDBRequest
                if (!target) return
                this.db = target.result
                this.isInitialized = true
                logger.info("Database initialized successfully")

                // Seed data if stores are empty
                await this.seedDataIfEmpty()

                resolve(true)
            }

            request.onerror = (event: Event) => {
                const target = event.target as IDBOpenDBRequest
                const errorMessage = target?.error ? String(target.error) : "Unknown error"
                logger.error("Database initialization failed", errorMessage)
                reject(target?.error || new Error(errorMessage))
            }
        })

        return this.initPromise
    }

    /**
     * Add a record to the specified store
     * @param storeName The name of the store
     * @param data The data to add
     * @returns Promise that resolves with the ID of the added record
     */
    async add(storeName: string, data: any): Promise<any> {
        await this.init()

        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Database not initialized"))
                return
            }

            const transaction = this.db.transaction(storeName, "readwrite")
            const store = transaction.objectStore(storeName)
            const request = store.add(data)

            request.onsuccess = () => {
                resolve(request.result)
            }

            request.onerror = () => {
                reject(request.error)
            }
        })
    }

    /**
     * Get a record by ID from the specified store
     * @param storeName The name of the store
     * @param id The ID of the record to get
     * @returns Promise that resolves with the record
     */
    async getById(storeName: string, id: any): Promise<any> {
        await this.init()

        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Database not initialized"))
                return
            }

            const transaction = this.db.transaction(storeName, "readonly")
            const store = transaction.objectStore(storeName)
            const request = store.get(id)

            request.onsuccess = () => {
                resolve(request.result)
            }

            request.onerror = () => {
                reject(request.error)
            }
        })
    }

    /**
     * Get all records from the specified store
     * @param storeName The name of the store
     * @returns Promise that resolves with an array of records
     */
    async getAll(storeName: string): Promise<any[]> {
        await this.init()

        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Database not initialized"))
                return
            }

            const transaction = this.db.transaction(storeName, "readonly")
            const store = transaction.objectStore(storeName)
            const request = store.getAll()

            request.onsuccess = () => {
                resolve(request.result)
            }

            request.onerror = () => {
                reject(request.error)
            }
        })
    }

    /**
     * Update a record in the specified store
     * @param storeName The name of the store
     * @param data The data to update
     * @returns Promise that resolves when the update is complete
     */
    async update(storeName: string, data: any): Promise<void> {
        await this.init()

        return new Promise<void>((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Database not initialized"))
                return
            }

            const transaction = this.db.transaction(storeName, "readwrite")
            const store = transaction.objectStore(storeName)
            const request = store.put(data)

            request.onsuccess = () => {
                resolve()
            }

            request.onerror = () => {
                reject(request.error)
            }
        })
    }

    /**
     * Delete a record from the specified store
     * @param storeName The name of the store
     * @param id The ID of the record to delete
     * @returns Promise that resolves when the delete is complete
     */
    async delete(storeName: string, id: any): Promise<void> {
        await this.init()

        return new Promise<void>((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Database not initialized"))
                return
            }

            const transaction = this.db.transaction(storeName, "readwrite")
            const store = transaction.objectStore(storeName)
            const request = store.delete(id)

            request.onsuccess = () => {
                resolve()
            }

            request.onerror = () => {
                reject(request.error)
            }
        })
    }

    /**
     * Query records from the specified store
     * @param storeName The name of the store
     * @param indexName The name of the index to query
     * @param value The value to query for (supports IDBValidKey and boolean)
     * @returns Promise that resolves with an array of matching records
     */
    async queryByIndex(storeName: string, indexName: string, value: IDBValidKey | IDBKeyRange): Promise<any[]> {
        await this.init()

        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Database not initialized"))
                return
            }

            const transaction = this.db.transaction(storeName, "readonly")
            const store = transaction.objectStore(storeName)
            const index = store.index(indexName)
            const request = index.getAll(value)

            request.onsuccess = () => {
                resolve(request.result)
            }

            request.onerror = () => {
                reject(request.error)
            }
        })
    }

    /**
     * Query records from a store using a custom filter function
     * @param storeName The name of the store
     * @param filterFn The filter function to apply to each record
     * @returns Promise that resolves with an array of matching records
     */
    async queryWithFilter(storeName: string, filterFn: (item: any) => boolean): Promise<any[]> {
        const allItems = await this.getAll(storeName)
        return allItems.filter(filterFn)
    }

    /**
     * Clear all data from the specified store
     * @param storeName The name of the store
     * @returns Promise that resolves when the clear is complete
     */
    async clearStore(storeName: string): Promise<void> {
        await this.init()

        return new Promise<void>((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Database not initialized"))
                return
            }

            const transaction = this.db.transaction(storeName, "readwrite")
            const store = transaction.objectStore(storeName)
            const request = store.clear()

            request.onsuccess = () => {
                resolve()
            }

            request.onerror = () => {
                reject(request.error)
            }
        })
    }

    /**
     * Count records in the specified store
     * @param storeName The name of the store
     * @returns Promise that resolves with the count of records
     */
    async count(storeName: string): Promise<number> {
        await this.init()

        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Database not initialized"))
                return
            }

            const transaction = this.db.transaction(storeName, "readonly")
            const store = transaction.objectStore(storeName)
            const request = store.count()

            request.onsuccess = () => {
                resolve(request.result)
            }

            request.onerror = () => {
                reject(request.error)
            }
        })
    }

    /**
     * Seed the database with initial data if the stores are empty
     */
    async seedDataIfEmpty() {
        try {
            // logger.info("Checking if database seeding is required...")

            // Check leads
            if ((await this.count("leads")) === 0) {
                // logger.info("Seeding leads...")
                for (const lead of mockLeads) {
                    await this.add("leads", lead)
                }
            }

            // Check clients
            if ((await this.count("clients")) === 0) {
                // logger.info("Seeding clients...")
                for (const client of mockClients) {
                    await this.add("clients", client)
                }
            }

            // Check projects
            if ((await this.count("projects")) === 0) {
                // logger.info("Seeding projects...")
                for (const project of mockProjects) {
                    await this.add("projects", project)
                }
            }

            // Check tasks
            if ((await this.count("tasks")) === 0) {
                // logger.info("Seeding tasks...")
                for (const task of mockTasks) {
                    await this.add("tasks", task)
                }
            }

            // Check invoices
            if ((await this.count("invoices")) === 0) {
                // logger.info("Seeding invoices...")
                for (const invoice of mockInvoices) {
                    await this.add("invoices", invoice)
                }
            }

            // Check notifications
            if ((await this.count("notifications")) === 0) {
                // logger.info("Seeding notifications...")
                for (const notification of mockNotifications) {
                    await this.add("notifications", notification)
                }
            }

            // logger.info("Database seeding check complete")
        } catch (error) {
            logger.errorWithContext("DBService.seedDataIfEmpty", "Failed to seed database", error)
        }
    }
}

// Create a singleton instance
const dbService = new DBService()

export default dbService
