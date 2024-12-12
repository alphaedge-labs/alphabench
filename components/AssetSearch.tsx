'use client'

import * as React from "react"
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const assets = [
  { value: "aapl", label: "Apple Inc. (AAPL)" },
  { value: "googl", label: "Alphabet Inc. (GOOGL)" },
  { value: "msft", label: "Microsoft Corporation (MSFT)" },
  { value: "amzn", label: "Amazon.com Inc. (AMZN)" },
  { value: "fb", label: "Meta Platforms Inc. (FB)" },
  { value: "tsla", label: "Tesla Inc. (TSLA)" },
  { value: "nvda", label: "NVIDIA Corporation (NVDA)" },
  { value: "nflx", label: "Netflix Inc. (NFLX)" },
  { value: "dis", label: "The Walt Disney Company (DIS)" },
  { value: "nifty50", label: "NIFTY 50 Index" },
  { value: "banknifty", label: "Bank NIFTY Index" },
]

export function AssetSearch() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full max-w-[300px] justify-between"
        >
          {value
            ? assets.find((asset) => asset.value === value)?.label
            : "Select asset..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search asset..." />
          <CommandList>
            
          <CommandEmpty>No asset found.</CommandEmpty>
          <CommandGroup>
            {assets.map((asset) => (
              <CommandItem
                key={asset.value}
                value={asset.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === asset.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {asset.label}
              </CommandItem>
            ))}
          </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

