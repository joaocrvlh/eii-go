# 🍣 EiiGO

EiiGO é um jogo de cartas multiplayer online inspirado no jogo de tabuleiro **Sushi Go!**. Os jogadores escolhem cartas da mão e passam o restante para o próximo jogador, acumulando pontos ao longo de 3 rodadas.

---

## Índice

- [Como Jogar](#como-jogar)
- [Cartas e Pontuação](#cartas-e-pontuação)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Configuração do Supabase](#configuração-do-supabase)
- [Rodando Localmente](#rodando-localmente)
- [Rodando com Docker](#rodando-com-docker)

---

## Como Jogar

1. **Criar sala**: Um jogador acessa a página inicial, escolhe um avatar e nickname e cria uma sala.
2. **Convidar amigos**: O host compartilha o link de convite. Os demais jogadores entram pela URL ou colando o link no navegador.
3. **Lobby**: O jogo suporta até **5 jogadores**. O host inicia a partida quando todos estiverem na sala.
4. **Rodadas (3 no total)**:
   - Cada jogador recebe uma mão de cartas.
   - Todos escolhem simultaneamente **1 carta** da mão (há um timer de **10 segundos**).
   - Após todos escolherem, as mãos são passadas para o jogador à esquerda.
   - Isso se repete até acabarem as cartas da mão.
   - Ao fim de cada rodada, os pontos são calculados e as cartas da mesa são descartadas (exceto **Pudim**, que acumula).
5. **Resultado final**: Ao término das 3 rodadas, o jogador com maior pontuação vence. O Pudim é contabilizado na pontuação final.

---

## Cartas e Pontuação

| Carta                  | Emoji | Pontuação                                                                                             |
| ---------------------- | ----- | ----------------------------------------------------------------------------------------------------- |
| **Tempurá**            | 🍤    | Cada par vale **5 pts**                                                                               |
| **Sashimi**            | 🍣    | Cada trio vale **10 pts**                                                                             |
| **Bolinho (Dumpling)** | 🥟    | 1=1 / 2=3 / 3=6 / 4=10 / 5+=15 pts                                                                    |
| **Maki (1, 2 ou 3)**   | 🍙    | Quem tiver mais: **6 pts**; segundo lugar: **3 pts**                                                  |
| **Salmão Nigiri**      | 🍣    | **2 pts** (ou 6 com Wasabi)                                                                           |
| **Lula Nigiri**        | 🦑    | **3 pts** (ou 9 com Wasabi)                                                                           |
| **Ovo Nigiri**         | 🍳    | **1 pt** (ou 3 com Wasabi)                                                                            |
| **Wasabi**             | 🟢    | Triplica o valor do próximo Nigiri jogado                                                             |
| **Pudim**              | 🍮    | Acumula entre rodadas. Ao fim: mais pudins = **+6 pts**; menos pudins = **−6 pts** (com 3+ jogadores) |
| **Hashi (Chopsticks)** | 🥢    | Permite jogar 2 cartas em um turno futuro (troca-se o Hashi pela carta extra)                         |

---

## Tecnologias

| Camada             | Tecnologia                                                                   |
| ------------------ | ---------------------------------------------------------------------------- |
| Framework          | [React Router v7](https://reactrouter.com/) (SSR)                            |
| UI                 | [React 19](https://react.dev/) + [Tailwind CSS v4](https://tailwindcss.com/) |
| Linguagem          | TypeScript 5                                                                 |
| Build              | [Vite 7](https://vitejs.dev/)                                                |
| Backend / Realtime | [Supabase](https://supabase.com/) (PostgreSQL + WebSockets)                  |
| Ícones             | [Lucide React](https://lucide.dev/)                                          |
| Avatares           | [DiceBear Adventurer](https://www.dicebear.com/)                             |
| Containerização    | Docker (multi-stage build)                                                   |

---

## Estrutura do Projeto

```
eii-go/
├── Dockerfile                   # Build multi-stage para produção
├── package.json
├── react-router.config.ts
├── tsconfig.json
├── vite.config.ts
└── app/
    ├── root.tsx                 # Raiz da aplicação (layout global)
    ├── routes.ts                # Definição de rotas
    ├── app.css                  # Estilos globais
    │
    ├── routes/                  # Arquivos de rota do React Router
    │   ├── create-game.tsx      # Rota "/"
    │   ├── lobby.$roomId.tsx    # Rota "/lobby/:roomId"
    │   ├── board.$roomId.tsx    # Rota "/board/:roomId"
    │   └── results.$roomId.tsx  # Rota "/results/:roomId"
    │
    ├── create-game/
    │   └── index.tsx            # Tela de criação/entrada na sala
    │
    ├── lobby/
    │   └── index.tsx            # Sala de espera com lista de jogadores
    │
    ├── board/
    │   ├── index.tsx            # Componente principal da mesa de jogo
    │   ├── constants.ts         # Dicionário de cartas (emoji, label, cor)
    │   ├── types.ts             # Tipos TypeScript (Card, PlayerData, etc.)
    │   ├── components/
    │   │   ├── player-spot.tsx  # Slot visual de cada jogador na mesa
    │   │   └── scoreboard.tsx   # Placar com pontuações e rodada atual
    │   ├── hooks/
    │   │   └── useGame.ts       # Hook principal: estado do jogo, timer, Supabase
    │   └── utils/
    │       ├── engine.ts        # Renderização visual das mãos de cartas (DOM)
    │       └── rules.ts         # Cálculo de pontuação ao fim de cada rodada
    │
    ├── results/
    │   └── index.tsx            # Tela de resultados / ranking final
    │
    └── lib/
        ├── deck.ts              # Criação e embaralhamento do baralho
        └── supabase.ts          # Cliente Supabase (lê variáveis de ambiente)
```

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) >= 20
- npm >= 10
- Conta no [Supabase](https://supabase.com/) (plano gratuito é suficiente)

---

## Configuração do Supabase

### 1. Crie um projeto no Supabase

Acesse [supabase.com](https://supabase.com), crie uma conta e um novo projeto.

### 2. Crie as tabelas necessárias

No **SQL Editor** do Supabase, execute:

```sql
-- Salas de jogo
create table rooms (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'waiting', -- 'waiting' | 'playing' | 'finished'
  round int not null default 1,
  created_at timestamptz default now()
);

-- Jogadores
create table players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete cascade,
  nickname text not null,
  avatar_url text,
  is_host boolean not null default false,
  is_ready boolean not null default false,
  hand jsonb default '[]',
  played_cards jsonb default '[]',
  cards_left int default 0,
  has_picked boolean default false,
  score int default 0,
  puddings int default 0,
  created_at timestamptz default now()
);
```

### 3. Habilite o Realtime

No painel do Supabase, vá em **Database → Replication** e habilite as tabelas `rooms` e `players` para receber eventos em tempo real.

### 4. Copie as credenciais

No painel do Supabase, vá em **Project Settings → API** e copie:

- **Project URL**
- **anon / public key**

### 5. Crie o arquivo `.env`

Na raiz do projeto, crie um arquivo `.env` com:

```env
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua_anon_key_aqui
```

> ⚠️ Nunca suba o `.env` para o repositório. Certifique-se de que ele está no `.gitignore`.

---

## Rodando Localmente

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/eii-go.git
cd eii-go

# 2. Instale as dependências
npm install

# 3. Configure o .env (veja seção acima)

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

O app estará disponível em `http://localhost:5173`.

### Scripts disponíveis

| Comando             | Descrição                                      |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Inicia o servidor de desenvolvimento com HMR   |
| `npm run build`     | Gera o build de produção                       |
| `npm run start`     | Inicia o servidor de produção (requer build)   |
| `npm run typecheck` | Gera tipos do React Router e roda o TypeScript |

---

## Rodando com Docker

O projeto inclui um `Dockerfile` com build multi-stage otimizado para produção.

```bash
# 1. Build da imagem
docker build -t eiigo .

# 2. Rodar o container
docker run -p 3000:3000 \
  -e VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co \
  -e VITE_SUPABASE_PUBLISHABLE_KEY=sua_anon_key_aqui \
  eiigo
```

O app estará disponível em `http://localhost:3000`.

---

## Fluxo de Navegação

```
/                    → Criar sala ou entrar via link de convite
/lobby/:roomId       → Sala de espera (host inicia o jogo)
/board/:roomId       → Mesa de jogo (3 rodadas)
/results/:roomId     → Ranking final
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
