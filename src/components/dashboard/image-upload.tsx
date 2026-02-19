'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui'
import { Camera, X, Loader2, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
    onUploadComplete: (urls: string[]) => void
    onCoverSelect: (url: string) => void
    maxFiles?: number
}

export function ImageUpload({ onUploadComplete, onCoverSelect, maxFiles = 10 }: ImageUploadProps) {
    const supabase = createClient()
    const [uploading, setUploading] = useState(false)
    const [images, setImages] = useState<{ url: string; path: string; isCover: boolean }[]>([])

    async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        try {
            setUploading(true)
            if (!e.target.files || e.target.files.length === 0) return

            const files = Array.from(e.target.files)
            const newImages = [...images]

            for (const file of files) {
                if (newImages.length >= maxFiles) break

                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const filePath = `${fileName}`

                const { error: uploadError, data } = await supabase.storage
                    .from('property-images')
                    .upload(filePath, file)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('property-images')
                    .getPublicUrl(filePath)

                const isFirst = newImages.length === 0
                newImages.push({ url: publicUrl, path: filePath, isCover: isFirst })

                if (isFirst) {
                    onCoverSelect(publicUrl)
                }
            }

            setImages(newImages)
            onUploadComplete(newImages.map(img => img.url))
        } catch (error: any) {
            alert(error.message)
        } finally {
            setUploading(false)
        }
    }

    function removeImage(index: number) {
        const newImages = images.filter((_, i) => i !== index)
        setImages(newImages)

        // If we removed the cover, set the next one as cover if it exists
        if (images[index].isCover && newImages.length > 0) {
            newImages[0].isCover = true
            onCoverSelect(newImages[0].url)
        } else if (newImages.length === 0) {
            onCoverSelect('')
        }

        onUploadComplete(newImages.map(img => img.url))
    }

    function setAsCover(index: number) {
        const updated = images.map((img, i) => ({
            ...img,
            isCover: i === index
        }))
        setImages(updated)
        onCoverSelect(images[index].url)
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {images.map((img, i) => (
                    <div key={i} className="group relative aspect-square rounded-xl border border-border bg-muted overflow-hidden">
                        <img src={img.url} alt="upload" className="h-full w-full object-cover" />
                        <button
                            onClick={() => removeImage(i)}
                            className="absolute top-2 right-2 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="h-3 w-3" />
                        </button>
                        <button
                            onClick={() => setAsCover(i)}
                            className={cn(
                                "absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all",
                                img.isCover ? "bg-primary text-white" : "bg-black/50 text-white opacity-0 group-hover:opacity-100"
                            )}
                        >
                            {img.isCover ? "Cover" : "Set Cover"}
                        </button>
                    </div>
                ))}

                {images.length < maxFiles && (
                    <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all">
                        {uploading ? (
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        ) : (
                            <>
                                <Camera className="h-6 w-6 text-muted-foreground" />
                                <span className="mt-2 text-xs font-medium text-muted-foreground">Add Photo</span>
                            </>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            disabled={uploading}
                            className="hidden"
                            onChange={handleFileSelect}
                        />
                    </label>
                )}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
                <ImageIcon className="h-3 w-3" />
                Upload up to {maxFiles} high-quality images. The first one is your cover.
            </p>
        </div>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}
