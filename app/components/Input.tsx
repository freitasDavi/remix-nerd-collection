import type { InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string,
}

export const Input = ({ label, id, ...rest }: InputProps) => {
    return (
        <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-500 capitalize"
        >
            {label}
            <input
                id={id}
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                {...rest}
            />
        </label>
    )
}