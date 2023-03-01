import { Heading, useToast, VStack } from "native-base";
import { Header } from "../components/Header";

import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useState } from "react";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export function Find() {
    const {navigate} = useNavigation()
    const [isLoading, setIsLoading] = useState(false)
    const [code, setCode] = useState('')

    const toast = useToast()

    async function handleJoinPoll() {
        try {
            setIsLoading(true)
            if(!code.trim()){
                return toast.show({
                    title: 'Informe o código',
                    bgColor: 'red.500',
                    placement: 'top'
                })
            }

            await api.post('/pools/join',{ code })

            toast.show({
                title: 'Você entrou no bolão com sucesso',
                bgColor: 'green.500',
                placement: 'top'
            })
            setIsLoading(false)
            setCode('')
            navigate('pools')
        } catch (error) {
            console.log(error)
            setIsLoading(false)
            if(error.response?.data?.message === 'Poll not found.'){
                return toast.show({
                    title: 'Bolão não encontrado',
                    bgColor: 'red.500',
                    placement: 'top'
                })
            }

            if(error.response?.data?.message === 'You already join this poll.'){
                return toast.show({
                    title: 'Você já está nesse bolão',
                    bgColor: 'red.500',
                    placement: 'top'
                })
            }


            toast.show({
                title: 'Não foi possível encontrar o bolão',
                bgColor: 'red.500',
                placement: 'top'
            })
        }
    }

    return (
        <VStack
            flex={1}
            bgColor="gray.900"
        >
            <Header title="Buscar por código" showBackButton />

            <VStack mt={8} mx={5} alignItems="center">

                <Heading
                    mb={8}
                    fontFamily="heading"
                    color="white"
                    fontSize="xl"
                    textAlign="center"
                >
                    Encontre um bolão através de seu código único
                </Heading>


                <Input
                    placeholder="Qual o código do bolão?"
                    mb={2}
                    onChangeText={setCode}
                    autoCapitalize='characters'
                    value={code}
                />

                <Button
                    title="BUSCAR BOLÃO"
                    onPress={handleJoinPoll}
                    isLoading={isLoading}
                />

            </VStack>
        </VStack>
    )
}