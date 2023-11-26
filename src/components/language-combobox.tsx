import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import React from "react"

const languages = [
    { label: "English", value: "en" },
    { label: "Danish", value: "dk" },
    // { label: "French", value: "fr" },
    // { label: "German", value: "de" },
    // { label: "Spanish", value: "es" },
    // { label: "Portuguese", value: "pt" },
    // { label: "Russian", value: "ru" },
    // { label: "Japanese", value: "ja" },
    // { label: "Korean", value: "ko" },
    // { label: "Chinese", value: "zh" },
] as const

export function LanguageCombobox({ disabled }: { disabled?: boolean }) {

    const [field, setField] = React.useState<typeof languages[number]>(languages[0])

    return (

        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                        "w-[200px] active:scale-100 scale-100 justify-between border-2 border-transparent text-foreground border-purple-500 bg-foreground-200 text-white",
                        !field.value && "text-muted-foreground"
                    )}
                    disabled={disabled}
                >
                    {field.value
                        ? languages.find(
                            (language) => language.value === field.value
                        )?.label
                        : "Select language"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[200px]">
                <Command
                    className="border-2 border-transparent border-purple-500 text-white text-foreground bg-foreground-200"
                >
                    <CommandInput placeholder="Search language..." />
                    <CommandEmpty>No language found.</CommandEmpty>
                    <CommandGroup>
                        {languages.map((language) => (
                            <CommandItem
                                value={language.label}
                                key={language.value}
                                onSelect={() => {
                                    if (language.value === field.value) return
                                    setField(language)
                                    toast({
                                        title: "Language changed",
                                        variant: "success",
                                        description: `You've changed the language to ${language.label}.`,
                                    })
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        language.value === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                                {language.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>

    )
}
