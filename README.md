# Humanly × JOVI - Biblioteca de Momentos

Projeto independente desenvolvido pela equipe Humanly para a Sprint 3 de Web Development. Inspirada no contexto da empresa JOVI, a aplicacao permite reunir, organizar, pesquisar e acompanhar fotos, videos e documentos da rotina do usuario.

## Funcionalidades

- Cadastro, edicao e exclusao de memorias;
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

As memorias e o historico ficam salvos no `localStorage` do navegador nas chaves `humanly-jovi-items-v1` e `humanly-jovi-history-v1`. Assim, as alteracoes permanecem disponiveis depois de recarregar ou fechar a pagina no mesmo dispositivo.

## Uso de Math

O projeto usa `Math.max` para gerar identificadores, `Math.min` para limitar valores e movimentacoes, `Math.round` para calcular percentuais das estatisticas e `Math.floor` em conjunto com `Math.random` para recomendar um item aleatorio.

## Uso de inteligencia artificial

Ferramentas de inteligencia artificial foram utilizadas como apoio tecnico na migração e estruturação do prototipo em componentes React, na implementação das funcionalidades solicitadas, na organização visual responsiva e na revisão do projeto. A equipe revisou, testou e validou o resultado final, sendo responsavel por compreender o codigo, as funcionalidades implementadas e as decisões apresentadas.

## Links do projeto

- Repositorio GitHub: https://github.com/EduardoCraveiro/Sprint-3-WebDevelopment
- Deploy na Vercel: https://sprint-3-web-development-three.vercel.app

## Integrantes

Equipe Humanly. Consulte o arquivo `INTEGRANTES.TXT` presente na raiz do projeto para os nomes completos e RMs.
