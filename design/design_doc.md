
**Files**
src/data_fetch.py: Main Script, fetches, processes, and inserts card data into Supabase
.env: local environment variables (not committed)
.github/workflows/refresh.yml: GitHub Actions workflow for automated scheduling

**Environment Variables**
VITE_SUPABASE_URL: Supabase project URL for fetching saved custom card data
VITE_SUPABASE_SECRET_KEY: Supabase service role key for full database access
API_KEY: PokemonPriceTracker API key ($10 API Tier)

**Data Fetching**
*Endpoints*
/api/v2/cards: fetch prices and data about individual card singles
/api/v2/sealed-products: Fetch prices and data about sealed products (Booster Boxes, ETBs, etc.)

*Request Structure*
headers = {
    'Authorization': 'Bearer API_KEY',
    'Accept': 'application/json'
}

params = {
    'set': 'Crown Zenith',
    'sortBy': 'price',
    'sortOrder': 'desc',
    'limit': 75
}

*Rate Limiting*
- Requests use a retry system with exponential backoff
- On 429 (rate limited): waits attempt * timer_mult seconds before retrying
- Max 3 retries per request
- Non-retryable errors (4xx, 5xx) return None immediately

**Data Processing**
*Pokemon Data Functions*
fetch_singles(): Individual card singles by era, set, and the # of cards
fetch_promos(): Promotion cards not available by usual packs. Individual card singles by era and # of cards
fetch_etbs(etb_params, set_num=0): Individual Elite Trainer Boxes and Pokemon Center Elite Trainer Boxes (filtering out key words like "Cases" and "Set of 2") 
fetch_sealed(sealed_params, set_num=0, keywords=[]): General fetch function based on type of sealed product and filtering out certain custom keywords

Design choice: ETB's are different from other sealed products because there is also a type of ETB called a Pokemon Center ETB, which I wanted to separate from normal ETBs. This resulted in having to create two separate functions for fetching sealed products.

*Row Structure*
Each card is stored as a row with these fields:
{
    'id': card['tcgPlayerId'], // unique id given by TCGPlayer API
    "name": card['name'], // card name
    'price': card['prices']['market'], // current market price
    'set': set_name, // set name
    'set_num': set_num, // set number based on order of release date, used specifically in Cardle
    'image': card['imageCdnUrl400'], // card image URL
    'era': era, // era name (i.e. "Sword & Shield")
    'era_num': era_num, // era number based on release year, used for sorting and filtering
    'rarity': card['rarity'], // card rarity
    'artist': card['artist'], // card illustrator
    'type': card['pokemonType'], // energy type
    'cardNumber': card['cardNumber'].split("/")[0], // card number in set
}

*Null Handling*
- Cards with None market price are skipped
- Artist field can be null - handled with card.get('artist')
- All nested fields accessed with .get() to prevent KeyErrors

**Database Reset Strategy**
On every run of data_fetch.py,
1. Deletes all existing rows: DELETE WHERE id != 0
2. Inserts all fresh rows in one batch

This ensures stale data is never shown to users. The id field comes directly from the TCGPlayer API, so there are no auto-increment sequence conflicts.

**Scheduling**
# .github/workflows/refresh.yml
on:
  schedule:
    - cron: '0 */8 * * *'  # every 8 hours
  workflow_dispatch:        # manual trigger available

GitHub Actions runs the script on Ubuntu, installs dependencies, and passes secrets as environment variables. The script never has access to hardcoded credentials.

**Error Handling**
- HTTP errors print the status code and set name then skip that set
- Rate limits errors retry with increasing wait times
- Supabase errors raise exceptions and print the full error message
- Each fetch function is independent, meaning if one set fails the others aren't stopped