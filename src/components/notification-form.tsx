"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/Button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Separator } from "@/components/ui/separator"

const notificationFormSchema = z.object({
    newLeads: z.boolean(),
    leadStatusChanges: z.boolean(),
    newClients: z.boolean(),
    projectUpdates: z.boolean(),
    taskAssignments: z.boolean(),
    taskDeadlines: z.boolean(),
    invoicePayments: z.boolean(),
    invoiceOverdue: z.boolean(),
    systemUpdates: z.boolean(),
    marketingNews: z.boolean(),
    emailNotifications: z.boolean(),
})

type NotificationFormValues = z.infer<typeof notificationFormSchema>

export function NotificationForm() {
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const defaultValues: NotificationFormValues = {
        newLeads: true,
        leadStatusChanges: true,
        newClients: true,
        projectUpdates: true,
        taskAssignments: true,
        taskDeadlines: true,
        invoicePayments: true,
        invoiceOverdue: true,
        systemUpdates: false,
        marketingNews: false,
        emailNotifications: true,
    }

    const form = useForm<NotificationFormValues>({
        resolver: zodResolver(notificationFormSchema),
        defaultValues,
    })

    function onSubmit(data: NotificationFormValues) {
        setIsLoading(true)
        console.log("Saving notification preferences:", data)

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            toast({
                title: "Notification preferences updated",
                description: "Your notification preferences have been updated successfully.",
            })
        }, 1000)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what notifications you want to receive.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Global Settings</h3>
                            <Separator />
                            <FormField
                                control={form.control}
                                name="emailNotifications"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/20">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base font-semibold">Email Notifications</FormLabel>
                                            <FormDescription>Master switch for all email-based communication.</FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} name={field.name} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Leads & Clients</h3>
                            <Separator />
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="newLeads"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">New Leads</FormLabel>
                                                <FormDescription>Receive notifications when new leads are added.</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} name={field.name} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="leadStatusChanges"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Lead Status Changes</FormLabel>
                                                <FormDescription>Receive notifications when lead statuses change.</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} name={field.name} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="newClients"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">New Clients</FormLabel>
                                                <FormDescription>Receive notifications when new clients are added.</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} name={field.name} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Projects & Tasks</h3>
                            <Separator />
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="projectUpdates"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Project Updates</FormLabel>
                                                <FormDescription>Receive notifications about project status changes.</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} name={field.name} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="taskAssignments"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Task Assignments</FormLabel>
                                                <FormDescription>Receive notifications when tasks are assigned to you.</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} name={field.name} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="taskDeadlines"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Task Deadlines</FormLabel>
                                                <FormDescription>Receive notifications about upcoming task deadlines.</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} name={field.name} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Invoices & Payments</h3>
                            <Separator />
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="invoicePayments"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Invoice Payments</FormLabel>
                                                <FormDescription>Receive notifications when invoices are paid.</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} name={field.name} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="invoiceOverdue"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Invoice Overdue</FormLabel>
                                                <FormDescription>Receive notifications about overdue invoices.</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} name={field.name} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">System & Marketing</h3>
                            <Separator />
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="systemUpdates"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">System Updates</FormLabel>
                                                <FormDescription>Receive notifications about system updates and maintenance.</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} name={field.name} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="marketingNews"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Marketing News</FormLabel>
                                                <FormDescription>Receive marketing newsletters and product updates.</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} name={field.name} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save preferences"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
