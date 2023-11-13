import { useAboutModal } from '@/hooks/atoms/useAboutModal'
import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from './ui/dialog'
import { useVersion } from '@/hooks/atoms/useVersion'

export default function AboutModal() {

    const { setShowAboutModal, showAboutModal } = useAboutModal()
    const { version } = useVersion()
    const [isCheckingForUpdate, setIsCheckingForUpdate] = React.useState(false)

    async function checkForUpdate() {
        setIsCheckingForUpdate(true)
        await window.app.checkForUpdates()
        setIsCheckingForUpdate(false)
    }

    return (
        <Dialog
            open={showAboutModal}
            onOpenChange={setShowAboutModal}
        >
            <DialogOverlay />
            <DialogPortal>
                <DialogTrigger>
                    <button className="hidden"></button>
                </DialogTrigger>
                <DialogContent
                    className='md:w-fit'
                >
                    <DialogHeader>
                        <DialogTitle>About</DialogTitle>
                        <DialogDescription>
                            <p className="text-sm text-gray-500">Version {version} - {" "}
                                <button
                                    className="text-sm text-gray-500 hover:text-gray-700"
                                    onClick={checkForUpdate}
                                >
                                    {isCheckingForUpdate ? 'Checking for update...' : 'Check for update'}
                                </button>
                            </p>
                            <p className="text-sm text-gray-500">ITSDU - SDU itslearning desktop app built for students</p>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-4 flex">
                        <div className='flex flex-col mr-6 shrink-0'>
                            <img src="itsl-itslearning-file://i_logo_colored.png" alt="ITSDU Logo" className="w-20 h-20 mx-auto" />
                            <hr className="my-6" />
                            <img src="itsl-itslearning-file://icon.ico" alt="itslearning Logo" className="w-20 h-20 mx-auto" />
                        </div>
                        <p className="text-sm text-gray-500">
                            ITSDU is a desktop app built for students at SDU to access itslearning in a more convenient way.
                            <br />
                            <br />
                            ITSDU is not affiliated with itslearning or SDU in any way.
                            <br />
                            <br />
                            ITSDU is built by students for students.
                        </p>
                    </div>
                    <DialogFooter>
                        <p className="text-sm text-gray-500">Created by Daniel Bermann Schmidt</p>
                    </DialogFooter>
                </DialogContent>
            </DialogPortal>
        </Dialog >
    )
}
