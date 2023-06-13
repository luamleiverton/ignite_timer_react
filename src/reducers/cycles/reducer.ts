import { ActionTypes } from "./actions"
import { produce } from 'immer'

//tipando cada ciclo que a aplicação vai desenvolver
export interface Cycle {
    id: string
    task: string
    minutesAmount: number
    startDate: Date
    interruptedDate?: Date
    finishedDate?: Date
}

interface CycleState {
    cycles: Cycle[]
    activeCycleId: string | null
}


export function CyclesReducer(state: CycleState, action: any) {
    switch(action.type) {
        case ActionTypes.ADD_NEW_CYCLE:
            return produce(state, (draft: CycleState) => {
                draft.cycles.push(action.payload.newCycle)
                draft.activeCycleId = action.payload.newCycle.id
            })

        case ActionTypes.INTERRUPT_CURRENT_CYCLE: {

            const currentCycleIndex = state.cycles.findIndex((cycle) => {
                return cycle.id === state.activeCycleId
            })

            if (currentCycleIndex < 0) {
                return state
            }

            return produce(state, (draft: CycleState) => {
                draft.activeCycleId = null
                draft.cycles[currentCycleIndex].interruptedDate = new Date()
            })
        }
        case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED:{

            const currentCycleIndex = state.cycles.findIndex((cycle) => {
                return cycle.id === state.activeCycleId
            })

            if (currentCycleIndex < 0) {
                return state
            }

            return produce(state, (draft: CycleState) => {
                draft.activeCycleId = null
                draft.cycles[currentCycleIndex].finishedDate = new Date()
            })
        }
        default: 
            return state
    }
}