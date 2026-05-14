# Schema del Database - Sau Il Moro

## 1. Prodotti (Products)
| Campo | Tipo | Descrizione |
|-------|------|-------------|
| id | String (UUID) | Identificatore unico |
| name | String | Nome del prodotto (es. "Coltello Pattada") |
| description | Text | Descrizione dettagliata (forgia, materiali) |
| price | Decimal | Prezzo in Euro |
| category | Enum | FERRO, LEGNO, TERRA, CARNE |
| material | Enum | Corno di montone, Resina, Legno, Acciaio |
| blade_type | String | Tipologia di lama (es. "Acciaio damasco") |
| images | Array[String] | URL delle immagini (WebP) |
| stock | Integer | Quantità disponibile |
| is_wow | Boolean | Badge "WOW" attivo |

## 2. Categorie (Categories)
| Campo | Tipo | Descrizione |
|-------|------|-------------|
| id | String | Identificatore (ferro, legno, terra, carne) |
| name | String | Nome visualizzato |
| description | String | Breve descrizione della collezione |
| image_url | String | Immagine di copertina |

## 3. Ordini (Orders)
| Campo | Tipo | Descrizione |
|-------|------|-------------|
| id | String | ID ordine |
| user_id | String | Riferimento all'utente |
| items | JSON | Lista prodotti e quantità |
| total_amount | Decimal | Totale pagato |
| status | Enum | PENDING, PAID, SHIPPED, DELIVERED |
| shipping_address | JSON | Dati di spedizione |
| payment_intent_id | String | ID transazione Stripe/Paypal |

## 4. Utenti (Users)
| Campo | Tipo | Descrizione |
|-------|------|-------------|
| id | String | ID utente |
| email | String | Email (Unique) |
| name | String | Nome completo |
| wishlist | Array[String] | Array di ID prodotti |
