import {Button} from '@/components/ui/button'
import {ArrowLeftCircleIcon, ArrowRightCircleIcon, HomeIcon, RefreshCwIcon} from 'lucide-react'
import {useEffect, useState} from 'react'
import {Input} from './ui/input'
import {useLocation, useNavigate, useNavigation} from 'react-router-dom'
import {AnimatePresence, m} from 'framer-motion';
import {useBrowseNavigation} from '@/hooks/atoms/useBrowseNavigation'
import {queryClient} from '@/lib/tanstack-client'

export default function BrowserNav() {
    const {showBrowseNavigation, toggleBrowseNavigation} = useBrowseNavigation()
    const navigate = useNavigate()
    const location = useLocation()
    const pathname = location.pathname
    const [address, setAddress] = useState(pathname)
    const navigation = useNavigation();

    useEffect(() => {
        const pathname = location.pathname
        const search = location.search
        setAddress(pathname + search)
        // console.log(navigation)
    }, [location.pathname, location.search, navigation]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // alt left and right arrow
            if (e.altKey && e.key === 'ArrowLeft') {
                e.preventDefault()
                navigate(-1)
            } else if (e.altKey && e.key === 'ArrowRight') {
                e.preventDefault()
                navigate(1)
            }

            if (e.ctrlKey && e.key === 'r') {
                e.stopPropagation()
                console.log('reload')
                window.auth.refresh().then(() => {
                    navigate(0)
                }).catch(() => {
                    navigate(0)
                })
                queryClient.invalidateQueries()
                queryClient.resetQueries()
            }

            if (e.ctrlKey && e.key === 'l') {
                e.stopPropagation()
                console.log('focus address bar')
                document.querySelector('input')?.focus()
                console.log(document.querySelector('input'))
            }

            if (e.ctrlKey && e.key === 'b') {
                e.preventDefault()
                toggleBrowseNavigation()
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [navigate]);

    return (
        <AnimatePresence>
            {showBrowseNavigation &&
                <m.div
                    layout
                    initial={{opacity: 0, height: 0}}
                    animate={{opacity: 1, height: "auto"}}
                    exit={{opacity: 0, height: 0}}
                    className="shrink-0 no-drag"
                >
                    <div
                        className='mt-2 mb-4 flex w-full items-center justify-center gap-1 border-y-2 px-2 py-4 drag border-foreground-50 no-drag'>
                        {/* Back button */}
                        <Button className='no-drag' variant={"ghost"} size={"icon"}
                                onClick={() => navigate(-1)}><ArrowLeftCircleIcon/></Button>
                        {/* Forward button */}
                        <Button className='no-drag' variant={"ghost"} size={"icon"}
                                onClick={() => navigate(1)}><ArrowRightCircleIcon/></Button>
                        {/* Reload button */}
                        <Button className='no-drag' variant={"ghost"} size={"icon"}
                                onClick={() => navigate(0)}><RefreshCwIcon/></Button>
                        {/* Home button */}
                        <Button className='no-drag' variant={"ghost"} size={"icon"}
                                onClick={() => navigate('/')}><HomeIcon/></Button>
                        {/* Address bar */}
                        <form onSubmit={(e) => {
                            e.preventDefault()
                            navigate(address)
                        }} className='w-full px-2 no-drag'>
                            <Input className='w-full' type="text" value={address}
                                   onClick={(e) => e.currentTarget.setSelectionRange(1, e.currentTarget.value.length)}
                                   onChange={(e) => setAddress(e.target.value)}/>
                        </form>
                    </div>
                </m.div>
            }
        </AnimatePresence>

    )
}
