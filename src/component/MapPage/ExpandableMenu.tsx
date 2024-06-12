import React, { useState } from 'react';
import { Variants, motion } from "framer-motion"

interface MenuButtonProps {
    classString: string;
    label: React.ReactNode;
    children: React.ReactNode[];
}

const defaultVariants: Variants = {
    open: {
        opacity: 0,
        display: 'none'
    },
    closed: { opacity: 1, display: '' }
};

const itemVariants: Variants = {
    open: {
        opacity: 1,
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 24, duration: 0.2 }
    },
    closed: { opacity: 0, x: 20, display: 'none', transition: { duration: 0.2 } }
};

const itemContainer = {
    open: () => ({
        transition: {
            type: "spring",
            bounce: 0,
            delay: 0.1,
            duration: 0.4,
            staggerChildren: 0.1
        }
    }),
    closed: {
        display: 'none',
        transition: {
            type: "spring",
            bounce: 0,
            duration: 0.4,
            staggerChildren: 0.1
        }
    }
};

const displayButton = {
    open: () => ({
        opacity: 0,
        x: -20,
        display: 'none',
        transition: {
            type: "spring", stiffness: 200, damping: 24,
            duration: 0.2,
        }
    }),
    closed: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring", stiffness: 200, damping: 24,
            duration: 0.2,
            delay: 0.4,
        }
    }
};

export const ExpandableMenu: React.FC<MenuButtonProps> = ({ classString, label, children }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <motion.div animate={isOpen ? "open" : "closed"} >
                <motion.div onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}
                    className={'controlPanel-container controlPanel-container-display ' + classString}
                    layout
                    variants={displayButton}
                    style={isOpen ? { boxShadow: '0px 0px 0px' } : { boxShadow: '' }}
                >
                    {label}
                </motion.div >
                <motion.div onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}
                    className={'controlPanel-container ' + classString}
                    layout
                    variants={itemContainer}
                >
                    {children && children.map(child => {
                        return <motion.div variants={itemVariants}>{child}</motion.div>
                    })}
                </motion.div >
            </motion.div >
        </>
    )
};
