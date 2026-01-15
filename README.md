# Hiper Web - Frontend

Interface web para o Hiper Order System desenvolvida com Vue.js 3, TypeScript e Tailwind CSS.

## Stack Tecnológica

- Vue.js 3 (Composition API)
- TypeScript 5
- Vite 7
- Vue Router 4
- Axios
- Tailwind CSS 3

## Arquitetura

O projeto segue arquitetura baseada em features:

```
src/
├── features/
│   └── orders/
│       ├── components/       # Componentes específicos de pedidos
│       ├── views/            # Views (OrderList, OrderCreate, OrderDetails)
│       ├── composables/      # Lógica reativa (useOrders)
│       ├── services/         # Chamadas à API (orderService)
│       └── types.ts          # Tipos TypeScript
├── shared/
│   └── components/           # Componentes compartilhados (StatusBadge)
├── router/                   # Configuração de rotas
└── App.vue                   # Componente raiz
```

## Instalação

```bash
npm install
```

## Executando com Docker (Recomendado)

```bash
docker-compose up --build -d
```

Acesse http://localhost:3000

O docker-compose sobe:
- Frontend (Nginx) na porta 3000
- Backend (API) internamente
- PostgreSQL na porta 5432
- RabbitMQ na porta 5672 e Management na porta 15672

## Desenvolvimento Local

```bash
npm install
npm run dev
```

Acesse http://localhost:5173

O proxy do Vite redireciona requisições /api para http://localhost:5000

## Build

```bash
npm run build
```

## Funcionalidades

- Listagem de pedidos com tabela responsiva
- Criação de pedidos com validação de formulário
- Visualização detalhada de pedidos
- Atualização de status (Confirmado, Processando, Concluído, Cancelado)
- Cancelamento de pedidos com confirmação
- Loading states e tratamento de erros
- Formatação de valores em reais
- Formatação de datas em português

## Arquitetura de Deploy

O frontend é servido via Nginx que também atua como proxy reverso para a API:

```
Cliente → Nginx:3000 → /api → Backend:8080
                     → /    → Frontend (static files)
```

No desenvolvimento local, o Vite Dev Server faz o proxy:

```
Cliente → Vite:5173 → /api → Backend:5000
                    → /    → Frontend (HMR)
```
