# Inventário HTTP do backend XPay

Os paths são relativos à raiz NestJS observada. Cada linha aponta para a declaração no SHA auditado. A coluna de autenticação documenta o guard/decorador encontrado na declaração ou na classe. **Sem decorador mapeado** indica que o inventário não atribui um guard por essa via. A família pode validar sessão de checkout, assinatura, contexto ou autorização dentro do handler, no serviço ou na infraestrutura. Código HTTP indicado apenas onde existe `@HttpCode`. Os endpoints `crm`, `internal`, `integration`, webhooks e S2S exigem os respetivos limites de acesso para a arquitetura proposta.

### Saúde do processo · 2

| Operação | Guard/decorador | HTTP explícito | Evidência |
|---|---|---|---|
| `GET /` | — | — | [AppController · L5](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/app.controller.ts#L5) |
| `GET /health` | — | — | [AppController · L10](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/app.controller.ts#L10) |

### Autenticação · 7

| Operação | Guard/decorador | HTTP explícito | Evidência |
|---|---|---|---|
| `POST /auth/register` | — | — | [AuthController · L28](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/auth/auth.controller.ts#L28) |
| `POST /auth/verify-email` | — | `OK` | [AuthController · L33](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/auth/auth.controller.ts#L33) |
| `POST /auth/resend-verification` | — | `OK` | [AuthController · L41](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/auth/auth.controller.ts#L41) |
| `POST /auth/login` | — | `OK` | [AuthController · L48](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/auth/auth.controller.ts#L48) |
| `POST /auth/forgot-password` | — | `OK` | [AuthController · L55](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/auth/auth.controller.ts#L55) |
| `POST /auth/reset-password` | — | `OK` | [AuthController · L62](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/auth/auth.controller.ts#L62) |
| `GET /auth/me` | `JwtAuthGuard` | — | [AuthController · L69](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/auth/auth.controller.ts#L69) |

### Onboarding · 5

| Operação | Guard/decorador | HTTP explícito | Evidência |
|---|---|---|---|
| `POST /onboarding/kyc` | `JwtOnly` | — | [OnboardingController · L16](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/onboarding/onboarding.controller.ts#L16) |
| `POST /onboarding/operation` | `JwtOnly` | — | [OnboardingController · L23](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/onboarding/onboarding.controller.ts#L23) |
| `POST /onboarding/documents` | `JwtOnly` | — | [OnboardingController · L30](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/onboarding/onboarding.controller.ts#L30) |
| `GET /onboarding/activation-request` | `JwtOnly` | — | [OnboardingController · L37](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/onboarding/onboarding.controller.ts#L37) |
| `POST /onboarding/activation-request` | `JwtOnly` | — | [OnboardingController · L45](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/onboarding/onboarding.controller.ts#L45) |

### Dashboard seller · 1

| Operação | Guard/decorador | HTTP explícito | Evidência |
|---|---|---|---|
| `GET /dashboard` | `JwtOnly` | — | [DashboardController · L39](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/dashboard/controllers/controllers.ts#L39) |

### Transações seller · 2

| Operação | Guard/decorador | HTTP explícito | Evidência |
|---|---|---|---|
| `GET /transactions` | `JwtOnly` | — | [TransactionsController · L57](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/dashboard/controllers/controllers.ts#L57) |
| `GET /transactions/:id` | `JwtOnly` | — | [TransactionsController · L71](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/dashboard/controllers/controllers.ts#L71) |

### Wallet seller · 6

| Operação | Guard/decorador | HTTP explícito | Evidência |
|---|---|---|---|
| `GET /wallet/balance` | `JwtOnly` | — | [WalletController · L85](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/dashboard/controllers/controllers.ts#L85) |
| `GET /wallet/entries` | `JwtOnly` | — | [WalletController · L91](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/dashboard/controllers/controllers.ts#L91) |
| `GET /wallet/payouts` | `JwtOnly` | — | [WalletController · L102](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/dashboard/controllers/controllers.ts#L102) |
| `GET /wallet/payout-destinations` | `JwtOnly` | — | [WalletController · L112](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/dashboard/controllers/controllers.ts#L112) |
| `GET /wallet/payout-destinations/fields` | `JwtOnly` | — | [WalletController · L119](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/dashboard/controllers/controllers.ts#L119) |
| `POST /wallet/payout` | `JwtOnly` | — | [WalletController · L129](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/dashboard/controllers/controllers.ts#L129) |

### Disputas seller · 3

| Operação | Guard/decorador | HTTP explícito | Evidência |
|---|---|---|---|
| `GET /disputes/stats` | `JwtOnly` | — | [DisputesController · L148](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/dashboard/controllers/controllers.ts#L148) |
| `GET /disputes` | `JwtOnly` | — | [DisputesController · L154](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/dashboard/controllers/controllers.ts#L154) |
| `POST /disputes/:id/respond` | `JwtOnly` | — | [DisputesController · L165](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/dashboard/controllers/controllers.ts#L165) |

### Transferências seller · 3

| Operação | Guard/decorador | HTTP explícito | Evidência |
|---|---|---|---|
| `GET /transfers/totals` | `JwtOnly` | — | [TransfersController · L179](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/dashboard/controllers/controllers.ts#L179) |
| `GET /transfers` | `JwtOnly` | — | [TransfersController · L185](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/dashboard/controllers/controllers.ts#L185) |
| `POST /transfers/:id/retry` | `JwtOnly` | — | [TransfersController · L196](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/dashboard/controllers/controllers.ts#L196) |

### Métodos seller · 4

| Operação | Guard/decorador | HTTP explícito | Evidência |
|---|---|---|---|
| `GET /payment-methods` | `JwtOnly` | — | [PaymentMethodsController · L210](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/dashboard/controllers/controllers.ts#L210) |
| `PATCH /payment-methods/:id/toggle` | `JwtOnly` | — | [PaymentMethodsController · L216](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/dashboard/controllers/controllers.ts#L216) |
| `PATCH /payment-methods/:id/config` | `JwtOnly` | — | [PaymentMethodsController · L222](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/dashboard/controllers/controllers.ts#L222) |
| `GET /payment-methods/:id/performance` | `JwtOnly` | — | [PaymentMethodsController · L228](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/dashboard/controllers/controllers.ts#L228) |

### Configurações seller · 6

| Operação | Guard/decorador | HTTP explícito | Evidência |
|---|---|---|---|
| `GET /settings` | `JwtOnly` | — | [SettingsController · L242](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/dashboard/controllers/controllers.ts#L242) |
| `PATCH /settings` | `JwtOnly` | — | [SettingsController · L248](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/dashboard/controllers/controllers.ts#L248) |
| `GET /settings/offers` | `JwtOnly` | — | [SettingsController · L255](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/dashboard/controllers/controllers.ts#L255) |
| `POST /settings/offers` | `JwtOnly` | — | [SettingsController · L260](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/dashboard/controllers/controllers.ts#L260) |
| `POST /settings/password` | `JwtOnly` | `200` | [SettingsController · L265](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/dashboard/controllers/controllers.ts#L265) |
| `GET /settings/webhook/secret` | `JwtOnly` | — | [SettingsController · L271](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/dashboard/controllers/controllers.ts#L271) |

### Credenciais · 6

| Operação | Guard/decorador | HTTP explícito | Evidência |
|---|---|---|---|
| `POST /credentials` | `JwtOnly` | — | [ApiKeysController · L285](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/dashboard/controllers/controllers.ts#L285) |
| `GET /credentials` | `JwtOnly` | — | [ApiKeysController · L294](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/dashboard/controllers/controllers.ts#L294) |
| `DELETE /credentials/:id` | `JwtOnly` | `OK` | [ApiKeysController · L303](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/dashboard/controllers/controllers.ts#L303) |
| `POST /credentials/:id/rotate` | `JwtOnly` | — | [ApiKeysController · L313](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/dashboard/controllers/controllers.ts#L313) |
| `POST /credentials/validate` | — | — | [ApiKeysController · L322](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/dashboard/controllers/controllers.ts#L322) |
| `POST /credentials/create` | — | — | [ApiKeysController · L334](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/dashboard/controllers/controllers.ts#L334) |

### Checkout · 4

| Operação | Guard/decorador | HTTP explícito | Evidência |
|---|---|---|---|
| `POST /checkout/session` | `ApiKeyGuard` | — | [CheckoutSessionController · L19](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/checkout-session/%20%20checkout-session.controller.ts#L19) |
| `GET /checkout/session/:sessionId/embed-config` | — | — | [CheckoutSessionController · L33](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/checkout-session/%20%20checkout-session.controller.ts#L33) |
| `POST /checkout/session/:sessionId/route` | — | — | [CheckoutSessionController · L45](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/checkout-session/%20%20checkout-session.controller.ts#L45) |
| `POST /checkout/session/:sessionId/pay` | — | — | [CheckoutSessionController · L71](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/checkout-session/%20%20checkout-session.controller.ts#L71) |

### Pagamentos S2S · 22

| Operação | Guard/decorador | HTTP explícito | Evidência |
|---|---|---|---|
| `POST /payments/create` | `ApiKeyGuard` | — | [PaymentController · L20](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/payments/payments.controller.ts#L20) |
| `POST /payments/mbway` | `ApiKeyGuard` | — | [PaymentController · L41](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/payments/payments.controller.ts#L41) |
| `GET /payments/config` | `ApiKeyGuard` | — | [PaymentController · L81](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/payments/payments.controller.ts#L81) |
| `POST /payments/routing/link-accounts` | `ApiKeyGuard` | `OK` | [PaymentController · L102](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/payments/payments.controller.ts#L102) |
| `POST /payments/routing/link-accounts/disable` | `ApiKeyGuard` | `OK` | [PaymentController · L109](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/payments/payments.controller.ts#L109) |
| `POST /payments/routing/link-accounts/connected` | `ApiKeyGuard` | `OK` | [PaymentController · L118](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/payments/payments.controller.ts#L118) |
| `POST /payments/routing/link-sales` | `ApiKeyGuard` | `OK` | [PaymentController · L125](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/payments/payments.controller.ts#L125) |
| `POST /payments/clip/route` | `ApiKeyGuard` | — | [PaymentController · L143](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/payments/payments.controller.ts#L143) |
| `POST /payments/spei/:transactionId/proof` | `ApiKeyGuard` | — | [PaymentController · L152](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/payments/payments.controller.ts#L152) |
| `GET /payments/pse/banks` | `ApiKeyGuard` | — | [PaymentController · L160](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/payments/payments.controller.ts#L160) |
| `GET /payments/spei/:transactionId/status` | `ApiKeyGuard` | — | [PaymentController · L166](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/payments/payments.controller.ts#L166) |
| `GET /payments/:transactionId/status` | `ApiKeyGuard` | — | [PaymentController · L172](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/payments/payments.controller.ts#L172) |
| `POST /payments/:transactionId/paypal/capture` | `ApiKeyGuard` | `OK` | [PaymentController · L181](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/payments/payments.controller.ts#L181) |
| `GET /payments/:transactionId/upsell-eligibility` | `ApiKeyGuard` | — | [PaymentController · L192](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/payments/payments.controller.ts#L192) |
| `GET /payments/:transactionId/subscription` | `ApiKeyGuard` | — | [PaymentController · L201](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/payments/payments.controller.ts#L201) |
| `POST /payments/:transactionId/subscription/cancel` | `ApiKeyGuard` | `OK` | [PaymentController · L207](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/payments/payments.controller.ts#L207) |
| `POST /payments/:transactionId/subscription/reactivate` | `ApiKeyGuard` | `OK` | [PaymentController · L214](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/payments/payments.controller.ts#L214) |
| `POST /payments/spei/receipt` | `ApiKeyGuard` | — | [PaymentController · L226](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/payments/payments.controller.ts#L226) |
| `POST /payments/clip/release` | `ApiKeyGuard` | `OK` | [PaymentController · L237](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/payments/payments.controller.ts#L237) |
| `POST /payments/coinflow/session` | `ApiKeyGuard` | — | [PaymentController · L246](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/payments/payments.controller.ts#L246) |
| `POST /payments/tracking` | — | — | [PaymentController · L253](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/payments/payments.controller.ts#L253) |
| `POST /payments/test/charge` | — | — | [PaymentController · L283](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/payments/payments.controller.ts#L283) |

### Webhooks de provedores · 12

| Operação | Guard/decorador | HTTP explícito | Evidência |
|---|---|---|---|
| `POST /webhook/clip` | — | `OK` | [ClipWebhookController · L12](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/payments/clip-webhook.controller.ts#L12) |
| `POST /webhook/nexflow` | — | — | [WebhookController · L13](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/webhooks/webhook.controller.ts#L13) |
| `POST /webhook/sentinel` | — | — | [WebhookController · L19](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/webhooks/webhook.controller.ts#L19) |
| `POST /webhook/coinflow` | — | — | [WebhookController · L33](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/webhooks/webhook.controller.ts#L33) |
| `POST /webhook/kontino` | — | `200` | [WebhookController · L46](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/webhooks/webhook.controller.ts#L46) |
| `POST /webhook/roxpay` | — | — | [WebhookController · L54](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/webhooks/webhook.controller.ts#L54) |
| `POST /webhook/slash` | — | — | [WebhookController · L61](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/webhooks/webhook.controller.ts#L61) |
| `POST /webhook/whop` | — | — | [WebhookController · L73](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/webhooks/webhook.controller.ts#L73) |
| `POST /webhook/whop/connected` | — | — | [WebhookController · L105](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/webhooks/webhook.controller.ts#L105) |
| `POST /webhook/whop/:accountId` | — | — | [WebhookController · L125](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/webhooks/webhook.controller.ts#L125) |
| `POST /webhook/stripe/:accountId` | — | — | [WebhookController · L160](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/webhooks/webhook.controller.ts#L160) |
| `POST /webhook/paypal/:accountId` | — | `OK` | [WebhookController · L180](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/webhooks/webhook.controller.ts#L180) |

### Provedores · 1

| Operação | Guard/decorador | HTTP explícito | Evidência |
|---|---|---|---|
| `POST /providers/create` | — | — | [ProviderController · L10](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/providers/providers.controller.ts#L10) |

### Sellers · 2

| Operação | Guard/decorador | HTTP explícito | Evidência |
|---|---|---|---|
| `POST /sellers/create` | — | — | [SellersController · L10](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/sellers/sellers.controller.ts#L10) |
| `GET /sellers/:id` | — | — | [SellersController · L15](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/sellers/sellers.controller.ts#L15) |

### Integração Koopfy · 94

| Operação | Guard/decorador | HTTP explícito | Evidência |
|---|---|---|---|
| `GET /integration/koopfy/affiliate/summary` | `CrossServiceJwtGuard` | — | [AffiliateEarningsController · L16](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/affiliates/affiliate-earnings.controller.ts#L16) |
| `GET /integration/koopfy/affiliate/commissions` | `CrossServiceJwtGuard` | — | [AffiliateEarningsController · L21](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/affiliates/affiliate-earnings.controller.ts#L21) |
| `GET /integration/koopfy/finance/overview` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L26](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L26) |
| `POST /integration/koopfy/finance/transaction-fees` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L32](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L32) |
| `GET /integration/koopfy/finance/transactions` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L37](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L37) |
| `GET /integration/koopfy/finance/transactions/:id` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L42](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L42) |
| `GET /integration/koopfy/finance/transactions/:id/refund` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L49](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L49) |
| `POST /integration/koopfy/finance/transactions/:id/refund` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L54](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L54) |
| `GET /integration/koopfy/finance/wallet` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L59](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L59) |
| `GET /integration/koopfy/finance/anticipation` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L65](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L65) |
| `POST /integration/koopfy/finance/anticipation` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L70](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L70) |
| `GET /integration/koopfy/finance/wallet/entries` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L75](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L75) |
| `GET /integration/koopfy/finance/wallet/payouts` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L80](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L80) |
| `GET /integration/koopfy/finance/payouts/quote` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L86](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L86) |
| `GET /integration/koopfy/finance/payouts/destinations` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L92](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L92) |
| `GET /integration/koopfy/finance/payouts/destinations/fields` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L97](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L97) |
| `GET /integration/koopfy/finance/payout-account` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L102](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L102) |
| `POST /integration/koopfy/finance/payout-account/verification` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L107](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L107) |
| `POST /integration/koopfy/finance/payout-account/sync` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L117](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L117) |
| `GET /integration/koopfy/finance/payout-methods/supported` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L122](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L122) |
| `GET /integration/koopfy/finance/payout-methods` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L127](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L127) |
| `POST /integration/koopfy/finance/payout-methods` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L132](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L132) |
| `DELETE /integration/koopfy/finance/payout-methods/:id` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L153](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L153) |
| `POST /integration/koopfy/finance/payout-preview` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L158](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L158) |
| `POST /integration/koopfy/finance/payouts` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L172](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L172) |
| `POST /integration/koopfy/finance/payouts/:id/reconfirm` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L181](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L181) |
| `GET /integration/koopfy/finance/transfers/totals` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L196](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L196) |
| `GET /integration/koopfy/finance/transfers` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L201](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L201) |
| `POST /integration/koopfy/finance/transfers/:id/retry` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L206](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L206) |
| `GET /integration/koopfy/finance/disputes/stats` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L211](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L211) |
| `GET /integration/koopfy/finance/disputes` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L216](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L216) |
| `POST /integration/koopfy/finance/disputes/:id/respond` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L221](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L221) |
| `GET /integration/koopfy/finance/payment-methods` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L233](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L233) |
| `PATCH /integration/koopfy/finance/payment-methods/:id/config` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L241](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L241) |
| `GET /integration/koopfy/finance/payment-methods/:id/performance` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L246](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L246) |
| `GET /integration/koopfy/finance/settings` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L251](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L251) |
| `PATCH /integration/koopfy/finance/settings` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L256](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L256) |
| `GET /integration/koopfy/finance/settings/webhook-secret` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L267](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L267) |
| `GET /integration/koopfy/finance/offers` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L272](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L272) |
| `POST /integration/koopfy/finance/offers` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L277](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L277) |
| `GET /integration/koopfy/finance/api-keys` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L290](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L290) |
| `POST /integration/koopfy/finance/api-keys` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L295](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L295) |
| `DELETE /integration/koopfy/finance/api-keys/:id` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L300](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L300) |
| `POST /integration/koopfy/finance/api-keys/:id/rotate` | `CrossServiceJwtGuard` | — | [KoopfyFinanceController · L305](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-finance.controller.ts#L305) |
| `GET /integration/koopfy/status` | `CrossServiceTokenGuard` | — | [KoopfyIntegrationController · L40](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L40) |
| `GET /integration/koopfy/accounts` | `CrossServiceTokenGuard` | — | [KoopfyIntegrationController · L48](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L48) |
| `POST /integration/koopfy/accounts` | `CrossServiceTokenGuard` | — | [KoopfyIntegrationController · L55](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L55) |
| `POST /integration/koopfy/activate` | `CrossServiceJwtGuard` | — | [KoopfyIntegrationController · L62](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L62) |
| `POST /integration/koopfy/provision` | `CrossServiceTokenGuard` | — | [KoopfyIntegrationController · L70](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L70) |
| `POST /integration/koopfy/onboarding/kyc` | `CrossServiceJwtGuard` | — | [KoopfyIntegrationController · L76](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L76) |
| `POST /integration/koopfy/onboarding/operation` | `CrossServiceJwtGuard` | — | [KoopfyIntegrationController · L83](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L83) |
| `POST /integration/koopfy/onboarding/documents` | `CrossServiceJwtGuard` | — | [KoopfyIntegrationController · L90](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L90) |
| `GET /integration/koopfy/onboarding/activation-request` | `CrossServiceJwtGuard` | — | [KoopfyIntegrationController · L98](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L98) |
| `POST /integration/koopfy/onboarding/activation-request` | `CrossServiceJwtGuard` | — | [KoopfyIntegrationController · L104](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L104) |
| `POST /integration/koopfy/onboarding/connected-verification` | `CrossServiceJwtGuard` | — | [KoopfyIntegrationController · L113](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L113) |
| `POST /integration/koopfy/onboarding/connected-link` | `CrossServiceJwtGuard` | — | [KoopfyIntegrationController · L121](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L121) |
| `POST /integration/koopfy/onboarding/requirements` | `CrossServiceJwtGuard` | — | [KoopfyIntegrationController · L128](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L128) |
| `GET /integration/koopfy/cadastro` | `CrossServiceTokenGuard` | — | [KoopfyIntegrationController · L140](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L140) |
| `POST /integration/koopfy/cadastro/arquivo` | `CrossServiceTokenGuard` | — | [KoopfyIntegrationController · L146](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L146) |
| `POST /integration/koopfy/cadastro` | `CrossServiceTokenGuard` | — | [KoopfyIntegrationController · L152](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L152) |
| `POST /integration/koopfy/cadastro/kontino-link` | `CrossServiceTokenGuard` | — | [KoopfyIntegrationController · L161](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L161) |
| `GET /integration/koopfy/kontino` | `CrossServiceTokenGuard` | — | [KoopfyIntegrationController · L171](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L171) |
| `POST /integration/koopfy/kontino` | `CrossServiceTokenGuard` | — | [KoopfyIntegrationController · L177](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L177) |
| `POST /integration/koopfy/kontino/connect-existing` | `CrossServiceTokenGuard` | — | [KoopfyIntegrationController · L184](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L184) |
| `POST /integration/koopfy/external-provider/connect` | `CrossServiceTokenGuard` | — | [KoopfyIntegrationController · L194](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L194) |
| `POST /integration/koopfy/external-provider/stripe/connect` | `CrossServiceTokenGuard` | — | [KoopfyIntegrationController · L214](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L214) |
| `POST /integration/koopfy/external-provider/stripe/disconnect` | `CrossServiceJwtGuard` | — | [KoopfyIntegrationController · L223](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L223) |
| `POST /integration/koopfy/external-provider/paypal/connect` | `CrossServiceTokenGuard` | — | [KoopfyIntegrationController · L229](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L229) |
| `POST /integration/koopfy/external-provider/paypal/disconnect` | `CrossServiceJwtGuard` | — | [KoopfyIntegrationController · L238](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L238) |
| `POST /integration/koopfy/external-provider/accounts/:accountId/disconnect` | `CrossServiceJwtGuard` | `OK` | [KoopfyIntegrationController · L247](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L247) |
| `GET /integration/koopfy/payment-account` | `CrossServiceJwtGuard` | — | [KoopfyIntegrationController · L258](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L258) |
| `PUT /integration/koopfy/payment-account` | `CrossServiceJwtGuard` | — | [KoopfyIntegrationController · L265](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L265) |
| `GET /integration/koopfy/routing` | `CrossServiceJwtGuard` | — | [KoopfyIntegrationController · L275](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L275) |
| `PUT /integration/koopfy/routing` | `CrossServiceJwtGuard` | — | [KoopfyIntegrationController · L283](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L283) |
| `PUT /integration/koopfy/routing/accounts/:accountId` | `CrossServiceJwtGuard` | — | [KoopfyIntegrationController · L291](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L291) |
| `POST /integration/koopfy/routing/accounts/:accountId/default` | `CrossServiceJwtGuard` | — | [KoopfyIntegrationController · L299](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L299) |
| `POST /integration/koopfy/routing/simulate` | `CrossServiceJwtGuard` | — | [KoopfyIntegrationController · L307](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L307) |
| `GET /integration/koopfy/routing/series` | `CrossServiceJwtGuard` | — | [KoopfyIntegrationController · L314](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L314) |
| `GET /integration/koopfy/routing/history` | `CrossServiceJwtGuard` | — | [KoopfyIntegrationController · L321](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L321) |
| `GET /integration/koopfy/external-provider/finance` | `CrossServiceJwtGuard` | — | [KoopfyIntegrationController · L329](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L329) |
| `GET /integration/koopfy/external-provider/accounts/:accountId/wallet` | `CrossServiceJwtGuard` | — | [KoopfyIntegrationController · L336](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L336) |
| `POST /integration/koopfy/external-provider/accounts/:accountId/withdrawals` | `CrossServiceJwtGuard` | `OK` | [KoopfyIntegrationController · L343](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L343) |
| `GET /integration/koopfy/external-provider/accounts/:accountId/permissions` | `CrossServiceJwtGuard` | — | [KoopfyIntegrationController · L351](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L351) |
| `GET /integration/koopfy/external-provider/accounts/:accountId/payment-domains` | `CrossServiceJwtGuard` | — | [KoopfyIntegrationController · L358](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L358) |
| `POST /integration/koopfy/external-provider/accounts/:accountId/payment-domains` | `CrossServiceJwtGuard` | `OK` | [KoopfyIntegrationController · L365](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L365) |
| `GET /integration/koopfy/external-provider/wallet` | `CrossServiceJwtGuard` | — | [KoopfyIntegrationController · L374](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L374) |
| `POST /integration/koopfy/external-provider/withdrawals` | `CrossServiceJwtGuard` | — | [KoopfyIntegrationController · L380](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L380) |
| `POST /integration/koopfy/external-provider/disconnect` | `CrossServiceJwtGuard` | — | [KoopfyIntegrationController · L386](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L386) |
| `POST /integration/koopfy/sso` | `CrossServiceJwtGuard` | — | [KoopfyIntegrationController · L393](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L393) |
| `GET /integration/koopfy/balance` | `CrossServiceTokenGuard` | — | [KoopfyIntegrationController · L406](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L406) |
| `GET /integration/koopfy/subscriptions` | `CrossServiceTokenGuard` | — | [KoopfyIntegrationController · L415](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L415) |
| `GET /integration/koopfy/logistics-channel` | `CrossServiceTokenGuard` | — | [KoopfyIntegrationController · L423](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-integration.controller.ts#L423) |
| `GET /integration/koopfy/finance/payment-domains` | `CrossServiceJwtGuard` | — | [KoopfyPaymentDomainsController · L12](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-payment-domains.controller.ts#L12) |
| `POST /integration/koopfy/finance/payment-domains` | `CrossServiceJwtGuard` | `200` | [KoopfyPaymentDomainsController · L17](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/integration/koopfy-payment-domains.controller.ts#L17) |

### CRM e operações · 128

| Operação | Guard/decorador | HTTP explícito | Evidência |
|---|---|---|---|
| `GET /crm/admin/affiliates` | `CrmAuthGuard + Roles` | — | [AffiliateCrmController · L23](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/affiliates/affiliate-crm.controller.ts#L23) |
| `GET /crm/admin/affiliates/:sellerId` | `CrmAuthGuard + Roles` | — | [AffiliateCrmController · L28](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/affiliates/affiliate-crm.controller.ts#L28) |
| `POST /crm/admin/affiliates/:sellerId/cycle` | `CrmAuthGuard + Roles` | — | [AffiliateCrmController · L35](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/affiliates/affiliate-crm.controller.ts#L35) |
| `POST /crm/admin/affiliates/:sellerId/rate` | `CrmAuthGuard + Roles` | — | [AffiliateCrmController · L45](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/affiliates/affiliate-crm.controller.ts#L45) |
| `POST /crm/admin/affiliates/activate-by-email` | `CrmAuthGuard + Roles` | — | [AffiliateCrmController · L52](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/affiliates/affiliate-crm.controller.ts#L52) |
| `POST /crm/admin/affiliates/pending/:affiliateId/status` | `CrmAuthGuard + Roles` | — | [AffiliateCrmController · L59](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/affiliates/affiliate-crm.controller.ts#L59) |
| `POST /crm/admin/affiliates/:sellerId/activate` | `CrmAuthGuard + Roles` | — | [AffiliateCrmController · L66](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/affiliates/affiliate-crm.controller.ts#L66) |
| `POST /crm/admin/affiliates/:sellerId/deactivate` | `CrmAuthGuard + Roles` | — | [AffiliateCrmController · L73](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/affiliates/affiliate-crm.controller.ts#L73) |
| `POST /crm/admin/affiliates/:sellerId/suspend` | `CrmAuthGuard + Roles` | — | [AffiliateCrmController · L83](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/affiliates/affiliate-crm.controller.ts#L83) |
| `GET /crm/activation-requests` | `CrmAuthGuard + Roles` | — | [ActivationRequestsController · L14](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/activation-requests.controller.ts#L14) |
| `POST /crm/activation-requests/:id/decide` | `CrmAuthGuard + Roles` | `OK` | [ActivationRequestsController · L20](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/activation-requests.controller.ts#L20) |
| `GET /crm/admin/overview` | `CrmAuthGuard + Roles` | — | [CrmAdminController · L40](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-admin.controller.ts#L40) |
| `GET /crm/admin/payout-fees` | `CrmAuthGuard + Roles` | — | [CrmAdminController · L45](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-admin.controller.ts#L45) |
| `PATCH /crm/admin/payout-fees/:methodKey` | `CrmAuthGuard + Roles` | — | [CrmAdminController · L50](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-admin.controller.ts#L50) |
| `GET /crm/admin/withdrawals` | `CrmAuthGuard + Roles` | — | [CrmAdminController · L66](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-admin.controller.ts#L66) |
| `GET /crm/admin/withdrawals/:id` | `CrmAuthGuard + Roles` | — | [CrmAdminController · L80](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-admin.controller.ts#L80) |
| `POST /crm/admin/withdrawals/:id/approve` | `CrmAuthGuard + Roles` | — | [CrmAdminController · L85](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-admin.controller.ts#L85) |
| `POST /crm/admin/withdrawals/:id/reject` | `CrmAuthGuard + Roles` | — | [CrmAdminController · L95](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-admin.controller.ts#L95) |
| `POST /crm/admin/withdrawals/:id/retry` | `CrmAuthGuard + Roles` | — | [CrmAdminController · L105](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-admin.controller.ts#L105) |
| `POST /crm/admin/withdrawals/:id/reconcile` | `CrmAuthGuard + Roles` | — | [CrmAdminController · L111](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-admin.controller.ts#L111) |
| `POST /crm/admin/withdrawals/:id/manual-override` | `CrmAuthGuard + Roles` | — | [CrmAdminController · L117](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-admin.controller.ts#L117) |
| `POST /crm/admin/withdrawals/:id/attach-provider-payout` | `CrmAuthGuard + Roles` | — | [CrmAdminController · L127](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-admin.controller.ts#L127) |
| `POST /crm/admin/withdrawals/:id/mark-completed` | `CrmAuthGuard + Roles` | — | [CrmAdminController · L137](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-admin.controller.ts#L137) |
| `GET /crm/admin/withdrawals/:id/payout-methods` | `CrmAuthGuard + Roles` | — | [CrmAdminController · L147](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-admin.controller.ts#L147) |
| `POST /crm/admin/withdrawals/:id/retry-payout` | `CrmAuthGuard + Roles` | — | [CrmAdminController · L154](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-admin.controller.ts#L154) |
| `POST /crm/admin/withdrawals/:id/mark-failed` | `CrmAuthGuard + Roles` | — | [CrmAdminController · L164](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-admin.controller.ts#L164) |
| `GET /crm/admin/balances` | `CrmAuthGuard + Roles` | — | [CrmAdminController · L175](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-admin.controller.ts#L175) |
| `GET /crm/admin/transactions` | `CrmAuthGuard + Roles` | — | [CrmAdminController · L187](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-admin.controller.ts#L187) |
| `POST /crm/admin/transactions/:id/refund` | `CrmAuthGuard + Roles` | — | [CrmAdminController · L204](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-admin.controller.ts#L204) |
| `GET /crm/admin/chargebacks` | `CrmAuthGuard + Roles` | — | [CrmAdminController · L215](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-admin.controller.ts#L215) |
| `POST /crm/admin/chargebacks/:id/accept` | `CrmAuthGuard + Roles` | — | [CrmAdminController · L223](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-admin.controller.ts#L223) |
| `POST /crm/admin/chargebacks/:id/contest` | `CrmAuthGuard + Roles` | — | [CrmAdminController · L233](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-admin.controller.ts#L233) |
| `GET /crm/admin/audit` | `CrmAuthGuard + Roles` | — | [CrmAdminController · L244](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-admin.controller.ts#L244) |
| `GET /crm/checkout/overview` | `CrmAuthGuard + Roles` | — | [CrmCheckoutController · L66](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-checkout.controller.ts#L66) |
| `GET /crm/checkout/sellers` | `CrmAuthGuard + Roles` | — | [CrmCheckoutController · L71](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-checkout.controller.ts#L71) |
| `GET /crm/checkout/sellers/:userId` | `CrmAuthGuard + Roles` | — | [CrmCheckoutController · L81](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-checkout.controller.ts#L81) |
| `GET /crm/checkout/stores` | `CrmAuthGuard + Roles` | — | [CrmCheckoutController · L87](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-checkout.controller.ts#L87) |
| `GET /crm/checkout/stores/:workspaceId` | `CrmAuthGuard + Roles` | — | [CrmCheckoutController · L97](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-checkout.controller.ts#L97) |
| `POST /crm/checkout/stores/:workspaceId/payment-account` | `CrmAuthGuard + Roles` | `OK` | [CrmCheckoutController · L110](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-checkout.controller.ts#L110) |
| `POST /crm/checkout/stores/:workspaceId/tools` | `CrmAuthGuard + Roles` | `OK` | [CrmCheckoutController · L134](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-checkout.controller.ts#L134) |
| `POST /crm/checkout/sellers/:userId/external-provider` | `CrmAuthGuard + Roles` | `OK` | [CrmCheckoutController · L157](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-checkout.controller.ts#L157) |
| `POST /crm/checkout/orders/:orderId/shopify` | `CrmAuthGuard + Roles` | `OK` | [CrmCheckoutController · L180](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-checkout.controller.ts#L180) |
| `GET /crm/clip/accounts` | `CrmAuthGuard + Roles` | — | [CrmClipController · L20](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-clip.controller.ts#L20) |
| `GET /crm/clip/accounts/:id/history` | `CrmAuthGuard + Roles` | — | [CrmClipController · L25](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-clip.controller.ts#L25) |
| `GET /crm/clip/accounts/:id/reservations` | `CrmAuthGuard + Roles` | — | [CrmClipController · L30](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-clip.controller.ts#L30) |
| `POST /crm/clip/accounts` | `CrmAuthGuard + Roles` | — | [CrmClipController · L36](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-clip.controller.ts#L36) |
| `PATCH /crm/clip/accounts/:id` | `CrmAuthGuard + Roles` | — | [CrmClipController · L42](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-clip.controller.ts#L42) |
| `POST /crm/clip/accounts/:id/status` | `CrmAuthGuard + Roles` | `OK` | [CrmClipController · L48](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-clip.controller.ts#L48) |
| `POST /crm/clip/accounts/:id/attach` | `CrmAuthGuard + Roles` | `OK` | [CrmClipController · L59](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-clip.controller.ts#L59) |
| `GET /crm/compliance/queue` | `CrmAuthGuard + Roles` | — | [CrmComplianceController · L44](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-compliance.controller.ts#L44) |
| `GET /crm/compliance/cases` | `CrmAuthGuard + Roles` | — | [CrmComplianceController · L47](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-compliance.controller.ts#L47) |
| `GET /crm/compliance/refunds` | `CrmAuthGuard + Roles` | — | [CrmComplianceController · L52](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-compliance.controller.ts#L52) |
| `POST /crm/compliance/refunds/run` | `CrmAuthGuard + Roles` | `200` | [CrmComplianceController · L55](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-compliance.controller.ts#L55) |
| `POST /crm/compliance/products/:id/review` | `CrmAuthGuard + Roles` | `200` | [CrmComplianceController · L60](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-compliance.controller.ts#L60) |
| `POST /crm/compliance/products/:id/remove` | `CrmAuthGuard + Roles` | `200` | [CrmComplianceController · L67](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-compliance.controller.ts#L67) |
| `POST /crm/compliance/notices` | `CrmAuthGuard + Roles` | `200` | [CrmComplianceController · L75](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-compliance.controller.ts#L75) |
| `POST /crm/compliance/sellers/:workspaceId/terminate` | `CrmAuthGuard + Roles` | `200` | [CrmComplianceController · L82](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-compliance.controller.ts#L82) |
| `GET /crm/method-routing` | `CrmAuthGuard + Roles` | — | [CrmMethodRoutingController · L39](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-method-routing.controller.ts#L39) |
| `GET /crm/method-routing/preview` | `CrmAuthGuard + Roles` | — | [CrmMethodRoutingController · L42](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-method-routing.controller.ts#L42) |
| `POST /crm/method-routing/rules` | `CrmAuthGuard + Roles` | `200` | [CrmMethodRoutingController · L47](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-method-routing.controller.ts#L47) |
| `PUT /crm/method-routing/rules/:id` | `CrmAuthGuard + Roles` | — | [CrmMethodRoutingController · L56](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-method-routing.controller.ts#L56) |
| `DELETE /crm/method-routing/rules/:id` | `CrmAuthGuard + Roles` | — | [CrmMethodRoutingController · L64](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-method-routing.controller.ts#L64) |
| `GET /crm/tickets` | `CrmAuthGuard` | — | [CrmTicketsController · L40](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-tickets.controller.ts#L40) |
| `GET /crm/tickets/:id` | `CrmAuthGuard` | — | [CrmTicketsController · L58](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-tickets.controller.ts#L58) |
| `POST /crm/tickets/:id/messages` | `CrmAuthGuard` | `OK` | [CrmTicketsController · L66](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-tickets.controller.ts#L66) |
| `POST /crm/tickets/:id/status` | `CrmAuthGuard` | `OK` | [CrmTicketsController · L79](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm-tickets.controller.ts#L79) |
| `POST /crm/auth/login` | — | `OK` | [CrmController · L23](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L23) |
| `GET /crm/auth/me` | `CrmAuthGuard` | — | [CrmController · L29](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L29) |
| `GET /crm/dashboard` | `CrmAuthGuard` | — | [CrmController · L36](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L36) |
| `GET /crm/sellers` | `CrmAuthGuard` | — | [CrmController · L43](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L43) |
| `GET /crm/sellers/:id` | `CrmAuthGuard` | — | [CrmController · L64](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L64) |
| `POST /crm/sellers/:id/panel-access` | `CrmAuthGuard` | `OK` | [CrmController · L75](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L75) |
| `POST /crm/sellers/:id/assign` | `CrmAuthGuard` | `OK` | [CrmController · L88](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L88) |
| `POST /crm/sellers/:id/release` | `CrmAuthGuard` | `OK` | [CrmController · L99](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L99) |
| `POST /crm/sellers/:id/transfer` | `CrmAuthGuard + Roles` | `OK` | [CrmController · L110](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L110) |
| `POST /crm/sellers/:id/approve` | `CrmAuthGuard` | `OK` | [CrmController · L124](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L124) |
| `POST /crm/sellers/:id/kontino/retry` | `CrmAuthGuard` | `OK` | [CrmController · L146](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L146) |
| `PATCH /crm/sellers/:id/logistics-group` | `CrmAuthGuard` | — | [CrmController · L157](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L157) |
| `GET /crm/spei/accounts` | `CrmAuthGuard + Roles` | — | [CrmController · L174](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L174) |
| `POST /crm/spei/accounts/:accountId/withdraw` | `CrmAuthGuard + Roles` | `OK` | [CrmController · L190](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L190) |
| `GET /crm/spei/proofs` | `CrmAuthGuard + Roles` | — | [CrmController · L206](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L206) |
| `POST /crm/spei/proofs/:transactionId/decide` | `CrmAuthGuard + Roles` | `OK` | [CrmController · L221](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L221) |
| `GET /crm/orders/risk` | `CrmAuthGuard` | — | [CrmController · L233](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L233) |
| `GET /crm/orders/risk/:orderId` | `CrmAuthGuard` | — | [CrmController · L248](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L248) |
| `POST /crm/orders/risk/:orderId/notify` | `CrmAuthGuard` | `OK` | [CrmController · L255](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L255) |
| `GET /crm/logistics-partners` | `CrmAuthGuard` | — | [CrmController · L267](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L267) |
| `POST /crm/sellers/:id/reject` | `CrmAuthGuard` | `OK` | [CrmController · L273](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L273) |
| `POST /crm/sellers/:id/suspend` | `CrmAuthGuard + Roles` | `OK` | [CrmController · L284](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L284) |
| `POST /crm/sellers/:id/activate` | `CrmAuthGuard + Roles` | `OK` | [CrmController · L296](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L296) |
| `PATCH /crm/sellers/:id/risk` | `CrmAuthGuard` | — | [CrmController · L306](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L306) |
| `GET /crm/fee-defaults` | `CrmAuthGuard` | — | [CrmController · L317](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L317) |
| `PATCH /crm/sellers/:id/fees` | `CrmAuthGuard` | — | [CrmController · L323](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L323) |
| `PATCH /crm/sellers/:id/methods` | `CrmAuthGuard` | — | [CrmController · L334](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L334) |
| `POST /crm/sellers/:sellerId/offers/:offerId/approve` | `CrmAuthGuard` | `OK` | [CrmController · L347](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L347) |
| `POST /crm/sellers/:sellerId/offers/:offerId/reject` | `CrmAuthGuard` | `OK` | [CrmController · L360](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L360) |
| `POST /crm/sellers/:id/notes` | `CrmAuthGuard` | — | [CrmController · L375](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L375) |
| `DELETE /crm/notes/:noteId` | `CrmAuthGuard` | — | [CrmController · L385](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L385) |
| `POST /crm/sellers/:id/contact` | `CrmAuthGuard` | — | [CrmController · L393](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L393) |
| `GET /crm/managers` | `CrmAuthGuard + Roles` | — | [CrmController · L405](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L405) |
| `POST /crm/managers` | `CrmAuthGuard + Roles` | — | [CrmController · L412](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L412) |
| `PATCH /crm/sellers/:id/provider` | `CrmAuthGuard` | — | [CrmController · L419](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L419) |
| `GET /crm/whop-accounts` | `CrmAuthGuard + Roles` | — | [CrmController · L438](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L438) |
| `POST /crm/whop-accounts/provision` | `CrmAuthGuard + Roles` | — | [CrmController · L448](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L448) |
| `POST /crm/whop-accounts` | `CrmAuthGuard + Roles` | — | [CrmController · L466](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L466) |
| `PATCH /crm/whop-accounts/:id` | `CrmAuthGuard + Roles` | — | [CrmController · L497](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L497) |
| `GET /crm/sentinel-mids` | `CrmAuthGuard + Roles` | — | [CrmController · L519](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L519) |
| `POST /crm/sentinel-mids` | `CrmAuthGuard + Roles` | — | [CrmController · L527](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L527) |
| `PATCH /crm/sellers/:id/mid` | `CrmAuthGuard` | — | [CrmController · L546](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/crm.controller.ts#L546) |
| `GET /crm/admin/sellers/:sellerId/routing` | `CrmAuthGuard + Roles` | — | [SellerRoutingCrmController · L21](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/seller-routing.controller.ts#L21) |
| `PUT /crm/admin/sellers/:sellerId/routing` | `CrmAuthGuard + Roles` | — | [SellerRoutingCrmController · L29](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/seller-routing.controller.ts#L29) |
| `GET /crm/admin/sellers/:sellerId/whop-connect` | `CrmAuthGuard + Roles` | — | [WhopConnectController · L17](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/whop-connect.controller.ts#L17) |
| `POST /crm/admin/sellers/:sellerId/whop-connect` | `CrmAuthGuard + Roles` | `OK` | [WhopConnectController · L23](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/whop-connect.controller.ts#L23) |
| `POST /crm/admin/sellers/:sellerId/whop-connect/sync` | `CrmAuthGuard + Roles` | `OK` | [WhopConnectController · L30](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/whop-connect.controller.ts#L30) |
| `GET /crm/admin/sellers/:sellerId/whop-connect/rfi` | `CrmAuthGuard + Roles` | — | [WhopConnectController · L39](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/whop-connect.controller.ts#L39) |
| `POST /crm/admin/sellers/:sellerId/whop-connect/rfi/submissions/:submissionId/approve` | `CrmAuthGuard + Roles` | `OK` | [WhopConnectController · L46](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/whop-connect.controller.ts#L46) |
| `POST /crm/admin/sellers/:sellerId/whop-connect/rfi/submissions/:submissionId/reject` | `CrmAuthGuard + Roles` | `OK` | [WhopConnectController · L53](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/whop-connect.controller.ts#L53) |
| `POST /crm/admin/sellers/:sellerId/whop-connect/rfi/answer` | `CrmAuthGuard + Roles` | `OK` | [WhopConnectController · L65](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/whop-connect.controller.ts#L65) |
| `POST /crm/admin/sellers/:sellerId/whop-connect/charges` | `CrmAuthGuard + Roles` | `OK` | [WhopConnectController · L72](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/whop-connect.controller.ts#L72) |
| `POST /crm/admin/sellers/:sellerId/whop-connect/fallback` | `CrmAuthGuard + Roles` | `OK` | [WhopConnectController · L83](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/whop-connect.controller.ts#L83) |
| `POST /crm/admin/sellers/:sellerId/whop-connect/risk/reset` | `CrmAuthGuard + Roles` | `OK` | [WhopConnectController · L94](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/whop-connect.controller.ts#L94) |
| `POST /crm/admin/sellers/:sellerId/whop-connect/cover` | `CrmAuthGuard + Roles` | `OK` | [WhopConnectController · L101](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/whop-connect.controller.ts#L101) |
| `POST /crm/admin/sellers/:sellerId/whop-connect/release` | `CrmAuthGuard + Roles` | `OK` | [WhopConnectController · L108](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/whop-connect.controller.ts#L108) |
| `GET /crm/admin/whop-rfi-reviews` | `CrmAuthGuard + Roles` | — | [WhopRfiReviewsController · L122](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/whop-connect.controller.ts#L122) |
| `GET /crm/admin/sellers/:sellerId/whop-linked` | `CrmAuthGuard + Roles` | — | [WhopLinkedController · L20](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/whop-linked.controller.ts#L20) |
| `POST /crm/admin/sellers/:sellerId/whop-linked/allow` | `CrmAuthGuard + Roles` | `OK` | [WhopLinkedController · L28](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/whop-linked.controller.ts#L28) |
| `POST /crm/admin/sellers/:sellerId/whop-linked` | `CrmAuthGuard + Roles` | `OK` | [WhopLinkedController · L36](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/whop-linked.controller.ts#L36) |
| `POST /crm/admin/sellers/:sellerId/whop-linked/disconnect` | `CrmAuthGuard + Roles` | `OK` | [WhopLinkedController · L43](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/whop-linked.controller.ts#L43) |
| `POST /crm/admin/sellers/:sellerId/whop-linked/commission` | `CrmAuthGuard + Roles` | `OK` | [WhopLinkedController · L50](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/whop-linked.controller.ts#L50) |

### Serviços internos · 15

| Operação | Guard/decorador | HTTP explícito | Evidência |
|---|---|---|---|
| `POST /internal/affiliates/referral` | — | `OK` | [AffiliatesInternalController · L48](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/affiliates/affiliates-internal.controller.ts#L48) |
| `POST /internal/affiliates/account` | — | `OK` | [AffiliatesInternalController · L81](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/affiliates/affiliates-internal.controller.ts#L81) |
| `POST /internal/compliance/refund` | — | `200` | [ComplianceInternalController · L32](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/crm/compliance-internal.controller.ts#L32) |
| `POST /internal/compliance/subscriptions/cancel` | — | `200` | [ComplianceSubscriptionsController · L21](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/payments/compliance-subscriptions.controller.ts#L21) |
| `POST /internal/routing/link-accounts` | — | `OK` | [LinkAccountsInternalController · L54](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/payments/link-accounts-internal.controller.ts#L54) |
| `POST /internal/routing/link-accounts/disable` | — | `OK` | [LinkAccountsInternalController · L62](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/payments/link-accounts-internal.controller.ts#L62) |
| `POST /internal/routing/link-accounts/connected` | — | `OK` | [LinkAccountsInternalController · L70](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/payments/link-accounts-internal.controller.ts#L70) |
| `POST /internal/routing/link-sales` | — | `OK` | [LinkAccountsInternalController · L78](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/payments/link-accounts-internal.controller.ts#L78) |
| `POST /internal/whop/backfill-card` | — | `200` | [WhopCardBackfillController · L21](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/payments/whop-card-backfill.controller.ts#L21) |
| `POST /internal/seller-billing/setup` | — | `OK` | [SellerBillingInternalController · L37](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/seller-billing/seller-billing-internal.controller.ts#L37) |
| `GET /internal/seller-billing/method/:workspaceId` | — | — | [SellerBillingInternalController · L50](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/seller-billing/seller-billing-internal.controller.ts#L50) |
| `POST /internal/seller-billing/charges` | — | `OK` | [SellerBillingInternalController · L56](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/seller-billing/seller-billing-internal.controller.ts#L56) |
| `GET /internal/seller-billing/charges/:chargeRef` | — | — | [SellerBillingInternalController · L72](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/seller-billing/seller-billing-internal.controller.ts#L72) |
| `GET /internal/sellers/checkout-fee` | — | — | [CheckoutFeeInternalController · L35](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/sellers/checkout-fee-internal.controller.ts#L35) |
| `PUT /internal/sellers/checkout-fee` | — | — | [CheckoutFeeInternalController · L43](https://github.com/GenesisAlpha/xpay-backend/blob/dad3e55f3eda6b42d64712081a5612572fce2712/src/sellers/checkout-fee-internal.controller.ts#L43) |
