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

## Desenvolvimento

```bash
npm run dev
```

Acesse http://localhost:5173

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

## Configuração

O proxy para a API está configurado no `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true
    }
  }
}
```

## Integração com Backend

Certifique-se de que o backend está rodando em http://localhost:5000 antes de iniciar o frontend.

```bash
cd ../hiper-oder-service
docker-compose up -d
```
