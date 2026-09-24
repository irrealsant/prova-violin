import { useState, useEffect } from 'react'
import FormularioAviso from './components/FormularioAviso.jsx'
import ListaAvisos from './components/ListaAvisos.jsx'

const URL_BASE = 'https://jsonplaceholder.typicode.com'
const USUARIO_ATUAL = 1

export default function App() {
  const [avisos, setAvisos] = useState([])
  const [carregandoInicial, setCarregandoInicial] = useState(true)
  const [erroCarregamento, setErroCarregamento] = useState(null)

  const [avisoEmEdicao, setAvisoEmEdicao] = useState(null)
  const [enviandoFormulario, setEnviandoFormulario] = useState(false)
  const [idExcluindo, setIdExcluindo] = useState(null)

  // RF01 — carga inicial dos avisos, com cancelamento via AbortController.
  useEffect(() => {
    const controller = new AbortController()

    async function carregarAvisos() {
      setCarregandoInicial(true)
      setErroCarregamento(null)
      try {
        const resposta = await fetch(`${URL_BASE}/posts?_limit=15`, {
          signal: controller.signal,
        })
        if (!resposta.ok) {
          throw new Error(`A API respondeu com status ${resposta.status}`)
        }
        const dados = await resposta.json()
        setAvisos(dados)
      } catch (erro) {
        if (erro.name === 'AbortError') return
        setErroCarregamento('Não foi possível conectar à API (Network Error). Tente novamente.')
      } finally {
        setCarregandoInicial(false)
      }
    }

    carregarAvisos()
    return () => controller.abort()
  }, [])

  // RF02 — publicar novo aviso.
  async function publicarAviso({ title, body }) {
    setEnviandoFormulario(true)
    setErroCarregamento(null)
    try {
      const resposta = await fetch(`${URL_BASE}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: USUARIO_ATUAL, title, body }),
      })
      if (!resposta.ok) {
        throw new Error(`A API respondeu com status ${resposta.status}`)
      }
      const criado = await resposta.json()

      // A API "finge" que salva e costuma devolver sempre o mesmo id (101).
      // Se já existir um aviso com esse id na lista local, geramos um id
      // único para não quebrar as `key` do React.
      const idJaExiste = avisos.some((aviso) => aviso.id === criado.id)
      const novoAviso = {
        userId: criado.userId ?? USUARIO_ATUAL,
        id: idJaExiste ? Date.now() : criado.id,
        title: criado.title ?? title,
        body: criado.body ?? body,
      }

      setAvisos((atual) => [novoAviso, ...atual])
    } catch (erro) {
      setErroCarregamento('Não foi possível publicar o aviso (Network Error). Tente novamente.')
    } finally {
      setEnviandoFormulario(false)
    }
  }

  // RF03 — editar aviso existente.
  async function salvarEdicao(avisoAtualizado) {
    setEnviandoFormulario(true)
    setErroCarregamento(null)
    try {
      const resposta = await fetch(`${URL_BASE}/posts/${avisoAtualizado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(avisoAtualizado),
      })
      if (!resposta.ok) {
        throw new Error(`A API respondeu com status ${resposta.status}`)
      }

      setAvisos((atual) =>
        atual.map((aviso) => (aviso.id === avisoAtualizado.id ? avisoAtualizado : aviso))
      )
      setAvisoEmEdicao(null)
    } catch (erro) {
      setErroCarregamento('Não foi possível salvar as alterações (Network Error). Tente novamente.')
    } finally {
      setEnviandoFormulario(false)
    }
  }

  // RF04 — excluir aviso, com rollback em caso de falha.
  async function excluirAviso(aviso) {
    setIdExcluindo(aviso.id)
    setErroCarregamento(null)

    // Remoção otimista.
    setAvisos((atual) => atual.filter((item) => item.id !== aviso.id))

    try {
      const resposta = await fetch(`${URL_BASE}/posts/${aviso.id}`, {
        method: 'DELETE',
      })
      if (!resposta.ok) {
        throw new Error(`A API respondeu com status ${resposta.status}`)
      }
    } catch (erro) {
      // Rollback: o aviso volta para a lista na posição original.
      setAvisos((atual) => {
        const posicao = atual.findIndex((item) => item.id > aviso.id)
        if (posicao === -1) return [...atual, aviso]
        const copia = [...atual]
        copia.splice(posicao, 0, aviso)
        return copia
      })
      setErroCarregamento('Não foi possível excluir o aviso (Network Error). Tente novamente.')
    } finally {
      setIdExcluindo(null)
    }
  }

  function iniciarEdicao(aviso) {
    setAvisoEmEdicao(aviso)
  }

  function cancelarEdicao() {
    setAvisoEmEdicao(null)
  }

  return (
    <div className="pagina">
      <header className="cabecalho">
        <h1>Mural de Avisos</h1>
        <p>Projeto P2 — PTAC4 · avisos e recados da turma</p>
      </header>

      <main className="conteudo">
        <FormularioAviso
          avisoEmEdicao={avisoEmEdicao}
          aoPublicar={publicarAviso}
          aoSalvarEdicao={salvarEdicao}
          aoCancelarEdicao={cancelarEdicao}
          enviando={enviandoFormulario}
        />

        <ListaAvisos
          avisos={avisos}
          carregando={carregandoInicial}
          erro={erroCarregamento}
          aoEditar={iniciarEdicao}
          aoExcluir={excluirAviso}
          idExcluindo={idExcluindo}
        />
      </main>

      <footer className="rodape">
        Vite + React · fetch GET/POST/PUT/DELETE · jsonplaceholder.typicode.com/posts
      </footer>
    </div>
  )
}
