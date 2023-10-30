import { Button } from '@/components/ui/button'
import { ArrowLeftSquareIcon, ArrowRightSquareIcon, HomeIcon, RefreshCwIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { useLocation, useNavigate, useNavigation, useSearchParams } from 'react-router-dom'
import SettingsDropdown from "@/components/settings-dropdown.tsx";

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
    }, [isNormalLoad, isRedirecting, isReloading, navigation, pathname]);

    return (
        <div className='flex w-full py-4 px-2 justify-center items-center gap-1 border-b-foreground-50 border-b-2'>
            {/* Back button */}
            <Button variant={"ghost"} size={"icon"}
                onClick={() => navigate(-1)}><ArrowLeftSquareIcon /></Button>
            {/* Forward button */}
            <Button variant={"ghost"} size={"icon"}
                onClick={() => navigate(1)}><ArrowRightSquareIcon /></Button>
            {/* Reload button */}
            <Button variant={"ghost"} size={"icon"} onClick={() => navigate(0)}><RefreshCwIcon /></Button>
            {/* Home button */}
            <Button variant={"ghost"} size={"icon"} onClick={() => navigate('/')}><HomeIcon /></Button>
            {/* Address bar */}
            <form onSubmit={(e) => {
                e.preventDefault()
                navigate(address)
            }} className='w-full px-2'>
                <Input className='w-full' type="text" value={address}
                    onClick={(e) => e.currentTarget.setSelectionRange(1, e.currentTarget.value.length)}
                    onChange={(e) => setAddress(e.target.value)} />
            </form>
            {/*    more settings dropdown*/}
            <SettingsDropdown />
        </div>
    )
}
