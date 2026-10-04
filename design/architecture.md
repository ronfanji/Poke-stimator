```mermaid
graph TD

    [TCGPlayer/PokemonPriceTracker API] --> [data_fetch.py]
    [data_fetch.py] --> [Data Cleaning & Normalization]
    [Data Cleaning & Normalization] --> [Supabase Postgre SQL]
    [Supabase PostgreSQL] --> [React Frontend]

```