import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import useGETpreviousChats from '@/queries/AI/useGETpreviousChats'
import { useCycle } from 'framer-motion'
import { ArrowRightIcon, DownloadIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import React, { createContext, useContext, useState } from 'react'

interface PaginationContextProps {
    pagesNum: number
    page: number
    setPage: React.Dispatch<React.SetStateAction<number>>
}

const PaginationContext = createContext<PaginationContextProps | undefined>(undefined)

function PaginationProvider({ pagesNum, children, DEFAULT_PAGE = 1 }: { pagesNum: number, children: React.ReactNode, DEFAULT_PAGE?: number }) {
    const [page, setPage] = useState(DEFAULT_PAGE)

    return (
        <PaginationContext.Provider value={{ pagesNum, page, setPage }}>
            {children}
        </PaginationContext.Provider>
    )
}

const usePagination = () => {
    const context = useContext(PaginationContext)
    if (!context) {
        throw new Error('usePagination must be used within a PaginationProvider')
    }
    return context
}

export default function AIChats() {


    return (
        <div className="container mx-auto p-4 md:p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 xl:mb-16">Previous AI Chats</h1>
            <div className="grid gap-6 grid-cols-2">
                <AIChatsGridAndPagination pageNum={1}>
                    <AIChatsGrid />
                </AIChatsGridAndPagination>
            </div>
        </div>
    )
}

function AIChatsGrid() {
    const { page } = usePagination()

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

function AIChatsGridAndPagination({ pageNum, children }: { pageNum: number, children: React.ReactNode }) {

    const { data } = useGETpreviousChats({
        pageIndex: pageNum
    }, {
        suspense: true
    })

    let pagesNum

    if (data?.pages[0].totalFiles === 0 || data?.pages[0].totalFiles === undefined || data === undefined) {
        pagesNum = 0
    } else {
        pagesNum = Math.ceil(data?.pages[0].totalFiles / data?.pages[0].pageSize)
    }

    if (data?.pages.length === 0 || data?.pages.length === undefined) {
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
        <PaginationProvider pagesNum={pagesNum}>
            {children}
            <PaginationControls />
        </PaginationProvider>
    )
}


function PaginationControls() {
    const { pagesNum, page, setPage } = usePagination()

    const handleNext = () => {
        if (page < pagesNum) {
            setPage(page + 1)
        }
    }

    const handlePrev = () => {
        if (page > 1) {
            setPage(page - 1)
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
                        onChange={(e) => setPage(parseInt(e.target.value))}
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
