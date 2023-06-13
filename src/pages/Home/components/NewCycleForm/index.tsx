import { FormContainer, MinutesAmountInput, TaskInput } from "./styles"
import { useContext } from "react"
import { useFormContext } from "react-hook-form"
import { CycleContext } from "../../../../contexts/CycleContext"

export function NewCycleForm() {

    const { activeCycle } = useContext(CycleContext)
    const { register } = useFormContext()

    return (
        <FormContainer>
        <label htmlFor="task">Vou trabalhar em: </label>
        <TaskInput 
            id="task" 
            // list="task-suggestions" 
            placeholder="Atribua um nome ao projeto"
            disabled = {!!activeCycle}
            {...register('task')}
        />

        <label htmlFor="minutesAmount">durante: </label>
        <MinutesAmountInput 
            type="number" 
            id="minutesAmount" 
            step={5} 
            min={1} 
            max={60} 
            placeholder="00"
            disabled = {!!activeCycle}
            {...register('minutesAmount', { valueAsNumber: true })}    
        />
        <span>minutos.</span>
        </FormContainer>



    )
}