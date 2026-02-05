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

interface IAjustarTarefa {
  id: string,
  tipo: "ATUALIZAR" | "EXCLUIR"
}

export function App() {
  const [valorDoInput, setValorDoInput] = useState<string>("")
  const [tarefas, setTarefas] = useState<ITarefa[]>([])
  const [erro, setErro] = useState<IErro>({
    active: false,
    description: ""
  })
  const [mostrarModal, setMostrarModal] = useState<boolean>()
  const [realizarAcao, setRealizarAcao] = useState<boolean>(false)
  const [idTarefaSelecionada, setIdTarefaSelecionada] = useState<string>("")

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

  function ajustarTarefa({ id, tipo }: IAjustarTarefa): void {
    if (tipo === "ATUALIZAR") {
      const novoArrayTarefas = tarefas.map(tarefa => {
        if (tarefa.id === id) {
          return { ...tarefa, concluido: true }
        }

        return { ...tarefa }
      }
      )
      return setTarefas(novoArrayTarefas)
    }

    if (tipo === "EXCLUIR") {
      const novoArrayTarefas = tarefas.filter(tarefa => {
        if (tarefa.id !== id) {
          return { ...tarefa }
        }
      }
      )
      return setTarefas(novoArrayTarefas)
    }

  }

  function abrirModal(idTarefa: string): void {
    setIdTarefaSelecionada(idTarefa)
    setMostrarModal(!mostrarModal)
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
              <li key={tarefa.id} className={`${tarefa.concluido === true ? 'concluido' : ''}`}>{tarefa.descricao}</li>
              <LuTrash style={{ cursor: 'pointer' }} onClick={() => {
                setIdTarefaSelecionada(tarefa.id)
                setMostrarModal(!mostrarModal)
              }} />
              {/* <LuTrash style={{ cursor: 'pointer' }} onClick={() => ajustarTarefa({ id: tarefa.id, tipo: "EXCLUIR" })} /> */}
              <LuCheck style={{ cursor: 'pointer' }} onClick={() => ajustarTarefa({ id: tarefa.id, tipo: "ATUALIZAR" })} />
              {/* <LuCheck style={{ cursor: 'pointer' }} onClick={() => ajustarTarefa({ id: tarefa.id, tipo: "ATUALIZAR" })} /> */}
            </div>
          ))
        }
      </ul>

      {mostrarModal === true && (
        <div className='modal-wrapper'>
          <div className="modal">
            <h1>MEU MODAL</h1>
            <h3>Deseja seguir com a sua solicitação ?</h3>
            <div className='modal-buttons'>
              <button onClick={() => {
                setRealizarAcao(false)
                setMostrarModal(false)
                console.log(realizarAcao)
              }}>NÃO</button>
              <button onClick={() => {
                ajustarTarefa({ id: idTarefaSelecionada, tipo: "EXCLUIR" })
                setMostrarModal(!mostrarModal)
              }}>SIM</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
