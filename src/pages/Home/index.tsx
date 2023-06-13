import { Play, HandPalm } from "phosphor-react";
import { useContext, useEffect, useState } from "react";
import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { FormProvider } from "react-hook-form";
import { NewCycleForm } from "./components/NewCycleForm/index";
import { Countdown } from "./components/Countdown/index";
import { CycleContext } from "../../contexts/CycleContext";

// interface NewCycleFormData {
//     task: string,
//     minutesAmount: number
// }


export function Home() {

    const { activeCycle, createNewCycle, interruptCurrentCycle } = useContext(CycleContext)
    
    const newCycleFormValidationSchema = zod.object({
        task: zod.string().min(1, 'Informe a tarefa'),
        minutesAmount: zod.number().min(1, 'O ciclo precisa ser de no mínimo 5 minutos').max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
    })

    type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

    const newCicleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    })

    const { handleSubmit, watch, reset} = newCicleForm


    function handleCreateNewCycle(data: NewCycleFormData) {
        createNewCycle(data)
        reset()
    }
    
    const task = watch('task')
    const isSubmitDisabled = !task

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">        
                
                
                <FormProvider {...newCicleForm}>
                    <NewCycleForm />
                </FormProvider>
                <Countdown />
                
                
                { activeCycle ? (
                    <StopCountdownButton onClick={interruptCurrentCycle} type="button">
                    <HandPalm />    
                    Interromper
                    </StopCountdownButton>
                ): (
                    <StartCountdownButton disabled={isSubmitDisabled} type="submit">
                        <Play />    
                        Começar
                    </StartCountdownButton>
                )
                }       
            </form>
        </HomeContainer>
    )
}