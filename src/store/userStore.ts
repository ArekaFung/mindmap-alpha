import { create } from 'zustand'
import { BaseStoreProps } from '~/store/baseStoreProps'

interface UserDataProps {
    uid: string
    email: string | null
}

interface UserStoreProps extends BaseStoreProps {
    userData: UserDataProps | null
    setUserData: (userdata: UserDataProps | null) => void
}

export const useUserStore = create<UserStoreProps>((set, get) => ({
    reset: () => {
        set({
            userData: null
        })
    },

    userData: null,
    setUserData: (userData) => {
        set({
            userData
        })
    },
}))
