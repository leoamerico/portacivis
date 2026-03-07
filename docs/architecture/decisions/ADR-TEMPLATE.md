# ADR-NNN: [Título da Decisão]

<!-- Substitua NNN pelo número sequencial da ADR (ex: 002, 003...) -->
<!-- Substitua o título por uma frase curta que descreva a decisão -->

Status: [Proposto | Aceito | Obsoleto | Rejeitado | Supersedido por ADR-NNN]
Data: AAAA-MM-DD
Decisores: [Nome(s) dos decisores]
Consultados: [Nome(s) consultados, opcional]

---

## Contexto

<!--
Descreva o problema ou situação que motivou esta decisão.
Inclua:
- O estado atual do sistema
- Forças e restrições relevantes (técnicas, de negócio, de compliance)
- Por que esta decisão é necessária agora
-->

[Descreva o contexto aqui]

---

## Decisão

<!--
Descreva a decisão tomada de forma clara e objetiva.
Use a forma: "Decidimos [fazer X] porque [razão principal]."
-->

[Descreva a decisão aqui]

---

## Consequências

### Positivas

<!--
Liste os benefícios esperados da decisão.
-->

- [Benefício 1]
- [Benefício 2]

### Negativas

<!--
Liste os trade-offs, custos ou riscos introduzidos pela decisão.
-->

- [Trade-off 1]
- [Trade-off 2]

### Neutras

<!--
Outros efeitos observáveis que não são necessariamente bons ou ruins.
-->

- [Efeito neutro 1]

---

## Alternativas Consideradas

<!--
Liste as alternativas avaliadas e por que foram descartadas.
Isso é fundamental para rastreabilidade — documente mesmo que brevemente.
-->

### Alternativa 1: [Nome]

[Descrição breve]

- **Razão da rejeição:** [Por que não foi escolhida]

### Alternativa 2: [Nome]

[Descrição breve]

- **Razão da rejeição:** [Por que não foi escolhida]

---

## Referências

<!--
Links relevantes: documentação, RFCs, ADRs relacionadas, issues, PRs.
-->

- [Link 1]
- [Link 2]

---

## Exemplo de preenchimento

> O trecho abaixo é apenas um exemplo. Remova ao criar uma ADR real.

```markdown
# ADR-002: Autenticação via OAuth2 com Gov.br

Status: Proposto
Data: 2026-04-01
Decisores: Leonardo Américo (Arquiteto), Env Neo

## Contexto

PortaCivis precisa autenticar cidadãos com identidade verificada.
A integração com Gov.br (login.gov.br) é obrigatória para serviços
públicos federais conforme e-PING e Decreto nº 10.332/2020.

## Decisão

Adotar OAuth2 com OpenID Connect via provedor Gov.br como único
mecanismo de autenticação para serviços que requerem identificação
do cidadão.

## Consequências

Positivas:
- Identidade verificada pelo governo federal
- Reduz fricção de cadastro para o cidadão

Negativas:
- Dependência de disponibilidade do Gov.br
- Complexidade de integração OAuth2

## Alternativas Consideradas

1. Cadastro próprio com e-mail/senha
   - Rejeitada: não atende ao e-PING nem ao padrão Gov.br
```
