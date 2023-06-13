import { differenceInSeconds } from "date-fns";
import { useEffect, useContext } from "react";
import { CycleContext } from "../../../../contexts/CycleContext";
import { CountdownContainer, Separator } from "./styles";

export function Countdown() {

    //obtendo dados do contexto compartilhado
    const { activeCycle, activeCycleId, markCurrentCycleAsFinished, amountSecondsPassed, setSecondsPassed } = useContext(CycleContext)


    //converter o numero de minutos do ciclo em segundos, para tal verifica se existe um ciclo ativo, pois o programa começa indefinido, se tiver pega o valor de minutesAmount e multiplica por 60, senão atribui 0
    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

    //para o segundo atual, pega a diferenca entre o total de segundos e a quantidade de segundos que passou informada no estado amountSecondsPassed
    const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

    //apartir do total de segundos atual, converter quantos minutos existem, arredondando pra baixo
    const minutesAmount = Math.floor(currentSeconds / 60)

    //quantidade de segundos restantes
    const secondsAmount = currentSeconds % 60

    //minutos em formato de string, definindo a quantidade de caracteres como 2 e caso seja menor, completando com 0
    const minutes = String(minutesAmount).padStart(2, '0')

    //segundos em formato de string, definindo a quantidade de caracteres como 2 e caso seja menor, completando com 0
    const seconds = String(secondsAmount).padStart(2, '0')
    
    useEffect(() => {
        if (activeCycle) {
            document.title = `${minutes}:${seconds}`
        }
    }, [minutes, seconds, activeCycle])

    
    useEffect(() => {
        
        let interval: number
        
        if (activeCycle) {
            interval = setInterval(() => {
                const secondsDifference = differenceInSeconds(
                    new Date, 
                    new Date(activeCycle.startDate)
                )

                if (secondsDifference >= totalSeconds) {
                    markCurrentCycleAsFinished()   
                    setSecondsPassed(totalSeconds)
                    clearInterval(interval)
                } 
                //só atualiza o contador de segundos se a diferença dos valores não for igual ao total
                else {
                    setSecondsPassed(secondsDifference)
                }
            }, 1000)
        }

        return () => {
            clearInterval(interval);
        }

    }, [activeCycle, totalSeconds, activeCycleId, markCurrentCycleAsFinished, setSecondsPassed])

    return (
        <CountdownContainer>
            <span>{minutes[0]}</span>
            <span>{minutes[1]}</span>
            <Separator>:</Separator>
            <span>{seconds[0]}</span>
            <span>{seconds[1]}</span>
        </CountdownContainer>

    )

}