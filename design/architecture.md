```mermaid
graph TD

    TCGPlayer/PokemonPriceTracker API --> data_fetch.py(Python)
    data_fetch.py(Python) --> Data Cleaning & Normalization
    Data Cleaning & Normalization --> Supabase Postgre SQL
    Supabase PostgreSQL --> React Frontend

```