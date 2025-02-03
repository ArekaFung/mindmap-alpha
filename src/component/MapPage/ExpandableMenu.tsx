import React, { useState } from 'react';
import { Variants, motion } from "framer-motion"

interface MenuButtonProps {
    classString: string;
    label: React.ReactNode;
    children: React.ReactNode[];
}

const itemVariants: Variants = {
    open: {
        opacity: 1,
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 24, duration: 0.1 }
    },
    closed: { opacity: 0, x: 20, display: 'none', transition: { duration: 0.1 } }
};

const itemContainer = {
    open: () => ({
        transition: {
            type: "spring",
            bounce: 0,
            duration: 0.2,
            staggerChildren: 0.05
        }
    }),
    closed: {
        display: 'none',
        transition: {
            type: "spring",
            bounce: 0,
            delay: 0.1,
            duration: 0.2,
            staggerChildren: 0.05
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
            delay: 0.2,
        }
    }
};

export const ExpandableMenu: React.FC<MenuButtonProps> = ({ classString, label, children }) => {
    const [isOpen, setIsOpen] = useState(false)
    var keyID = 0

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
                        return <motion.div variants={itemVariants} key={keyID++}>{child}</motion.div>
                    })}
                </motion.div >
            </motion.div >
        </>
    )
};
