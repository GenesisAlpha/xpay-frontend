export const navigation = [
  ['Workspace', [
    ['overview', 'Visão geral', 'grid'],
    ['products', 'Catálogo', 'box'],
    ['offers', 'Ofertas', 'tag'],
    ['links', 'Links e checkout', 'link'],
    ['orders', 'Pedidos', 'cart'],
    ['customers', 'Clientes e CRM', 'users'],
  ]],
  ['Crescimento', [
    ['campaigns', 'Campanhas', 'target'],
    ['affiliates', 'Afiliados', 'users'],
    ['subscriptions', 'Assinaturas', 'refresh'],
  ]],
  ['Operação', [
    ['payments', 'Pagamentos', 'card'],
    ['finance', 'Carteira', 'wallet'],
    ['payouts', 'Saques', 'arrow'],
    ['disputes', 'Disputas', 'shield'],
    ['merchants', 'Onboarding', 'users'],
    ['operations', 'Backoffice', 'settings'],
    ['integrations', 'Integrações', 'plug'],
  ]],
];

export const descriptions = {
  products: 'Organize produtos digitais, físicos e serviços por loja.',
  offers: 'Defina o preço e as condições que serão apresentadas no checkout.',
  links: 'Distribua a mesma oferta por link, botão, embed ou sessão via API.',
  orders: 'Acompanhe compras e o estado de cada pedido.',
  customers: 'Consulte o histórico de compras e registe notas por cliente.',
  campaigns: 'Associe canais e campanhas aos seus links de pagamento.',
  affiliates: 'Registe parceiros e condições de comissão por loja.',
  subscriptions: 'Acompanhe o primeiro pagamento de ofertas mensais.',
  payments: 'Acompanhe transações, moeda, método e estado.',
  finance: 'Consulte os saldos de demonstração por moeda e loja.',
  payouts: 'Acompanhe os pedidos de transferência e a sua revisão.',
  disputes: 'Consulte casos e estados de revisão por pedido.',
  merchants: 'Simule a apresentação e a revisão de pedidos de activação por loja.',
  operations: 'Simule revisão de saques, regras de routing e tickets internos.',
  integrations: 'Consulte o estado e os requisitos de ligação de cada sistema.',
};

export const integrations = [
  ['Core XPay', 'Autenticação, sessões, pagamentos e serviços financeiros.', 'Validar em staging', 'Host do Core, contrato por papel, identidade da organização e versão do runtime.'],
  ['Stripe · Whop · PayPal · Clip', 'Métodos e contas disponíveis por organização e região.', 'Validar por provedor', 'Configurar a conta no Core e testar captura, redireccionamento, confirmação assíncrona e reembolso.'],
  ['Viva · Sentinel · Coinflow · Kontino · RoxPay · Slash', 'Adapters e handlers encontrados no Core auditado.', 'Validar por provedor', 'Confirmar operações suportadas, conta activa, webhook e reconciliação antes de habilitar cada método.'],
  ['Links e catálogo', 'Produtos, ofertas versionadas e resolução pública de links.', 'Contrato em falta', 'Criar ou validar API de criação, publicação, resolução, pausa e revogação de links.'],
  ['OrbiaCRM', 'Ficha comercial, funis, campanhas e atendimento.', 'Conector por implementar', 'Mapear organização, contacto, pedido e evento financeiro. Validar deduplicação e sincronização.'],
  ['Shopify', 'Integração de pedidos através do checkout externo.', 'Validar em staging', 'Confirmar instalação, serviço externo de checkout, encaminhamento de pedidos e reenvio operacional.'],
  ['Página do comerciante', 'Botão alojado e checkout incorporado.', 'Validar contrato público', 'Validar domínio, referências de sessão e mensagens do embed. Gerar snippets após aprovação.'],
  ['Marketing e afiliados', 'Atribuição, eventos de conversão e parceiros.', 'Implementação parcial no Core', 'Validar comissões, capturar origem de campanhas e ligar os canais de comunicação aprovados.'],
  ['Webhook de saída', 'Eventos verificados do Core para sistemas do comerciante.', 'Validar em staging', 'Definir tópicos, assinatura, reentrega, desduplicação e auditoria.'],
  ['Stripe Observer', 'Leitura de pagamentos de contas e lojas externas.', 'Validar associação de conta e loja', 'Confirmar capacidade por gateway, loja e moeda e definir reconciliação exclusiva de leitura.'],
];

export const definitions = {
  products: { action: 'Criar produto', fields: ['Produto', 'Tipo', 'Loja', 'Estado'], columns: ['name', 'kind', 'store', 'status'] },
  offers: { action: 'Criar oferta', fields: ['Oferta', 'Preço', 'Frequência', 'Loja', 'Estado'], columns: ['name', 'money', 'cycle', 'store', 'status'] },
  links: { action: 'Criar link', fields: ['Link', 'Oferta', 'Canal', 'Loja', 'Estado'], columns: ['id', 'offerName', 'channel', 'store', 'status'] },
  orders: { fields: ['Pedido', 'Cliente', 'Oferta', 'Total', 'Pagamento', 'Entrega', 'Data'], columns: ['id', 'name', 'item', 'money', 'status', 'fulfillment', 'created'] },
  payments: { fields: ['Referência', 'Cliente', 'Método', 'Total', 'Estado', 'Data'], columns: ['id', 'name', 'method', 'money', 'status', 'created'] },
  customers: { fields: ['Cliente', 'Email', 'Loja', 'Pedidos', 'Última compra'], columns: ['name', 'email', 'store', 'count', 'created'] },
  campaigns: { action: 'Criar campanha', fields: ['Campanha', 'Canal', 'Link', 'Conversões', 'Estado'], columns: ['name', 'type', 'link', 'conversions', 'status'] },
  affiliates: { action: 'Adicionar afiliado', fields: ['Parceiro', 'Email', 'Comissão', 'Loja', 'Estado'], columns: ['name', 'email', 'rate', 'store', 'status'] },
  subscriptions: { fields: ['Referência', 'Cliente', 'Oferta', 'Valor inicial', 'Pagamento', 'Data'], columns: ['id', 'name', 'item', 'money', 'status', 'created'] },
  payouts: { action: 'Pedir saque', fields: ['Pedido', 'Loja', 'Valor', 'Estado', 'Data'], columns: ['id', 'store', 'money', 'status', 'created'] },
  disputes: { action: 'Registar caso', fields: ['Caso', 'Pedido', 'Motivo', 'Estado'], columns: ['id', 'order', 'name', 'status'] },
  rules: { action: 'Criar regra', fields: ['Regra', 'Provedor', 'Loja', 'Estado'], columns: ['name', 'provider', 'store', 'status'] },
  tickets: { action: 'Abrir ticket', fields: ['Ticket', 'Assunto', 'Categoria', 'Estado', 'Data'], columns: ['id', 'name', 'category', 'status', 'created'] },
  merchants: { fields: ['Comerciante', 'Loja', 'Activação'], columns: ['name', 'store', 'status'] },
};
