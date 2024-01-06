import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import useGETpreviousChats from '@/queries/AI/useGETpreviousChats'
import { useCycle } from 'framer-motion'
import { ArrowRightIcon, DownloadIcon } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom';
import React, { createContext, useContext, useState } from 'react'

export default function AIChats() {
    let { page } = useParams()
    if (page === undefined) {
        page = "1"
    }
    const pageInt = parseInt(page)

    const { data } = useGETpreviousChats({
        pageIndex: pageInt - 1
    }, {
        suspense: true
    })

    console.log(data)

    let pagesNum

    if (data?.pages[0].totalFiles === 0 || data?.pages[0].totalFiles === undefined || data === undefined) {
        pagesNum = 0
    } else {
        pagesNum = Math.ceil(data?.pages[0].totalFiles / data?.pages[0].pageSize)
    }

    if (data?.pages.length === 0 || data?.pages.length === undefined || data?.pages[0].files.length === 0) {
        return (
            <div className="container mx-auto p-4 md:p-6">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 xl:mb-16">Previous AI Chats</h1>
                <div className="grid gap-6 grid-cols-2">
                    <p>No AI Chats found</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 md:p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 xl:mb-16">Previous AI Chats</h1>
            <div className="grid gap-6 grid-cols-2">
                <AIChatsGrid page={pageInt} />
                <PaginationControls pagesNum={pagesNum} page={pageInt} />
            </div>
        </div>
    )
}

function AIChatsGrid({ page }: { page: number }) {

    const { data } = useGETpreviousChats({
        pageIndex: page - 1
    }, {
        suspense: true
    })

    return (
        <>
            {data?.pages[0].files.map((file) => (
                <AIChatCard
                    key={file.elementId}
                    title={file.filename || "Untitled"}
                    date={new Date(file.timestamp)}
                    // description={file.description}
                    elementId={file.elementId}
                />
            ))}
        </>
    )
}

function PaginationControls({ pagesNum, page }: { pagesNum: number, page: number }) {
    const navigate = useNavigate()

    const handleNext = () => {
        if (page < pagesNum) {
            navigate(`/ai-chats/${page + 1}`)
        }
    }

    const handlePrev = () => {
        if (page > 1) {
            navigate(`/ai-chats/${page - 1}`)
        }
    }

    const setPage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value)
        if (value > 0 && value <= pagesNum) {
            navigate(`/ai-chats/${value}`)
        }
    }

    return (
        <div className="col-span-2">
            <div className="flex justify-between items-center">
                <Button variant="outline" onClick={handlePrev}>Prev</Button>
                <div className="flex items-center">
                    <p className="mr-2">Page</p>
                    <Input
                        type="number"
                        value={page}
                        onChange={setPage}
                        className="w-16 h-8 text-center"
                        min={1}
                        max={pagesNum}
                    />
                    <p className="ml-2">of {pagesNum}</p>
                </div>
                <Button variant="outline" onClick={handleNext}>Next</Button>
            </div>
        </div>
    )
}

function AIChatCard({ title, date, description, elementId }: { title: string, date: Date, description?: string, elementId: number }) {

    const navigate = useNavigate()

    const handleDownload = async () => {
        await window.download.start(elementId, title)
    }

    const handleGoToChat = async () => {
        navigate(`/documents/pdf/${elementId}`)
    }

    return (
        <Card className="w-full max-w-md m-auto">
            <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="font-semibold text-lg truncate">{title}</h2>
                    <Badge className="font-normal ml-2">{date.toLocaleDateString()}</Badge>
                </div>
                {description && <p className="text-gray-500">{description}</p>}
                <div className="mt-4 grid lg:grid-cols-2 grid-cols-1 gap-4">
                    <Button variant="outline"
                        onClick={handleDownload}
                    >
                        <DownloadIcon className="w-4 h-4 mr-2" />
                        Download as PDF
                    </Button>
                    <Button variant="outline"
                        onClick={handleGoToChat}
                    >
                        <ArrowRightIcon className="w-4 h-4 mr-2" />
                        Go to AI Chat
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
