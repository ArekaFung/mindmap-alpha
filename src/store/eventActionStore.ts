import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid';
import { Node } from 'reactflow'

type TicketHandle = 'Maintain' | 'New Ticket' | 'Reset'

interface ActionParamProps {
    nodeArr?: Node[],
    boardID?: number
    boardTitle?: string,
    ticket?: string,
    pruneParentSpawnedNodeID?: string,
    pruneChildSpawnedNodeID?: string,
}

interface EventActionStoreProps {
    reset: (inTicket?: string) => void //cannot extend normal StoreProps' reset()
    action: ActionTypes
    ticket: string | null
    actionParam: ActionParamProps | null,
    setAction: (inTicket: string | null, inAction: ActionTypes, inParma: ActionParamProps | null, ticketHandle: TicketHandle) => string | null
    newTicket: (inTicket: string | null) => string | null
}

export const useEventActionStore = create<EventActionStoreProps>((set, get) => ({
    reset: (inTicket?: string) => {
        get().setAction(inTicket === undefined ? null : inTicket, null, null, 'Reset')
    },

    action: null,
    ticket: null,
    actionParam: null,

    setAction: (inTicket: string | null, inAction: ActionTypes, inParma: ActionParamProps | null, ticketHandle: TicketHandle) => {
        const currTicket = get().ticket

        // allowed scenarios:
        // if no ticket exist, means can freely update
        // if ticket exist (means some action is locking the state) and match with inTicket, can carryout update
        if (currTicket !== null && currTicket !== inTicket) {
            console.error("Trying to set action with not matching ticket: ", currTicket, inTicket)
            return null
        }

        set({ action: inAction, actionParam: inParma })

        switch (ticketHandle) {
            case 'Maintain':
                return currTicket
            case 'New Ticket':
                return get().newTicket(inTicket)
            case 'Reset':
                set({ ticket: null })
                return null
            default:
                return null
        }
    },
    newTicket: (inTicket: string | null) => {
        const currTicket = get().ticket
        if (currTicket !== null && currTicket !== inTicket) {
            console.error("Trying to get newTicket with not matching ticket: ", currTicket, inTicket)
            return null
        }

        const newTicket = uuidv4()
        set({ ticket: newTicket })
        return newTicket
    }
}))