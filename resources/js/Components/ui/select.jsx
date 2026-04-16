import * as React from "react"
import { Listbox, Transition } from '@headlessui/react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from "@/lib/utils"

const Select = ({ value, onValueChange, children }) => (
  <Listbox value={value} onChange={onValueChange}>
    <div className="relative mt-1">{children}</div>
  </Listbox>
);

const SelectTrigger = ({ className, children }) => (
  <Listbox.Button className={cn(
    "relative w-full cursor-default rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 sm:text-sm font-bold transition-all",
    className
  )}>
    <span className="block truncate">{children}</span>
    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
      <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
    </span>
  </Listbox.Button>
);

const SelectValue = ({ placeholder }) => {
  const { value } = React.useContext(Listbox.Context || {}); // Fallback if context is not exported
  return <span>{value || placeholder}</span>;
};

const SelectContent = ({ className, children }) => (
  <Transition
    as={React.Fragment}
    leave="transition ease-in duration-100"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
  >
    <Listbox.Options className={cn(
      "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-2xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-slate-200",
      className
    )}>
      {children}
    </Listbox.Options>
  </Transition>
);

const SelectItem = ({ value, children, className }) => (
  <Listbox.Option
    className={({ active }) => cn(
      "relative cursor-default select-none py-2 pl-10 pr-4",
      active ? "bg-amber-50 text-amber-900" : "text-slate-900",
      className
    )}
    value={value}
  >
    {({ selected }) => (
      <>
        <span className={cn("block truncate font-bold uppercase text-[10px] tracking-widest", selected ? "text-amber-600" : "text-slate-600")}>
          {children}
        </span>
        {selected ? (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
            <Check className="h-4 w-4" aria-hidden="true" />
          </span>
        ) : null}
      </>
    )}
  </Listbox.Option>
);

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
