import { ReactNode } from 'react';
import { Menu, MenuProps, SxProps, Theme } from '@mui/material';

type GlassPopoverProps = {
    anchorEl: MenuProps['anchorEl'];
    open: boolean;
    onClose: () => void;
    onClick?: MenuProps['onClick'];
    children: ReactNode;
    id?: string;
    width?: number | string;
    maxHeight?: number | string;
    /** Distance in px from the right edge of the paper to the bubble-arrow tip. */
    arrowOffset?: number;
    anchorOrigin?: MenuProps['anchorOrigin'];
    transformOrigin?: MenuProps['transformOrigin'];
    paperSx?: SxProps<Theme>;
};

/**
 * De-duplicates the hand-rolled "speech bubble" Menu (rotated-square arrow +
 * positioning) previously copy-pasted in NotificationBell and UserMenu. The
 * glass fill/blur/radius/shadow itself comes from the global MuiMenu
 * styleOverrides in theme.ts — this component only owns the arrow + sizing.
 */
export default function GlassPopover({
    anchorEl,
    open,
    onClose,
    onClick,
    children,
    id,
    width = 320,
    maxHeight,
    arrowOffset = 28,
    anchorOrigin = { horizontal: 'right', vertical: 'bottom' },
    transformOrigin = { horizontal: 'right', vertical: 'top' },
    paperSx,
}: GlassPopoverProps) {
    return (
        <Menu
            anchorEl={anchorEl}
            id={id}
            open={open}
            onClose={onClose}
            onClick={onClick}
            anchorOrigin={anchorOrigin}
            transformOrigin={transformOrigin}
            slotProps={{
                paper: {
                    sx: {
                        width,
                        maxHeight,
                        overflow: 'visible',
                        mt: 1.5,
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: arrowOffset,
                            width: 10,
                            height: 10,
                            bgcolor: 'inherit',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                        ...paperSx,
                    },
                },
            }}
        >
            {children}
        </Menu>
    );
}
