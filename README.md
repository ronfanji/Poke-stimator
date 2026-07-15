
**Resources**
API: https://www.pokemonpricetracker.com/
Frontend: React JS
Backend: Supabase Postgre SQL backend holding all data points with a Python script that fetches from the API
         Github Actions runs this Python script every 12 hours.

**Logic**
I fetch card data into my database. React JS then fetches data from this database whenever a game is played, card prices are requested, etc. 
