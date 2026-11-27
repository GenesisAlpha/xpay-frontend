# XPay Commerce

Frontend navegável do comerciante, checkout do comprador e backoffice operacional. A primeira versão corre em demonstração local com duas lojas, quatro moedas e dados fictícios. Os pedidos, links e notas que criar são guardados no navegador desta origem.

## Executar

Requer Node.js 22 ou superior. O frontend usa HTML, CSS e JavaScript nativos.

~~~sh
npm start
npm run check
~~~

Abrir [http://127.0.0.1:4173](http://127.0.0.1:4173). O directório public contém os ficheiros para alojamento estático. As páginas usam rotas por fragmento e os URLs de teste pertencem à origem e ao navegador que guardou os dados. Use dados fictícios. As operações da interface simulam pagamento, reembolso, entrega, saque e activação.

## Jornadas disponíveis

O [guia do checkout](docs/checkout.md) inclui a demonstração AtlasClub e o contrato para ligar sessões, pagamentos e retorno à loja.

| Área | O que pode experimentar | Ligação real |
|---|---|---|
| Visão geral | Escolher loja, moeda e período. Consultar volume, saldo e últimos pedidos. | Dashboard e carteira do Core com identidade e moeda verificadas. |
| Comércio | Criar produto, publicar oferta com preço e moeda, criar, pausar e reactivar um link. | API de catálogo, oferta comercial e ciclo do link a implementar ou confirmar. |
| Checkout | Reutilizar o mesmo link, simular confirmação, pendência e recusa. Visualizar exemplo do botão. | Link no servidor → sessão do Core → checkout alojado, embed ou API do comerciante. |
| Pedidos e clientes | Consultar estado, simular confirmação, entrega e reembolso. Consultar compras e gravar notas. | Domínio de pedidos, identidade do cliente, confirmação assíncrona e conector CRM. |
| Campanhas e afiliados | Criar campanha, copiar link atribuído, verificar conversões e registar parceiro. | Eventos atribuídos, comissões e sincronização com canais de marketing. |
| Assinaturas | Ver primeiras compras de ofertas mensais. | Ciclo de cobrança, cancelamento, renovação e estado persistido por provedor. |
| Financeiro | Consultar pagamentos, carteira, disputas e saques por moeda e loja e exportar tabelas. | Carteira e ledger do Core, regras de reservas, FX, disputas, saques e reconciliação. |
| Onboarding e backoffice | Rever activação, concluir ou rejeitar saques, editar o estado de regras e tickets. | Identidades distintas para comerciante e equipa interna, KYC, routing e CRM operacional. |
| Integrações | Consultar as dependências e o que falta para as ligar. | Configuração por ambiente e provedor, observabilidade e validação de cada fluxo. |

## Mapa das ligações do backend

A referência é o commit [dad3e55 de GenesisAlpha/xpay-backend](https://github.com/GenesisAlpha/xpay-backend/commit/dad3e55f3eda6b42d64712081a5612572fce2712). Os diagramas cobrem entradas, chamadas externas, eventos de retorno, persistência, tarefas agendadas e extensões previstas. O [inventário HTTP](docs/backend-api.md) detalha as **323 operações declaradas** e aponta para cada controlador. O [inventário de dependências](docs/backend-connections.md) dá rastreabilidade a hosts literais, variáveis e RPCs encontrados em **200 ficheiros TypeScript de produção**. Exposição e disponibilidade real dependem do ambiente.

### Entradas, identidades e papéis

~~~mermaid
flowchart TD
  Merchant["Comerciante no portal"] -. "BFF a integrar · JWT" .-> Identity["Auth, onboarding e seller"]
  Staff["Equipa interna"] -. "BFF a integrar · CRM JWT" .-> CRM["CRM e backoffice"]
  Buyer["Comprador"] -. "Referência de sessão" .-> Checkout["Checkout e embed"]
  Site["Servidor do comerciante"] -->|"API key e sessão"| Checkout
  Site -->|"API key e idempotência"| Pay["Pagamentos"]
  Worker["Checkout e serviços Koopfy"] -->|"Credencial interna ou contexto verificado"| Bridge["Integração Koopfy e rotas internas"]
  Identity --> Account["Organização, seller e loja"]
  CRM --> Account
  Bridge --> Account
  Account --> Portal["Dashboard, transações e settings"]
  Account --> Wallet["Wallet, transferências e disputas"]
  Checkout --> Pay
~~~

### Checkout, routing e provedores

~~~mermaid
flowchart TD
  Offer["Produto, preço e oferta versionada"] -.-> Links["Link fixo e botão a implementar"]
  Links -. "Nova sessão por tentativa" .-> Session["Sessão de checkout"]
  External["Loja ou serviço de checkout"] --> Session
  Session --> Router["Selecção por conta, país, moeda e método"]
  Router --> Connected["Contas próprias e conectadas"]
  Router --> Provider["Adapters e provedores configurados"]
  Connected --> Provider
  Provider --> A["Stripe, Whop, PayPal e Clip"]
  Provider --> B["Sentinel, Coinflow, Kontino, RoxPay e Slash"]
  Provider --> C["Approvebly · adapter observado"]
  Provider -.-> D["Viva · referência hosted no código"]
  Provider --> Sandbox["Simulador de pagamentos"]
  A --> Event["Resposta ou callback do provedor"]
  B --> Event
  Event --> Status["Estado da transação e reconciliação"]
  Status -. "Evento comercial a implementar" .-> Order["Pedido, cliente e entrega"]
~~~

O adapter existente, a referência de configuração e a capacidade homologada são estados distintos. As rotas de webhook observadas incluem Nexflow, Sentinel, Coinflow, Kontino, RoxPay, Slash, Whop, Stripe e PayPal, além do controlador Clip. Domínios e métodos variam com a conta e a região.

### Eventos, ledger e tarefas recorrentes

~~~mermaid
flowchart TD
  Provider["Provedor e reconciliação"] --> Hook["Recepção de webhooks"]
  Hook --> Match["Autenticidade, correlação e estado"]
  Match --> Transactions["Transações e histórico de eventos"]
  Transactions --> Store["Supabase Postgres"]
  Transactions --> Ledger["Carteira, ledger e reservas"]
  Ledger --> Store
  Payout["Orquestração de saques e antecipação"] --> Ledger
  Settlement["Cron de settlement e libertação de reservas"] --> Store
  Clip["Reconciliação de Clip"] --> Transactions
  Reconcile["Reconciliador de saques"] --> Payout
  Commissions["Afiliados e cron de comissões"] --> Store
  Billing["Facturação interna de sellers"] --> Store
  Billing -->|"Integração"| Whop["Whop"]
  Match -->|"Eventos e postbacks"| Merchant["Sistemas do comerciante"]
  Hook -. "Contrato de negócio a implementar" .-> CRM["OrbiaCRM e marketing"]
~~~

O schema Prisma descreve parte dos modelos. O runtime usa também clientes Supabase, migrações SQL, Storage e RPCs. O inventário lista as referências SQL encontradas no TypeScript. As funções efectivamente instaladas, as policies e os grants de staging precisam de validação própria.

### Serviços auxiliares e conexões externas

~~~mermaid
flowchart TD
  Identity["Auth, onboarding e perfil"] --> Mail["SendGrid"]
  Identity --> Storage["Supabase Storage"]
  Storage --> Restricted["Documentos, comprovativos e avatares"]
  FX["Conversão e cálculo de taxas"] --> OXR["Open Exchange Rates"]
  Clip["Leitura de comprovativos Clip SPEI"] --> Storage
  Clip --> AI["OpenAI ou fal · configuração opcional"]
  Admin["Backoffice XPay"] --> CheckoutSvc["Serviço de checkout Koopfy"]
  CheckoutSvc --> Shopify["Shopify · reenvio de pedido pago"]
  Crypto["Criptografia e instrumentação do Core"] --> Pay["Sessões, contas e pagamentos"]
  Provider["Stripe, PayPal e Whop"] --> SDK["SDK, redirecção ou experiência hosted"]
  SDK --> Buyer["Checkout do comprador"]
~~~

O checkout do comerciante pode envolver scripts, componentes alojados ou redirecções aprovadas pelo provedor. As chaves, credenciais internas, configuração por conta e operações monetárias pertencem ao servidor. O Stripe Observer está modelado como dependência a verificar por conta, loja e moeda.

### Checkout externo e CRM no desenho de produção

~~~mermaid
sequenceDiagram
  participant M as Comerciante ou OrbiaCRM
  participant B as Backend do site ou BFF
  participant X as Core XPay
  participant P as Provedor
  participant C as Comprador
  M->>B: Publica oferta ou cria intenção de cobrança
  C->>B: Abre link, botão ou checkout incorporado
  B->>X: Cria sessão com oferta, referência e moeda
  X->>P: Selecciona conta e inicia pagamento
  P-->>C: Apresenta método ou redirecciona
  P-->>X: Entrega evento de pagamento
  X->>X: Confirma estado e reconcilia
  X-->>B: Estado verificado e evento do pedido
  B-->>C: Confirmação e instruções da compra
  B-->>M: Actualiza pedido, cliente e CRM
~~~

O Core auditado já declara sessão, configuração embed, encaminhamento e pagamento. A publicação de oferta e link, os eventos de pedido e o conector comercial do OrbiaCRM são extensões previstas. O CRM operacional da equipa XPay já existe no backend. O OrbiaCRM tem identidade, contactos e funis próprios.

## O que ligar e provar em staging

| Dependência | Estado na revisão | O que configurar e validar |
|---|---|---|
| Core HTTP e BFF | Contratos por função no código. UI em demonstração. | Host, base path, SHA de deploy, identidade e expiração de sessão, CSRF, autorização por organização e papel, timeouts e envelopes. Login verificado com email em vez de usar o OpenAPI legado como geração automática de cliente. |
| Catálogo, ofertas, pedido e link | Modelo de link e oferta de risco observados. Ciclo comercial a fechar. | Contrato transaccional para preço em unidades menores, ofertas versionadas, link público, desactivação, pedido, entrega e cliente. Sessões diferentes para compradores diferentes. |
| Adquirentes e contas | Adapters, routing e entradas para callbacks observados. | Conta habilitada, capacidade por moeda, país e método. Assinatura, replay, idempotência, correlação, estados pendentes e reconciliação por provedor. |
| Shopify e serviço de checkout | Ponte de reenvio de pedido pago observada. | Confirmar serviço, credencial interna e escopo. Validar criação, actualização e reenvio de pedido de ponta a ponta. |
| OrbiaCRM | CRM comercial separado com contactos e campanhas. | Mapear organização, comprador, pedido e identificador externo. Definir a responsabilidade por contacto, intenção de cobrança e evento pago. |
| Afiliados e marketing | Affiliate CRM, eventos de comércio e atribuição a completar. | Identidade e comissão, atribuição por campanha, reembolso, consentimento e canal de comunicação. |
| Persistência e rotinas | Schema, Storage, cron e chamadas RPC auditados. | Exportar esquema e ledger sem dados pessoais. Validar versões de migração, RPCs, permissões, retenção, restauração e reconciliação. |
| Email, FX e análise de comprovativos | Integrações encontradas no código. | Configurar contas, políticas e modos de falha por ambiente. Verificar o tratamento dos dados de comprovativos antes de activar a análise externa. |
| Stripe Observer | Associação ao produto XPay por confirmar. | Validar conta, loja, origem dos eventos e moedas. Manter a ligação de leitura distinta da cobrança directa. |

O marco de estreia em staging é um produto → oferta → link → pagamento de teste → pedido → cliente → reconciliação. A Mission 001 assinala gates de verificação de webhooks, isolamento de operações de teste, idempotência, unidades monetárias, saldos e migrações. Checkout monetário e escritas financeiras só seguem após fecho dos gates.

## Verificação local

O comando npm run check valida JavaScript, o inventário de rotas e os testes do modelo. O armazenamento local pertence apenas à demonstração e foi desenhado para um operador de teste. Produção exige persistência e autorização no servidor.

### Referências

- [Core XPay](https://github.com/GenesisAlpha/xpay-backend/tree/dad3e55f3eda6b42d64712081a5612572fce2712)
- [Core — composição NestJS](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/app.module.ts)
- [OrbiaCRM](https://github.com/GenesisAlpha/OrbiaCRM)
