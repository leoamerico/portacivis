# PORTACIVIS-BRAND-GUIDE

## 1. Conceito da marca
PortaCivis representa uma porta institucional aberta para o cidadão, com foco em informação pública, acolhimento e transparência.

## 2. Significado do símbolo
O símbolo oficial une porta aberta e cidadão em movimento de entrada, materializando acesso à informação pública e exercício da cidadania.

## 3. Paleta oficial
- Primária: `#1E5AA8`
- Secundária: `#2F7DD1`
- Cidadão: `#F39C12`
- Neutra: `#4A4A4A`
- Fundo: `#FFFFFF`

## 4. Tipografia
- Principal: Montserrat
- Fallback: system-ui, Arial, sans-serif

## 5. Usos permitidos
- Header institucional: variante horizontal
- Favicon/app icon: variante mark
- Documentos oficiais: mono_black
- Redes sociais: mark
- Contextos de alto contraste: mono_black/mono_white

## 6. Usos proibidos
- Alterar proporção do símbolo
- Rotacionar ou distorcer o logotipo
- Trocar cores fora do catálogo
- Aplicar efeitos visuais não aprovados
- Utilizar variações não catalogadas

## 7. Grid e proporção
- Base de construção em grid modular 8px
- Área de respiro mínima: 1x altura do símbolo ao redor da marca
- Escala proporcional fixa entre símbolo e wordmark em todas as variantes

## 8. Aplicação digital e institucional
- Frontend deve consumir tokens de `tokens/brand/colors.json`
- Cores de marca hardcoded em componentes são proibidas
- Distribuição de ativos deve seguir o catálogo em `governance/catalog/`
- Contrato de distribuição via envneo-core: `GET /api/brand/{brand_id}`
