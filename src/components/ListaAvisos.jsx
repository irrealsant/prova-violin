import CartaoAviso from './CartaoAviso.jsx'

export default function ListaAvisos({
  avisos,
  carregando,
  erro,
  aoEditar,
  aoExcluir,
  idExcluindo,
}) {
  return (
    <section className="painel-lista" aria-label="Avisos publicados">
      <h2>Avisos publicados ({avisos.length})</h2>

      {avisos.length === 0 && !carregando && !erro && (
        <p className="mensagem-vazia">
          Nenhum aviso publicado — seja a primeira pessoa a escrever no mural.
        </p>
      )}

      <div className="lista-cartoes">
        {avisos.map((aviso) => (
          <CartaoAviso
            key={aviso.id}
            aviso={aviso}
            aoEditar={aoEditar}
            aoExcluir={aoExcluir}
            excluindo={idExcluindo === aviso.id}
          />
        ))}
      </div>

      {carregando && (
        <p className="mensagem-carregando">
          <span className="spinner" aria-hidden="true" />
          Carregando avisos...
        </p>
      )}

      {erro && (
        <p className="mensagem-erro" role="alert">
          {erro}
        </p>
      )}
    </section>
  )
}
