
**Resources**
API: https://www.pokemonpricetracker.com/
Frontend: React JS
Backend: Supabase Postgre SQL backend holding all data points with a Python script that fetches from the API
         Github Actions runs this Python script every 12 hours.

**Coding Logic**
I fetch card data into my database. React JS then fetches data from this database whenever a game is played, card prices are requested, etc. 

**Game Logic**
*UpperLower:* I fetch for all of the products in my database and put it into an array. To select what two products I compare, I use Math.random() in JavaScript. The player selects a difficulty: Easy, Medium, or Hard. Difficulty changes the game slightly. For an UpperLower comparison to be harder, the price difference between two products would be closer. For example, it is harder to decide between a $100 card and $101 card compared to $100 card and $400 card. Another idea to note is that if I do a baseline price difference like $5, the difficulty between comparing two cheap cards and two expensive cards is evident. Thus, instead, I use an upper and lower threshold of price.

*Estimate:* Simlar to UpperLower, I fetch all products in the database
*Cardle:* I save every unique attribute of each card into the database as well, as this does not take up more tokens in my API. 


In order to implement and run this yourself, simply pull this repository. Then, create a database on Supabase.
Then use the file called "env_format" as a format for how to structure your .env file. 

VITE_SUPABASE_URL should be the url to the database you created.
VITE_SUPABASE_PUBLIC_KEY is the publishable key.
VITE_SUPABASE_SECRET_KEY is the secret key.
API_KEY is the key to PokemonPriceTracker. Ensure that you are using at least the $10 API tier, as there are API Rate Limits.