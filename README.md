# NEXO - Central de Conteudo

Projeto desenvolvido pela equipe Humanly para a Sprint 3 de Web Development. O NEXO e uma central pessoal para reunir, organizar, pesquisar e acompanhar artigos, videos, podcasts e documentos.

## Funcionalidades

- Cadastro, edicao e exclusao de conteudos;
- Busca, filtros por categoria e ordenacao;
- Colecoes e reorganizacao manual de itens;
- Favoritos e controle de conteudo publico ou privado;
- Comparacao de dois itens lado a lado;
- Historico das operacoes realizadas;
- Lixeira com restauracao e exclusao definitiva;
- Exportacao dos dados em JSON;
- Estatisticas calculadas automaticamente;
- Recomendacao aleatoria de conteudo;
- Persistencia dos dados com `localStorage`;
- Layout responsivo para computador, tablet e celular.

## Tecnologias utilizadas

- React 19;
- TypeScript;
- Next.js 16;
- CSS responsivo;
- Lucide React para icones;
- Web Storage API (`localStorage`);
- API `Math` do JavaScript.

## Pre-requisitos

- Node.js 22.13 ou superior;
- npm 10 ou superior;
- Conexao com a internet para carregar as imagens de demonstracao.

## Como instalar as dependencias

1. Extraia o arquivo ZIP em uma pasta local.
2. Abra um terminal dentro da pasta do projeto.
3. Execute:

```bash
npm install
```

## Como executar o projeto

Para iniciar o ambiente de desenvolvimento:

```bash
npm run dev
```

Abra `http://localhost:3000` no navegador. Nao ha autenticacao, usuario ou senha de teste.

Para gerar e testar a versao de producao:

```bash
npm run build
npm test
```

## Armazenamento local

Os conteudos e o historico ficam salvos no `localStorage` do navegador nas chaves `nexo-items-v1` e `nexo-history-v1`. Assim, as alteracoes permanecem disponiveis depois de recarregar ou fechar a pagina no mesmo dispositivo.

## Uso de Math

O projeto usa `Math.max` para gerar identificadores, `Math.min` para limitar valores e movimentacoes, `Math.round` para calcular percentuais das estatisticas e `Math.floor` em conjunto com `Math.random` para recomendar um item aleatorio.

## Uso de inteligencia artificial

A inteligencia artificial foi utilizada como apoio na migracao e estruturacao do prototipo em componentes React, na implementacao das funcionalidades solicitadas, na organizacao visual responsiva e na revisao tecnica. Todo o codigo foi integrado e validado no contexto deste projeto, mantendo os requisitos da atividade como referencia principal.

## Links do projeto

- Repositorio GitHub: https://github.com/EduardoCraveiro/Sprint-3-WebDevelopment
- Deploy na Vercel: sera informado apos a publicacao.

## Integrantes

Equipe Humanly. Consulte o arquivo `INTEGRANTES.TXT` presente na raiz do projeto para os nomes completos e RMs.
