import { FormEvent, useState } from 'react'
import Image from 'next/image'
import appPreviewImg from '../assets/aplicacao-trilha-ignite.png'
import logoImg from '../assets/logo.svg'
import checkIcon from '../assets/icon.svg'
import usersAvatarExampleImg from '../assets/avatares.png'
import { api } from '../lib/axios'

type HomeProps = {
  poolCount: number
  guessesCount: number
  usersCount: number
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')


  async function createPool(event: FormEvent) {
    event.preventDefault()

    try {
      const response = await api.post('/pools', {
        title: poolTitle,
      })

      const {code } = response.data

      await navigator.clipboard.writeText(code)

      alert("Bolão criado com sucesso, o código foi copiado para a área de transferência")

    } catch (error) {
      console.log(error)
      alert('Falha ao criar o bolão, tente novamente')
    }


    setPoolTitle('')
  }


  return (
    <div
      className='max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center'
    >
      <main>
        <Image src={logoImg} alt="logo da aplicação" />

        <h1
          className='mt-14 text-white text-5xl font-bold leading-tight'
        >
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className='mt-10 flex items-center gap-2'>
          <Image src={usersAvatarExampleImg} alt="" />
          <strong className='text-gray-100 text-xl'>
            <span className='text-ignite-500'>+{props.usersCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form
          onSubmit={createPool}
          className='mt-10 flex gap-2'
        >
          <input
            className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100'
            type="text"
            required
            placeholder='Qual nome do seu bolão?'
            onChange={event => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button
            className='bg-yellow-500 hover:bg-yellow-700 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase transition-colors'
            type='submit'
          >
            CRIAR MEU BOLÃO
          </button>
        </form>

        <p
          className='mt-4 text-sm text-gray-300 leading-relaxed max-w-sm'
        >
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>

        <div
          className='mt-10 pt-10 border-t-2 border-gray-600 flex items-center justify-between text-gray-100'
        >
          <div className='flex items-center gap-6'>
            <Image src={checkIcon} alt="" />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-0.5 rounded h-14 bg-gray-600" />

          <div className='flex items-center gap-6'>
            <Image src={checkIcon} alt="" />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.guessesCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreviewImg}
        alt="Dois celulares exibindo uma prévia do app"
        quality={100}
      />
    </div>
  )
}

export const getStaticProps = async () => {
  const [poolCountResponse, guessesCountResponse, usersCountResponse] = await Promise.all([
    api.get('pools/count'),
    api.get('guesses/count'),
    api.get('users/count')
  ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessesCount: guessesCountResponse.data.count,
      usersCount: usersCountResponse.data.count,
    },
    revalidate: 600, 
  }
}