"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/Button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, Loader2, LibraryBig } from "lucide-react"

interface LibraryImage {
    name: string
    url: string
}

interface ImagePickerProps {
    onSelect: (imageUrl: string) => void
    trigger?: React.ReactNode
}

export function ImagePicker({ onSelect, trigger }: ImagePickerProps) {
    const [open, setOpen] = useState(false)
    const [images, setImages] = useState<LibraryImage[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)

    useEffect(() => {
        if (open) {
            fetchImages()
        }
    }, [open])

    const fetchImages = async () => {
        // Mock image library fetch
        try {
            setLoading(true)
            await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay
            setImages([
                { name: "Avatar 1", url: "https://github.com/shadcn.png" },
                { name: "Avatar 2", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" },
                { name: "Avatar 3", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" },
                { name: "Avatar 4", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Willow" },
            ])
            setLoading(false)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load library")
            setLoading(false)
        }
    }

    const handleConfirm = () => {
        if (selectedImage) {
            onSelect(selectedImage)
            setOpen(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" className="gap-2">
                        <LibraryBig className="h-4 w-4" />
                        From Library
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-3xl h-[600px] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Select Image</DialogTitle>
                    <DialogDescription>Choose an image from your library to use as your avatar.</DialogDescription>
                </DialogHeader>

                <div className="flex-1 min-h-0 border rounded-md p-4 bg-muted/20">
                    {loading ? (
                        <div className="h-full flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : error ? (
                        <div className="h-full flex items-center justify-center text-destructive">
                            {error}
                        </div>
                    ) : images.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                            No images found in library
                        </div>
                    ) : (
                        <ScrollArea className="h-full pr-4">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {images.map((img) => (
                                    <div
                                        key={img.url}
                                        className={`
                                    relative aspect-square border-2 rounded-lg cursor-pointer overflow-hidden transition-all
                                    ${selectedImage === img.url ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-muted-foreground/50'}
                                `}
                                        onClick={() => setSelectedImage(img.url)}
                                    >
                                        <img
                                            src={img.url}
                                            alt={img.name}
                                            className="object-cover w-full h-full"
                                        />
                                        {selectedImage === img.url && (
                                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                <div className="bg-primary text-primary-foreground rounded-full p-1">
                                                    <Check className="h-4 w-4" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleConfirm} disabled={!selectedImage}>Select Image</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
