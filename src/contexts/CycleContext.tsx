import { differenceInSeconds } from "date-fns/esm";
import { createContext, ReactNode, useEffect, useReducer, useState } from "react";
import { AddNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";
import { ActionTypes, Cycle, CyclesReducer } from "../reducers/cycles/reducer";


interface CreateCycleData {
    task: string
    minutesAmount: number
}


//tipando as propriedades que serão passadas para contexto - activeCycle como um ciclo ou undefined se ainda não setado
interface CyclesContextType {
    cycles: Cycle[]
    activeCycle: Cycle | undefined
    activeCycleId: string | null
    markCurrentCycleAsFinished: () => void
    amountSecondsPassed: number
    setSecondsPassed: (seconds: number) => void
    createNewCycle: (data: CreateCycleData) => void
    interruptCurrentCycle:  () => void
}

export const CycleContext = createContext({} as CyclesContextType)


interface CyclesContextProviderProps {
    children: ReactNode
}



export function CyclesContextProvider( {children}: CyclesContextProviderProps ) {

    const [cyclesState, dispatch] = useReducer(
        CyclesReducer,
        { cycles:[],
          activeCycleId: null,
        }, 
        //novo parametro no reducer recuperando os dados do localstorage
        //o initialstate é o estado anterior, caso não tenha nada no localstorage ele retorna o que foi declarado na criação do reduce
        (initialState) => {
            const storedStateAsJson = localStorage.getItem('@ignite-timer:cycles-state-1.0.0');
            if (storedStateAsJson) {
                return JSON.parse(storedStateAsJson)
            }
            return initialState
        }
    )

    const { cycles, activeCycleId } = cyclesState



    const activeCycle = cycles.find((cycle => cycle.id === activeCycleId))

    //criando o estado para armazenar a quantidade de segundos que passaram desde que o ciclo foi criado
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
        if (activeCycle) {
            return differenceInSeconds(new Date, new Date(activeCycle.startDate))
        }
        return 0
    })

    /*armazenando os ciclos no localstorage
        converte os dados do ciclo em formato json e armazena numa variável e armazena no localstorage
    */
    useEffect(() => {
        const stateJSON = JSON.stringify(cyclesState)
        localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON)
    }, [cyclesState])


    function createNewCycle(data: CreateCycleData) {

        const id = String(new Date().getTime())

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }
       
        dispatch(AddNewCycleAction(newCycle))

        setAmountSecondsPassed(0)
       
    }

    
    function interruptCurrentCycle() {
        dispatch(interruptCurrentCycleAction())
    }



    function markCurrentCycleAsFinished() {
        dispatch(markCurrentCycleAsFinishedAction())
    }

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }



    return (
        <CycleContext.Provider
            value={{
                cycles,
                activeCycle,
                activeCycleId,
                markCurrentCycleAsFinished,
                amountSecondsPassed,
                setSecondsPassed,
                createNewCycle,
                interruptCurrentCycle
            }}
        > { children }               
        </CycleContext.Provider>
    )
}