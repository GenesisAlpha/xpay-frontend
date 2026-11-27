# Checkout XPAY

[Demonstração local AtlasClub](http://127.0.0.1:4173/checkout.html?demo=1&customize=1), disponível depois de `npm start`. O preço de exemplo é 9,90 €/mês sem fidelização. A demonstração usa dados fictícios, simula pagamento e permite editar a visibilidade e obrigatoriedade dos campos. Os links criados no painel podem apontar para ofertas avulsas com quantidade ajustável.

## Contrato entre o frontend e o XPAY

O checkout publicado usa `checkout.html?session=<id>` e espera estas rotas na mesma origem. São o contrato do adaptador XPAY a implementar e validar com o backend.

| Rota | Contrato |
| --- | --- |
| `GET /api/checkout/{id}` | Retorna `merchant`, `mode` (`test` ou `live`), `currency`, `cycle` (`month` ou `once`), `items`, `methods`, `fieldConfig`, `status` e, quando aplicável, `action`, `merchantOrigin`, `returnUrl`, `closeAfterPayment`, `redirectOrigins` e `cancelAnytime`. Cada artigo inclui `id`, `name`, `unitAmount`, `quantity` e `maxQuantity`. |
| `POST /api/checkout/{id}/pay` | Recebe `method`, `customer`, `items` com `id` e `quantity`, e o cabeçalho `Idempotency-Key`. O servidor resolve produtos, preços, moeda, limites, dados obrigatórios e escolha do provedor. Responde com `status` e, se houver, `action`. |
| `GET /api/checkout/{id}/status` | Retorna `status` e a ação pendente. O estado definitivo vem do backend depois de confirmar o pagamento com o provedor. A expiração da consulta no navegador permite consultar novamente. |

Use montantes em unidades menores da moeda, `mbway` para MB WAY, `multibanco`, `bizum`, `card`, `pix` ou `iban`. Para os campos `email`, `name`, `phone`, `country`, `postalCode` e `taxId`, use `hidden`, `optional` ou `required`. MB WAY exige telemóvel. Um meio só deve ser devolvido se estiver disponível para o comerciante, país, moeda, tipo de cobrança e ambiente.

O iframe de dados de cartão é gerido pelo Stripe Payment Element. O adaptador entrega o `clientSecret` e a chave publicável do ambiente. O browser confirma o pagamento e consulta o estado XPAY. Para renovação recorrente, o backend precisa de uma subscrição Stripe e de processar os eventos de renovação. Consulte o formato de cada ação em `public/checkout.js`.

Pix apresenta o QR e o código copia e cola que vierem do provedor. Multibanco apresenta entidade, referência e montante. Transferência apresenta os dados bancários que a sessão disponibilizar. O redirecionamento bancário usa apenas destinos autorizados pelo servidor. Pix e transferência dependem de integrações de provedor.

## Alojado e sobreposto

O link alojado volta ao `returnUrl` autorizado após confirmação. Se a sessão pedir fecho e o navegador permitir, a janela fecha. Nos restantes casos, o comprador vê a confirmação e pode fechar o separador.

Para abrir sobre a loja, importe `openCheckout` de `checkout-embed.js`. Passe o URL da sessão e um `onPaid` opcional para atualizar a página. O iframe valida a origem do comerciante fornecida pelo servidor. O site do comerciante valida origem, janela e ID da sessão na mensagem. Confirme o pagamento no servidor ou pelo webhook XPAY antes de libertar um pedido. Autorize a origem da loja no `frame-ancestors` da resposta de checkout e autorize na loja a origem XPAY para carregar o script e o iframe.

## Marcas de pagamento

- [Logótipo MB WAY no site oficial](https://www.mbway.pt/wp-content/uploads/2020/07/Logo_MBWay@2x.png)
- [Logótipo no site oficial Multibanco](https://www.multibanco.pt/wp-content/uploads/2025/01/Multibanco-Logo-CMYK.svg)
- [Logótipo no site oficial Bizum](https://bizum.com/pt/wp-content/uploads/2026/11/logo-bizum-black-1-1-1.svg)
- [Identidade Pix no Banco Central do Brasil](https://www.bcb.gov.br/estabilidadefinanceira/pix)

Valide a apresentação comercial com as marcas antes do lançamento público.
