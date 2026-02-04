import { useState } from 'react'
import './App.css'
import { LuCheck, LuTrash } from 'react-icons/lu'

interface IErro {
  active: boolean
  description: string
}

interface ITarefa {
  id: string
  descricao: string
  criadoEm: string
  ativo: boolean
  concluido: boolean
}

export function App() {
  const [valorDoInput, setValorDoInput] = useState<string>("")
  const [tarefas, setTarefas] = useState<ITarefa[]>([])
  const [erro, setErro] = useState<IErro>({
    active: false,
    description: ""
  })

  function adicionarTarefa(): void {
    if (valorDoInput.trim() === "") {
      setErro({
        active: true,
        description: "Campo obrigatório."
      })
      return
    }

    if (valorDoInput.trim().length > 15) {
      setErro({
        active: true,
        description: "Máximo 15 caracteres."
      })
      return
    }

    const tarefasFiltradas = tarefas.filter(
      tarefa => tarefa.descricao.trim().toLowerCase() === valorDoInput.trim().toLowerCase()
    )

    if (tarefasFiltradas.length > 0) {
      setErro({
        active: true,
        description: "Tarefa já cadastrada."
      })
      return
    }

    const montarObjetoTarefa: ITarefa = {
      id: Math.random().toString(36).substring(2, 9),
      descricao: valorDoInput,
      criadoEm: new Date().toISOString(),
      concluido: false,
      ativo: true
    }

    setTarefas(oldState => [...oldState, montarObjetoTarefa])
    setValorDoInput("")
  }

  return (
    <>
      <div className="card">
        <div className='input-wrapper'>
          <input type="text" id='input-tarefa' value={valorDoInput} onChange={(e) => setValorDoInput(e.target.value)} />
          <p className='erro'>{erro.active && erro.description}</p>
        </div>
        <button onClick={adicionarTarefa}>Adicionar Tarefa</button>
      </div>
      <ul>
        {
          tarefas.map((tarefa) => (
            <div className='item-list'>
              <li key={tarefa.id}>{tarefa.descricao}</li>
              <LuTrash />
              <LuCheck />
            </div>
          ))
        }
      </ul>
    </>
  )
}
