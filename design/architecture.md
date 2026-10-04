```mermaid
graph TD

    TCGPlayer/PokemonPriceTracker API --> data_fetch script
    data_fetch script --> Data Cleaning & Normalization
    Data Cleaning & Normalization --> Supabase Postgre SQL
    Supabase PostgreSQL --> React Frontend

```