# 🍣 EiiGO

EiiGO é um jogo de cartas multiplayer online inspirado no jogo de tabuleiro **Sushi Go!**. Os jogadores escolhem cartas da mão e passam o restante para o próximo jogador, acumulando pontos ao longo de 3 rodadas.

O projeto é um front-end React (SSR) que fala diretamente com o Supabase (Postgres + Realtime) pelo navegador — não há um servidor de jogo próprio: toda a lógica de turnos, embaralhamento e pontuação roda no cliente e é sincronizada via `postgres_changes`/`broadcast` do Supabase Realtime.

---

## Índice

- [Como Jogar](#como-jogar)
- [Funcionalidades](#funcionalidades)
- [Cartas e Pontuação](#cartas-e-pontuação)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Configuração do Supabase](#configuração-do-supabase)
- [Rodando Localmente](#rodando-localmente)
- [Rodando com Docker](#rodando-com-docker)
- [CI: Keepalive do Supabase](#ci-keepalive-do-supabase)
- [Fluxo de Navegação](#fluxo-de-navegação)

---

## Como Jogar

1. **Criar sala**: Um jogador acessa a página inicial, escolhe um avatar e nickname e cria uma sala.
2. **Convidar amigos**: O host compartilha o link de convite. Os demais jogadores entram pela URL ou colando o link no navegador. A sala comporta no máximo **5 jogadores**; a partir do 6º convidado, a tela de "sala cheia" é exibida no lugar do lobby.
3. **Lobby**: cada jogador marca "pronto" e o host inicia a partida quando todos estiverem prontos (mínimo 2 jogadores).
4. **Rodadas (3 no total)**:
   - Cada jogador recebe uma mão de cartas.
   - Todos escolhem simultaneamente **1 carta** da mão (ou **2**, se tiverem um Hashi na mesa) — há um timer de **10 segundos**, sincronizado entre todos os clientes.
   - Após todos escolherem, as mãos são passadas para o jogador à esquerda.
   - Isso se repete até acabarem as cartas da mão.
   - Ao fim de cada rodada, os pontos são calculados e as cartas da mesa são descartadas (exceto **Pudim**, que acumula).
5. **Resultado final**: ao término das 3 rodadas, o jogador com maior pontuação vence. O Pudim é contabilizado na pontuação final.
6. **Saindo da partida**: é possível sair a qualquer momento pelo botão "SAIR" (lobby) ou pelo ícone no canto superior direito da mesa (partida em andamento). Fechar a aba/navegador também encerra a sessão do jogador para os demais.

---

## Funcionalidades

- **Sincronização em tempo real** de lobby e mesa via Supabase Realtime (`postgres_changes` e `broadcast`).
- **Limite de sala** de 5 jogadores, checado no cliente e reforçado por um trigger no banco (veja [Configuração do Supabase](#configuração-do-supabase)).
- **Detecção de desconexão**: se um jogador fecha o navegador ou clica em sair (no lobby ou durante a partida), sua sessão é removida e os demais jogadores veem o aviso na tela; se o host sair, o jogador mais antigo assume automaticamente.
- **Timer de turno resiliente a refresh**: a contagem de 10s é ancorada em um timestamp compartilhado, então recarregar a página não reinicia o timer nem trava os outros jogadores esperando.
- **Reconciliação periódica** do status "escolheu a carta" com o banco, evitando que a partida fique travada em "Aguardando" caso um evento de realtime se perca.
- **Animação de passagem de baralho** e efeitos sonoros (embaralhar, contagem regressiva, seleção de carta) a cada troca de turno.
- **Tela "Como Jogar"** acessível na página inicial, com o resumo completo das regras (objetivo, preparação, fluxo da rodada, Hashi e pontuação de cada carta).
- **Info da carta (botão direito)**: clicar com o botão direito em uma carta da sua mão abre um modal central mostrando o que ela faz.
- **Agrupamento de combos**: ao selecionar 2 cartas com um Hashi que pontuam juntas (mesmo tipo, ou Wasabi + Nigiri), elas se aproximam na mão.
- **Música de fundo** (`tradicional-japanese.mp3`) tocando em loop durante a partida.

---

## Cartas e Pontuação

| Carta                  | Emoji | Pontuação                                                                                             |
| ----------------------- | ----- | ------------------------------------------------------------------------------------------------------ |
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

| Camada             | Tecnologia                                                                                                            |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Framework          | [React Router v7](https://reactrouter.com/) (SSR)                                                                     |
| UI                 | [React 19](https://react.dev/) — estilização própria em CSS puro (`app.css`); Tailwind v4 vem configurado mas é usado só em telas de erro |
| Linguagem          | TypeScript 5                                                                                                           |
| Build              | [Vite 7](https://vitejs.dev/)                                                                                         |
| Backend / Realtime | [Supabase](https://supabase.com/) (PostgreSQL + WebSockets) — sem servidor de jogo próprio, o cliente lê/escreve direto nas tabelas |
| Ícones             | [Lucide React](https://lucide.dev/)                                                                                   |
| Avatares           | [DiceBear Adventurer](https://www.dicebear.com/)                                                                      |
| Áudio              | Efeitos sonoros locais (`public/sounds/*.wav`)                                                                        |
| CI                 | GitHub Actions (keepalive do projeto Supabase)                                                                       |
| Containerização    | Docker (multi-stage build)                                                                                            |

---

## Estrutura do Projeto

```
eii-go/
├── Dockerfile                      # Build multi-stage para produção
├── .dockerignore
├── .env                            # Credenciais do Supabase (não versionado)
├── package.json
├── react-router.config.ts
├── tsconfig.json
├── vite.config.ts
│
├── .github/
│   └── workflows/
│       └── supabase-keepalive.yml  # Ping periódico para o projeto Supabase não pausar
│
├── public/
│   ├── favicon.ico
│   └── sounds/                     # countdown.wav, deck-shuffle.wav, select-card.wav
│
└── app/
    ├── root.tsx                    # Raiz da aplicação (layout global)
    ├── routes.ts                   # Definição de rotas
    ├── app.css                     # Estilos globais (design system em CSS puro)
    │
    ├── routes/                     # Arquivos de rota do React Router
    │   ├── create-game.tsx         # Rota "/"
    │   ├── lobby.$roomId.tsx       # Rota "/lobby/:roomId"
    │   ├── board.$roomId.tsx       # Rota "/board/:roomId"
    │   └── results.$roomId.tsx     # Rota "/resultados/:roomId"
    │
    ├── create-game/
    │   └── index.tsx               # Tela de criação/entrada na sala
    │
    ├── lobby/
    │   └── index.tsx               # Sala de espera: lista de jogadores, limite de vagas, pronto/host
    │
    ├── board/
    │   ├── index.tsx               # Componente principal da mesa de jogo
    │   ├── constants.ts            # Dicionário de cartas (emoji, label, cor)
    │   ├── types.ts                # Tipos TypeScript (Card, PlayerData, OccupiedSeat)
    │   ├── components/
    │   │   ├── player-spot.tsx     # Slot visual de cada jogador na mesa
    │   │   ├── scoreboard.tsx      # Placar com pontuações e rodada atual
    │   │   └── deck-pass-overlay.tsx # Animação de baralho passando entre turnos
    │   ├── hooks/
    │   │   └── useGame.ts          # Hook principal: estado do jogo, timer, presença, Supabase
    │   └── utils/
    │       ├── engine.ts           # Renderização visual das mãos de cartas (DOM)
    │       ├── rules.ts            # Cálculo de pontuação ao fim de cada rodada
    │       └── sound.ts            # Player de efeitos sonoros
    │
    ├── results/
    │   └── index.tsx               # Tela de resultados / ranking final
    │
    └── lib/
        ├── deck.ts                 # Criação e embaralhamento do baralho
        └── supabase.ts             # Cliente Supabase (lê variáveis de ambiente)
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
  deck jsonb default '[]',            -- cartas restantes do baralho da partida
  current_turn text,                  -- reservado para uso futuro
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
  chosen_card jsonb default '[]',     -- carta(s) escolhida(s) no turno atual
  cards_left int default 0,
  has_picked boolean default false,
  score int default 0,
  puddings int default 0,
  created_at timestamptz default now()
);
```

### 3. Limite de jogadores por sala (recomendado)

A checagem de vagas é feita no cliente antes de entrar na sala, mas isso por
si só é vulnerável a corrida (dois jogadores entrando no mesmo instante). Para
garantir o limite de 5 jogadores mesmo nesse cenário, crie um trigger no
banco que rejeita o INSERT quando a sala já estiver cheia:

```sql
create or replace function enforce_max_players()
returns trigger as $$
begin
  if (select count(*) from players where room_id = new.room_id) >= 5 then
    raise exception 'room_full';
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_enforce_max_players
before insert on players
for each row execute function enforce_max_players();
```

O front-end já trata o erro `room_full` retornado por esse trigger e exibe a
tela de "sala cheia" para o jogador.

### 4. Habilite o Realtime

No painel do Supabase, vá em **Database → Replication** e habilite as tabelas `rooms` e `players` para receber eventos em tempo real (INSERT, UPDATE e DELETE).

### 5. Copie as credenciais

No painel do Supabase, vá em **Project Settings → API** e copie:

- **Project URL**
- **anon / public key**

### 6. Crie o arquivo `.env`

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
| -------------------- | ------------------------------------------------ |
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

> As variáveis `VITE_*` são lidas em tempo de build pelo Vite. Se você mudar
> as credenciais, é necessário rebuildar a imagem (`docker build`) para que
> o novo valor seja embutido no bundle.

---

## CI: Keepalive do Supabase

Projetos gratuitos do Supabase são pausados após um período de inatividade.
O workflow `.github/workflows/supabase-keepalive.yml` roda a cada 3 dias
(`0 12 */3 * *`) e faz uma requisição simples à API REST (`GET /rest/v1/rooms`)
para manter o projeto ativo. Ele também pode ser disparado manualmente pela
aba **Actions** do GitHub.

Para funcionar, configure os seguintes **repository secrets** (Settings →
Secrets and variables → Actions):

| Secret               | Valor                                    |
| --------------------- | ------------------------------------------ |
| `SUPABASE_URL`       | Mesma URL do projeto usada em `.env`      |
| `SUPABASE_ANON_KEY`  | Mesma anon/public key usada em `.env`     |

---

## Fluxo de Navegação

```
/                    → Criar sala ou entrar via link de convite
/lobby/:roomId       → Sala de espera (host inicia o jogo)
/board/:roomId       → Mesa de jogo (3 rodadas)
/resultados/:roomId  → Ranking final
```

O app containerizado pode ser publicado em qualquer plataforma com suporte a Docker, incluindo:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### Deploy manual (sem Docker)

Se preferir rodar fora de container, o servidor embutido do React Router
(`@react-router/serve`) já é pronto para produção. Basta implantar a saída de
`npm run build`:

```
├── package.json
├── package-lock.json
├── build/
│   ├── client/    # Assets estáticos
│   └── server/    # Código do servidor (SSR)
```

E iniciar com `npm run start`, garantindo que as variáveis `VITE_SUPABASE_URL`
e `VITE_SUPABASE_PUBLISHABLE_KEY` estejam definidas no momento do **build**
(não apenas em runtime).

---

## Styling

Não há um design system de terceiros: quase toda a interface é estilizada em
CSS puro em [`app/app.css`](app/app.css), com variáveis CSS para cores/raio/sombra
e classes próprias (`.btn-start`, `.player-spot`, `.board-card`, etc.). O
Tailwind CSS v4 vem configurado no Vite (`@tailwindcss/vite`) mas hoje só é
usado nas classes utilitárias da tela de erro padrão do React Router
(`app/root.tsx`).

---

Built with ❤️ using React Router.
