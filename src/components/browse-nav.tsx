import { Button } from '@/components/ui/button'
import { ArrowLeftSquareIcon, ArrowRightSquareIcon, HomeIcon, RefreshCwIcon } from 'lucide-react'
import { useState } from 'react'
import { Input } from './ui/input'
import { useLocation, useNavigate } from 'react-router-dom'

export default function BrowserNav() {
    const navigate = useNavigate()
    const navigation = useLocation()
    console.log(navigation)
    const pathname = navigation.pathname
    const [address, setAddress] = useState(pathname)

    return (
        <div className='flex w-full py-4 px-2 justify-center items-center gap-1'>
            {/* Back button */}
            <Button variant={"ghost"} size={"icon"} onClick={() => window.history.back()}><ArrowLeftSquareIcon /></Button>
            {/* Forward button */}
            <Button variant={"ghost"} size={"icon"} onClick={() => window.history.forward()}><ArrowRightSquareIcon /></Button>
            {/* Reload button */}
            <Button variant={"ghost"} size={"icon"} onClick={() => window.location.reload()}><RefreshCwIcon /></Button>
            {/* Home button */}
            <Button variant={"ghost"} size={"icon"} onClick={() => navigate('/')}><HomeIcon /></Button>
            {/* Address bar */}
            <form onSubmit={() => navigate(address)} className='w-full px-2'>
                <Input className='w-full' type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
            </form>
            {/* Address bar */}






            {/* Search bar */}
            {/* Bookmarks button */}
            {/* History button */}
            {/* Settings button */}
        </div>
    )
}
