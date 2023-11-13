import {Button} from '@/components/ui/button'
import {ArrowLeftCircleIcon, ArrowRightCircleIcon, HomeIcon, RefreshCwIcon} from 'lucide-react'
import {useEffect, useState} from 'react'
import {Input} from './ui/input'
import {useLocation, useNavigate, useNavigation, useSearchParams} from 'react-router-dom'

export default function BrowserNav() {
    const navigate = useNavigate()
    const location = useLocation()
    const pathname = location.pathname
    const [address, setAddress] = useState(pathname)
    const navigation = useNavigation();
    // eslint-disable-next-line no-unused-vars
    let [searchParams] = useSearchParams();

    searchParams.forEach((value, key) => console.log(key, value));

    useEffect(() => {
        const pathname = location.pathname
        const search = location.search
        setAddress(pathname + search)
        // console.log(navigation)
    }, [location.pathname, location.search, navigation]);

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
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
                navigate(0)
            }

            if (e.ctrlKey && e.key === 'l') {
                e.stopPropagation()
                console.log('focus address bar')
                document.querySelector('input')?.focus()
                console.log(document.querySelector('input'))
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [navigate]);

    return (
        <div
            className='drag flex w-full py-4 px-2 justify-center items-center gap-1 mb-4 mt-2 border-foreground-50 border-y-2'>
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
            }} className='no-drag w-full px-2'>
                <Input className='w-full' type="text" value={address}
                       onClick={(e) => e.currentTarget.setSelectionRange(1, e.currentTarget.value.length)}
                       onChange={(e) => setAddress(e.target.value)}/>
            </form>
        </div>
    )
}
