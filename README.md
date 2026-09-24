# Mural de Avisos

Aplicação web feita com Vite + React que digitaliza o mural de avisos da coordenação: qualquer pessoa publica um aviso com título e texto, e todos que abrem a página veem a lista atualizada. Avisos existentes podem ser editados ou excluídos. É o segundo CRUD completo da disciplina, consumindo a API REST do JSONPlaceholder (`GET`, `POST`, `PUT`, `DELETE` em `/posts`).

## Como instalar e rodar

```bash
npm install
npm run dev
```

A aplicação abre em `http://localhost:5173`.

## API usada

Base: `https://jsonplaceholder.typicode.com` · Recurso: `/posts`

> A API do JSONPlaceholder simula as operações de escrita (não persiste de fato), então a lista exibida em tela é mantida via estado local do React a partir das respostas da API.
