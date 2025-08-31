import type { HTMLAttributes, ReactNode } from "react";
import cn from 'clsx';
import styles from './Button.module.scss'

interface Props extends HTMLAttributes<HTMLButtonElement> {
    children?: ReactNode
}

export default function Button({children, ...rest}:Props) {
    return <button className={
        cn(styles.button, rest.className)
    } {...rest}>{children}</button>
}