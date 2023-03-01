import { Heading, Text, useToast, VStack } from "native-base";
import { Header } from "../components/Header";

import Logo from '../assets/logo.svg'
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useState } from "react";
import { api } from "../services/api";

export function New() {
    const [isLoading, setIsLoading] = useState(false)
    const [title, setTitle] = useState('')
    const toast = useToast()

    async function handlePollCreate() {
        if (!title.trim()) {
            return toast.show({
                title: 'Informe um nome para o seu bolão',
                placement: 'top',
                bgColor: 'red.500'
            })
        }

        try {
            setIsLoading(true)
            await api.post('/pools',{
                title: title
            })
            toast.show({
                title: 'Bolão criado com sucesso!',
                placement: 'top',
                bgColor: 'green.500'
            })
            setTitle('')
        } catch (error) {
            console.log(error)
            toast.show({
                title: 'Não foi possível criar o bolão',
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <VStack
            flex={1}
            bgColor="gray.900"
        >
            <Header title="Criar novo bolão" />

            <VStack mt={8} mx={5} alignItems="center">
                <Logo />

                <Heading
                    my={8}
                    fontFamily="heading"
                    color="white"
                    fontSize="xl"
                    textAlign="center"
                >
                    Crie seu próprio bolão da copa e compartilhe entre amigos!
                </Heading>

                <Input
                    placeholder="Qual nome do seu bolão?"
                    mb={2}
                    onChangeText={setTitle}
                    value={title} />

                <Button
                    title="CRIAR MEU BOLÃO"
                    onPress={handlePollCreate}
                    isLoading={isLoading}
                />

                <Text
                    color="gray.200"
                    fontSize="sm"
                    textAlign="center"
                    px={10}
                    mt={4}
                >
                    Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas.
                </Text>
            </VStack>
        </VStack>
    )
}