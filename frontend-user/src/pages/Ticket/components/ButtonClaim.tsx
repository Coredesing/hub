import React, { MouseEventHandler } from 'react'
import { ButtonYellow } from './ButtonYellow'

type Props = {
    onClick: MouseEventHandler,
    disabled?: boolean
}
export const ButtonClaim = ({
    disabled,
    onClick,
    ...props }: Props) => {
    return (
        <ButtonYellow onClick={onClick}
            disabled={disabled}>
            Claim
        </ButtonYellow>
    )
}
