import { Search, Bell } from "lucide-react"
import { Button } from "@/components/ui/Button"

export function Topbar() {
    return (
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
            <div className="flex flex-1 items-center">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="h-10 w-full rounded-md border border-gray-200 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-gray-700">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-keystone ring-2 ring-white" />
                </Button>
                <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-100 ring-1 ring-gray-200">
                    <img src="https://ui-avatars.com/api/?name=Jane+Doe&background=random" alt="User" />
                </div>
            </div>
        </header>
    )
}
