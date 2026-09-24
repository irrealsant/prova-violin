import { useState, useEffect } from 'react'

/**
 * Formulário reaproveitado para publicar (modo criação) e para editar
 * (modo edição) um aviso. O modo é definido pela presença de `avisoEmEdicao`.
 */
export default function FormularioAviso({
  avisoEmEdicao,
  aoPublicar,
  aoSalvarEdicao,
  aoCancelarEdicao,
  enviando,
}) {
  const [titulo, setTitulo] = useState('')
  const [texto, setTexto] = useState('')
  const [erroValidacao, setErroValidacao] = useState('')

  const emModoEdicao = Boolean(avisoEmEdicao)

  // Preenche o formulário quando um aviso entra em edição.
  useEffect(() => {
    if (avisoEmEdicao) {
      setTitulo(avisoEmEdicao.title)
      setTexto(avisoEmEdicao.body)
      setErroValidacao('')
    }
  }, [avisoEmEdicao])

  function limparFormulario() {
    setTitulo('')
    setTexto('')
    setErroValidacao('')
  }

  function aoEnviar(evento) {
    evento.preventDefault()

    if (!titulo.trim() || !texto.trim()) {
      setErroValidacao('preencha o título e o texto antes de publicar')
      return
    }
    setErroValidacao('')

    if (emModoEdicao) {
      aoSalvarEdicao({ ...avisoEmEdicao, title: titulo.trim(), body: texto.trim() })
    } else {
      aoPublicar({ title: titulo.trim(), body: texto.trim() })
      limparFormulario()
    }
  }

  function aoClicarCancelar() {
    limparFormulario()
    aoCancelarEdicao()
  }

  return (
    <section className="painel-formulario" aria-label="Novo aviso">
      <h2>{emModoEdicao ? 'Editar aviso' : 'Novo aviso'}</h2>

      <form onSubmit={aoEnviar} noValidate>
        <label htmlFor="campo-titulo">Título</label>
        <input
          id="campo-titulo"
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ex.: Prova de PTAC4 na semana 8"
          disabled={enviando}
        />

        <label htmlFor="campo-texto">Texto do aviso</label>
        <textarea
          id="campo-texto"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escreva os detalhes do aviso..."
          rows={5}
          disabled={enviando}
        />

        {erroValidacao && (
          <p className="mensagem-validacao" role="alert">
            {erroValidacao}
          </p>
        )}

        <div className="acoes-formulario">
          <button type="submit" className="botao-primario" disabled={enviando}>
            {emModoEdicao ? 'Salvar' : 'Publicar aviso'}
          </button>
          {emModoEdicao && (
            <button
              type="button"
              className="botao-secundario"
              onClick={aoClicarCancelar}
              disabled={enviando}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </section>
  )
}
