import {Button} from '@/components/ui/button'
import {ArrowLeftSquareIcon, ArrowRightSquareIcon, HomeIcon, RefreshCwIcon} from 'lucide-react'
import {useEffect, useState} from 'react'
import {Input} from './ui/input'
import {useLocation, useNavigate, useNavigation} from 'react-router-dom'

export default function BrowserNav() {
    const navigate = useNavigate()
    const location = useLocation()
    const pathname = location.pathname
    const [address, setAddress] = useState(pathname)
    const navigation = useNavigation();

    let isNormalLoad =
        navigation.state === "loading" &&
        navigation.formData == null;

// Are we reloading after an action?
    let isReloading =
        navigation.state === "loading" &&
        navigation.formData != null &&
        navigation.formAction === navigation.location.pathname;

// Are we redirecting after an action?
    let isRedirecting =
        navigation.state === "loading" &&
        navigation.formData != null &&
        navigation.formAction !== navigation.location.pathname;

    useEffect(() => {
        console.log(navigation.state)
        console.log(isNormalLoad)
        console.log(isReloading)
        console.log(isRedirecting)
        setAddress(pathname)
    }, [isNormalLoad, isRedirecting, isReloading, navigation, pathname]);

    return (
        <div className='flex w-full py-4 px-2 justify-center items-center gap-1'>
            {/* Back button */}
            <Button variant={"ghost"} size={"icon"}
                    onClick={() => navigate(-1)}><ArrowLeftSquareIcon/></Button>
            {/* Forward button */}
            <Button variant={"ghost"} size={"icon"}
                    onClick={() => navigate(1)}><ArrowRightSquareIcon/></Button>
            {/* Reload button */}
            <Button variant={"ghost"} size={"icon"} onClick={() => navigate(0)}><RefreshCwIcon/></Button>
            {/* Home button */}
            <Button variant={"ghost"} size={"icon"} onClick={() => navigate('/')}><HomeIcon/></Button>
            {/* Address bar */}
            <form onSubmit={(e) => {
                e.preventDefault()
                navigate(address)
            }} className='w-full px-2'>
                <Input className='w-full' type="text" value={address}
                       onClick={(e) => e.currentTarget.setSelectionRange(1, e.currentTarget.value.length)}
                       onChange={(e) => setAddress(e.target.value)}/>
            </form>
            {/* Address bar */}


            {/* Search bar */}
            {/* Bookmarks button */}
            {/* History button */}
            {/* Settings button */}
        </div>
    )
}
