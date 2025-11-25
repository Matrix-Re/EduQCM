import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select"

type Option = {
    value: string
    label: string
}

type Props = {
    items: Option[]
    value?: string
    onValueChange?: (value: string) => void
    placeholder?: string
    label?: string
    disabled?: boolean
}

export function SelectCustom({ items, value, onValueChange, placeholder = "Select an option", label = "Options", disabled }: Props) {
    return (
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{label}</SelectLabel>
                    {items.map((it) => (
                        <SelectItem key={it.value} value={it.value}>
                            {it.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}