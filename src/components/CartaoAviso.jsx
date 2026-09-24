export default function CartaoAviso({ aviso, aoEditar, aoExcluir, excluindo }) {
  return (
    <article className="cartao-aviso">
      <h3>{aviso.title}</h3>
      <p className="texto-aviso">{aviso.body}</p>
      <p className="meta-aviso">
        post id {aviso.id} · publicado pelo usuário {aviso.userId}
      </p>
      <div className="acoes-cartao">
        <button
          type="button"
          className="botao-secundario"
          onClick={() => aoEditar(aviso)}
          disabled={excluindo}
        >
          Editar
        </button>
        <button
          type="button"
          className="botao-perigo"
          onClick={() => aoExcluir(aviso)}
          disabled={excluindo}
        >
          {excluindo ? 'Excluindo...' : 'Excluir'}
        </button>
      </div>
    </article>
  )
}
