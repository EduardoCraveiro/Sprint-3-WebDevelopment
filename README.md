# Humanly × JOVI — Biblioteca de Momentos

Projeto da equipe Humanly para a entrega conjunta da **Sprint 4 de Front-End Design e Web Development**, evoluindo a biblioteca da Sprint 3 e mantendo a solução do Challenge JOVI.

## Tecnologias

React 19, Next.js 16 (App Router), TypeScript, Tailwind CSS 4, PostCSS e Lucide React. Componentes com props, hooks nativos e hooks customizados (`useJoviLibrary` e `useMemoryData`) separam a lógica da interface. A aplicação utiliza Fetch API, cookie de sessão e `localStorage`.

## Instalação e execução

Requisitos: **Node.js 22.13 ou superior**, npm 10 ou superior e navegador atualizado.

Na pasta que contém `package.json`, execute:

```bash
npm ci
npm run dev
```

Abra **http://localhost:3000**. O comando de desenvolvimento cria automaticamente `.env.local` com uma chave de sessão aleatória, se o arquivo não existir. Esse arquivo não deve ser enviado ao GitHub ou incluído no ZIP. `.env.example` documenta a variável necessária.

**O back-end e a interface funcionam no mesmo servidor Next.js.** Não é necessário iniciar outro serviço, instalar um banco de dados ou criar conta em uma API externa. As imagens de demonstração acompanham o código.

Para executar a versão de produção local:

```bash
npm run setup
npm run build
npm start
```

## Acesso para teste

- E-mail: `professor@humanly.com`
- Senha: `Humanly@2026`

Conta compartilhada de demonstração acadêmica: use dados fictícios. A sessão dura oito horas; o botão **Sair da conta** remove o cookie. A autorização é validada no servidor, nas páginas privadas e na API. O cookie usa `HttpOnly`, `SameSite=Lax` e `Secure` em produção.

## Funcionalidades e rotas

- `/`: apresentação pública da solução.
- `/login`: autenticação de demonstração.
- `/biblioteca`: visão geral, estatísticas e recomendações.
- `/biblioteca/itens`: cadastro, edição, pesquisa, filtros, ordenação, comparação e exportação JSON.
- `/biblioteca/colecoes`: organização por coleção.
- `/biblioteca/favoritos`: memórias favoritas.
- `/biblioteca/historico`: operações realizadas.
- `/biblioteca/lixeira`: restauração e exclusão definitiva.

As rotas de biblioteca exigem login. O layout atende desktop, tablet e celular; no celular, o cadastro fica disponível acima do título do painel.

## API e persistência

O hook `useMemoryData` consome a API própria simulada com `fetch`, valida a resposta e trata carregamento e falhas.

| Método | Endpoint | Função |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Recebe JSON com `email` e `password` e cria a sessão |
| `POST` | `/api/auth/logout` | Encerra a sessão |
| `GET` | `/api/memorias` | Exige sessão e retorna `{ items, history, source }` |

A API fornece os dados fictícios iniciais de `app/data.ts`. As alterações nas memórias ficam no navegador, nas chaves `humanly-jovi-items-v1` e `humanly-jovi-history-v1`, preservando os dados locais da Sprint 3. Não há sincronização entre dispositivos nem gravação remota. Sair da conta preserva esses dados locais.

A classificação Público/Privado organiza os registros; não os publica na internet. Vídeo e Documento são tipos de registro com capa e descrição, sem upload ou reprodução de arquivos. As capas aceitam URLs HTTP(S) e as imagens locais indicadas no formulário.

## Verificação

```bash
npm run lint
npm test
```

Os testes geram o build e verificam páginas públicas, arquivos estáticos, bloqueio de rotas e API, login, logout, entradas inválidas e sessões adulteradas ou expiradas. Para testar a interface, entre, cadastre uma memória com a capa padrão, recarregue, filtre por coleção, compare dois itens e teste a lixeira.

## Deploy manual na Vercel

1. Envie o código e `package-lock.json` ao mesmo repositório GitHub. `.gitignore` já exclui dependências, build, `.env.local` e `outputs`.
2. Na Vercel, use o preset **Next.js**, a pasta de `package.json` como raiz, instalação `npm ci` e build `npm run build`. O projeto precisa do servidor Next.js; não use exportação estática.
3. Crie **`SESSION_SECRET`** nas variáveis de Production e Preview com uma chave aleatória de pelo menos 32 caracteres. Gere uma chave localmente com:

   ```bash
   node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
   ```

4. Não use o prefixo `NEXT_PUBLIC_` nessa variável. Faça o deploy após configurá-la e teste o login pelo endereço HTTPS. Sem uma chave válida, o login de produção retorna `503`.
5. Se o domínio mudar, atualize o link abaixo antes de gerar o ZIP.

## Links

- Repositório: https://github.com/EduardoCraveiro/Sprint-3-WebDevelopment
- Vercel: https://sprint-3-web-development-three.vercel.app

O link da Vercel é o endereço informado na Sprint 3. A publicação das alterações da Sprint 4 será feita manualmente pelo responsável.

## Uso de inteligência artificial

O Codex auxiliou na análise dos requisitos, implementação da apresentação, autenticação de demonstração, Tailwind CSS, API simulada e hooks customizados, além da correção de fluxos, documentação e verificações automatizadas. A equipe é responsável por revisar, compreender, validar e apresentar o código e as decisões da solução.

## Integrantes e entrega

Os nomes completos e RMs estão em **`INTEGRANTES.TXT`**, preservado na raiz. Um integrante deve entregar o ZIP e os links de repositório e deploy para as duas disciplinas.

Para gerar o ZIP no Windows:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/package.ps1
```

O arquivo **`outputs/Humanly-JOVI-Sprint4.zip`** contém fontes, imagens, testes, scripts, configurações, lockfile, README e integrantes. Dependências instaladas, build e credenciais locais são excluídos. Após extrair em outra pasta, execute `npm ci` e `npm run dev`.
