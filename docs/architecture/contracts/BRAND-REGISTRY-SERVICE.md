# Brand Registry Service (envneo-core)

Endpoint:

`GET /api/brand/{brand_id}`

Example:

`GET /api/brand/PORTACIVIS`

Expected response:

```json
{
  "brand_id": "PORTACIVIS",
  "name": "PortaCivis",
  "slogan": "Informação pública para todos os cidadãos",
  "colors": {
    "primary": "#1E5AA8",
    "secondary": "#2F7DD1",
    "citizen": "#F39C12"
  },
  "assets": {
    "logo": "/brand/portacivis/svg/logo-horizontal.svg",
    "mark": "/brand/portacivis/svg/logo-mark.svg"
  }
}
```
