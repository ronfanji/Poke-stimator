from supabase import create_client
from dotenv import load_dotenv
import requests
import time
import os

load_dotenv()

SUPABASE_URL = os.environ.get("VITE_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("VITE_SUPABASE_SECRET_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

api_key = os.getenv("API_KEY")
singles_url = "https://www.pokemonpricetracker.com/api/v2/cards"
sealed_url = "https://www.pokemonpricetracker.com/api/v2/sealed-products"

auth_string = "Bearer " + api_key.strip()

headers = {
            'Authorization': auth_string,
            'Accept' : 'application/json'
           }


# GLOBAL VARIABLE
all_rows = []


def make_request(url, headers, params, retries=4):

    # multiplies the timer
    # 4s, 8s, 12s, 16s
    timer = 30

    for attempt in range(retries):
        response = requests.get(url, headers=headers, params=params)
        
        if response.status_code == 200:
            return response
        elif response.status_code == 429:  # rate limited
            wait = timer
            print(f"Rate limited, waiting {wait}s before retry...")
            time.sleep(wait)
        else:
            if url == singles_url:
                print(f"Error {response.status_code} for {params['set']}")
            elif url == sealed_url:
                print(f"Error {response.status_code} for {params['search']}")
            return None
    
    if url == singles_url:
        print(f"Failed after {retries} retries for {params['set']}")
    elif url == sealed_url:
        print(f"Failed after {retries} retries for {params['search']}")
    return None

def fetch_singles(set_params, era, era_num, set_num=-1, keywords=[], set_name = None):
    time.sleep(0.5)

    if(set_name == None):
        set_name = set_params['set']

    response = make_request(singles_url, headers, set_params)
    if response is None:
        return

    data = response.json().get("data", [])
    for card in data:

        has_keyword = False
        for keyword in keywords:
            if keyword in card["name"]:
                has_keyword = True
                break
        
        if has_keyword: 
            continue
        all_rows.append({
            'id': card['tcgPlayerId'],
            "name": card['name'],
            'price': card['prices']['market'],
            'set': set_name,
            'set_num': set_num,
            'image': card['imageCdnUrl400'],
            'era': era,
            'era_num': era_num,
            'rarity': card['rarity'],
            'artist': card['artist'],
            'type': card['pokemonType'],
            'cardNumber': card['cardNumber'].split("/")[0]
        })

def fetch_etbs(etb_params, set_num=0):
    time.sleep(0.5)
    response = make_request(sealed_url, headers, etb_params)
    if response is None:
        return

    data = response.json().get("data", [])
    for etb in data:
        if "Case" in etb["name"] or "Set of 2" in etb["name"]:
            continue
        if "Pokemon Center" in etb["name"]:
            all_rows.append({
                'id': etb['tcgPlayerId'],
                "name": etb["name"],
                'price': etb["unopenedPrice"],
                'set': "PC ETB",
                'set_num': set_num,
                'image': etb['imageCdnUrl400'],
                'era': 'Sealed',
                'era_num': 100
            }) 
        else:
            all_rows.append({
                'id': etb['tcgPlayerId'],
                "name": etb["name"],
                'price': etb["unopenedPrice"],
                'set': "ETB",
                'set_num': set_num,
                'image': etb['imageCdnUrl400'],
                'era': 'Sealed',
                'era_num': 100
            }) 

def fetch_sealed(sealed_params, set_num=0, keywords=[]):
    time.sleep(0.5)
    response = make_request(sealed_url, headers, sealed_params)
    if response is None:
        return

    data = response.json().get("data", [])

    for sealed in data:

        has_keyword = False
        for keyword in keywords:
            if keyword in sealed["name"]:
                has_keyword = True
                break
        if has_keyword:
            continue

        all_rows.append({
            'id': sealed['tcgPlayerId'],
            "name": sealed["name"],
            'price': sealed["unopenedPrice"],
            'set': sealed_params["search"],
            'set_num': set_num,
            'image': sealed['imageCdnUrl400'],
            'era': 'Sealed',
            'era_num': 100
        })    
    
def set_table():
    supabase.table("card_prices").delete().neq("id", 0).execute()
    supabase.table("card_prices").insert(all_rows).execute()
    print(f"Inserted {len(all_rows)} rows successfully")


def fetch_and_reset():

    # ---------------------------------------  BLACK & WHITE   ---------------------------------------

    blackwhitebase_set_params = {
        "set": "Black and White",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 3
    }


    legendarytreasures_set_params = {
            "set": "Legendary Treasures",
            "sortBy": "price",
            "sortOrder": "desc",
            "limit": 10
        }

    legendarytreasuresRC_set_params = {
            "set": "Legendary Treasures: Radiant Collection",
            "sortBy": "price",
            "sortOrder": "desc",
            "limit": 18
        }

    fetch_singles(blackwhitebase_set_params, "Black & White", era_num=1, set_num=0, keywords=[], set_name="Black & White")


    fetch_singles(legendarytreasures_set_params, "Black & White", era_num=1, set_num=11, keywords=[], set_name="Legendary Treasures")
    fetch_singles(legendarytreasuresRC_set_params, "Black & White", era_num=1, set_num=11, keywords=[], set_name="Legendary Treasures")

    # ---------------------------------------      X & Y       ---------------------------------------
    
    time.sleep(5)

    xybase_set_params = {
        "set": "XY Base Set",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 16
    }


    flashfire_set_params = {
        "set": "Flashfire",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 15
    }  
    furiousfists_set_params = {
        "set": "Furious Fists",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 14
    }   

    doublecrisis_set_params = {
        "set": "Double Crisis",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 2
    }   

    primalclash_set_params = {
        "set": "Primal Clash",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 23
    }   

    phantomforces_set_params = {
        "set": "Phantom Forces",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 10
    }   

    roaringskies_set_params = {
        "set": "Roaring Skies",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 15
    }   

    xyevolutions_set_params = {
        "set": "XY - Evolutions",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 24
    }

    time.sleep(5)
    fetch_singles(xybase_set_params, "X & Y", era_num=2, set_num=0, keywords=["Code Card"], set_name="X & Y")
    fetch_singles(flashfire_set_params, "X & Y", era_num=2, set_num=1)
    fetch_singles(furiousfists_set_params, "X & Y", era_num=2, set_num=2) 
    fetch_singles(phantomforces_set_params, "X & Y", era_num=2, set_num=3)
    fetch_singles(primalclash_set_params, "X & Y", era_num=2, set_num=4)

    time.sleep(5)
    fetch_singles(doublecrisis_set_params, "X & Y", era_num=2, set_num=5)
    fetch_singles(roaringskies_set_params, "X & Y", era_num=2, set_num=6)

    fetch_singles(xyevolutions_set_params, "X & Y", era_num=2, set_num=13, keywords=["Code Card"], set_name="XY Evolutions")

    # ---------------------------------------    SUN & MOON    ---------------------------------------

    sunmoonbase_set_params = {
        "set": "SM Base Set",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 20
    }

    teamup_set_params = {
        "set": "Team Up",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 40
    }

    unbrokenbonds_set_params = {
        "set": "Unbroken Bonds",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 36
    }


    unifiedminds_set_params = {
        "set": "Unified Minds",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 39
    }

    hiddenfates_set_params = {
        "set": "Hidden Fates",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 5
    }

    hiddenfatesvault_set_params = {
        "set": "Hidden Fates: Shiny Vault",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 50
    }

    cosmiceclipse_set_params = {
        "set": "Cosmic Eclipse",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 60
    }

    
    time.sleep(5)
    fetch_singles(sunmoonbase_set_params, "Sun & Moon", era_num=3, set_num=0, set_name="Sun & Moon")


    fetch_singles(teamup_set_params, "Sun & Moon", era_num=3, set_num=10)
    
    fetch_singles(unbrokenbonds_set_params, "Sun & Moon", era_num=3, set_num=12)
    fetch_singles(unifiedminds_set_params, "Sun & Moon", era_num=3, set_num=13)

    time.sleep(5)
    fetch_singles(hiddenfates_set_params, "Sun & Moon", era_num=3, set_num=14, set_name="Hidden Fates")
    fetch_singles(hiddenfatesvault_set_params, "Sun & Moon", era_num=3, set_num=14, set_name="Hidden Fates")
    fetch_singles(cosmiceclipse_set_params, "Sun & Moon", era_num=3, set_num=15)

    # --------------------------------------- SWORD AND SHIELD ---------------------------------------

    swordshieldbase_set_params = {
        "set": "SWSH01: Sword & Shield Base Set",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 19
    }

    championspath_set_params = {
        "set": "Champion's Path",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 3    
    }

    shiningfates_set_params = {
        "set": "Shining Fates",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 5
    }

    shiningfatesvault_set_params = {
        "set": "Shining Fates: Shiny Vault",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 10
    }


    astralradiance_set_params = {
        "set": "Astral Radiance",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 35
    }


    battlestyles_set_params = {
        "set": "Battle Styles",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 15
    }

    brilliantstars_set_params = {
        "set": "Brilliant Stars",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 36          
    }

    chillingreign_set_params = {
        "set": "Chilling Reign",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 37          
    }

    fusionstrike_set_params = {
        "set": "Fusion Strike",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 20        
    }

    silvertempest_set_params = {
        "set": "Silver Tempest",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 35         
    }

    evolvingskies_set_params = {
        "set": "Evolving Skies",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 40         
    }

    lostorigin_set_params = {
        "set": "Lost Origin",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 32 
    }

    cz_set_params = {
        "set": "Crown Zenith",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 75            
    }

    vividvoltage_set_params = {
        "set": "Vivid Voltage",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 15            
    }

    time.sleep(10)
    fetch_singles(swordshieldbase_set_params, "Sword & Shield", era_num=4, set_num=0, set_name="Sword & Shield")

    fetch_singles(championspath_set_params, "Sword & Shield", era_num=4, set_num=3)
    fetch_singles(vividvoltage_set_params, "Sword & Shield", era_num=4, set_num=4)
    fetch_singles(shiningfates_set_params, "Sword & Shield", era_num=4, set_num=5, set_name="Shining Fates")
    fetch_singles(shiningfatesvault_set_params, "Sword & Shield", era_num=4, set_num=5, set_name="Shining Fates")
    
    time.sleep(10)

    fetch_singles(battlestyles_set_params, "Sword & Shield", era_num=4, set_num=6)
    fetch_singles(chillingreign_set_params, "Sword & Shield", era_num=4, set_num=7)
    fetch_singles(evolvingskies_set_params, "Sword & Shield", era_num=4, set_num=8)
    fetch_singles(fusionstrike_set_params, "Sword & Shield", era_num=4, set_num=9)
    fetch_singles(brilliantstars_set_params, "Sword & Shield", era_num=4, set_num=10)
    fetch_singles(astralradiance_set_params, "Sword & Shield", era_num=4, set_num=11)

    time.sleep(10)
    fetch_singles(lostorigin_set_params, "Sword & Shield", era_num=4, set_num=13)
    fetch_singles(silvertempest_set_params, "Sword & Shield", era_num=4, set_num=14)
    fetch_singles(cz_set_params, "Sword & Shield", era_num=4, set_num=15, keywords=["Energy"])

    # SCARLET & VIOLET

    surgingsparks_set_params = {
        "set": "Surging Sparks",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 33           
    }

    SV151_set_params = {
        "set": "Scarlet & Violet 151",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 40              
    }

    paldeanfates_set_params = {
        "set": "Paldean Fates",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 61           
    }

    prismatic_set_params = {
        "set": "Prismatic Evolutions",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 43            
    }

    destinedrivals_set_params = {
        "set": "Destined Rivals",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 54         
    }

    journeytogether_set_params = {
        "set": "Journey Together",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 26         
    }

    blackbolt_set_params = {
        "set": "Black Bolt",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 80           
    }

    whiteflare_set_params = {
        "set": "White Flare",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 80         
    }

    scarletvioletbase_set_params = {
        "set": "SV01: Scarlet & Violet Base Set",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 27
    }

    time.sleep(10)
    fetch_singles(scarletvioletbase_set_params, "Scarlet & Violet", era_num=5, set_num=0, set_name="Scarlet & Violet")


    fetch_singles(SV151_set_params, "Scarlet & Violet", 5, 3, ["Metal"])

    fetch_singles(paldeanfates_set_params, "Scarlet & Violet", 5, 5)



    time.sleep(10)    
    fetch_singles(surgingsparks_set_params, "Scarlet & Violet", 5, 10)
    fetch_singles(prismatic_set_params, "Scarlet & Violet", 5, 11)
    fetch_singles(journeytogether_set_params, "Scarlet & Violet", 5, 12)

    time.sleep(10)
    fetch_singles(destinedrivals_set_params, "Scarlet & Violet", 5, 13, ["Code Card"])
    fetch_singles(blackbolt_set_params, "Scarlet & Violet", 5, 14, ["Master Ball Pattern"])
    fetch_singles(whiteflare_set_params, "Scarlet & Violet", 5, 15, ["Master Ball Pattern"])

    # MEGA EVOLUTIONS

    megaevolution_set_params = {
        "set": "ME01: Mega Evolution",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 25,
    }

    phantasmalflames_set_params = {
        "set": "Phantasmal Flames",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 14           
    }

    ascendedheroes_set_params = {
        "set": "Ascended Heroes",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 40              
    }

    perfectorder_set_params = {
        "set": "Perfect Order",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 18        
    }

    time.sleep(10)
    fetch_singles(megaevolution_set_params, "Mega Evolution", 6, 0, set_name="Mega Evolution")
    fetch_singles(phantasmalflames_set_params, "Mega Evolution", 6, 1)
    fetch_singles(ascendedheroes_set_params, "Mega Evolution", 6, 2)
    fetch_singles(perfectorder_set_params, "Mega Evolution", 6, 3)

    # PROMOS

    blackwhitepromo_set_params = {
        "set": "Black and White Promo",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 77
    }

    xypromo_set_params = {
        "set": "XY promo",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 100,
    }

    sunmoonpromo_set_params = {
        "set": "SM Promo",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 80,
    }

    swordshieldpromo_set_params = {
        "set": "Sword & Shield Promo",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 73,
    }
    scarletvioletpromo_set_params = {
        "set": "Scarlet & Violet Promo",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 100,
    }

    megaevolutionpromo_set_params = {
        "set": "Mega Evolution Promo",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 67
    }



    time.sleep(10)
    fetch_singles(blackwhitepromo_set_params, "Black & White", era_num=1, set_num=100, keywords=["Staff", "Worlds", "Prerelease", "Battle Road"])
    fetch_singles(xypromo_set_params, "X & Y", 2, 100, ["Prerelease", "World Championship", "Staff", "Champions Festival"])
    fetch_singles(sunmoonpromo_set_params, "Sun & Moon", 3, 100, ["Prerelease", "World Championship", "Staff"])
    fetch_singles(swordshieldpromo_set_params, "Sword & Shield", 4, 100, ["Prerelease", "World Championships", "Staff"])
    fetch_singles(scarletvioletpromo_set_params, "Scarlet & Violet", 5, 100, ["Prerelease", "World Championship", "Staff"])
    fetch_singles(megaevolutionpromo_set_params, "Mega Evolution", era_num=6, set_num=100, keywords=["Staff", "Celebratory Fanfare"])

    # SEALED

    # offset at 9 to skip cases of etbs
    
    etb_set_params1 = {
        "search": "Elite Trainer Box",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 40,
        "offset": 30
    }  

    etb_set_params21 = {
        "search": "Elite Trainer Box",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 20,
        "offset": 70
    }  

    etb_set_params22 = {
        "search": "Elite Trainer Box",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 10,
        "offset": 90
    }  

    etb_set_params23 = {
        "search": "Elite Trainer Box",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 10,
        "offset": 100
    } 

    etb_set_params3 = {
        "search": "Elite Trainer Box",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 40,
        "offset": 110
    } 
    etb_set_params4 = {
        "search": "Elite Trainer Box",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 40,
        "offset": 150
    } 
    etb_set_params5 = {
        "search": "Elite Trainer Box",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 45,
        "offset": 190
    } 

    boosterbox_set_params = {
        "search": "Booster Box",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 85
    }   

    premiumcollection_set_params = {
        "search": "Premium Collection",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 90
    }

    boosterbundle_set_params = {
        "search": "Booster Bundle",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 64
    }



    time.sleep(10)
    fetch_etbs(etb_set_params1)
    fetch_etbs(etb_set_params21)

    time.sleep(10)
    fetch_etbs(etb_set_params22)
    fetch_etbs(etb_set_params23)
    
    time.sleep(5)
    fetch_etbs(etb_set_params3)
    fetch_etbs(etb_set_params4)

    time.sleep(5)
    fetch_etbs(etb_set_params5)
    fetch_sealed(boosterbox_set_params, keywords=["Case", "Half"])
    
    time.sleep(5)
    fetch_sealed(premiumcollection_set_params, keywords=["Case", "Set of", "Mew", "Tournament"])
    fetch_sealed(boosterbundle_set_params, keywords=["Case", "Trick or Trade"])


    # calls the function that resets and sets the table
    set_table()
    

fetch_and_reset()

'''
roaringskies_set_params = {
    "set": "Roaring Skies",
    "sortBy": "price",
    "sortOrder": "desc",
    "limit": 15
}   

fetch_singles(roaringskies_set_params, "X & Y", era_num=2, set_num=1)


for row in all_rows:
    print(row['name'], row['price'])

cz_set_params = {
        "set": "Crown Zenith",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 20            
    }

ascendedheroes_set_params = {
        "set": "Ascended Heroes",
        "sortBy": "price",
        "sortOrder": "desc",
        "limit": 20              
    }

fetch_singles(cz_set_params, "Mega Evolution", era_num=2, set_num=0, keywords=["Staff", "Celebratory Fanfare"], set_name="Mega Evolution Promo")
fetch_singles(ascendedheroes_set_params, "Mega Evolution", era_num=2, set_num=0, keywords=["Staff", "Celebratory Fanfare"], set_name="Mega Evolution Promo")

for row in all_rows:
    print(row['name'], row['rarity'], row['artist'], row['type'], row['cardNumber'])

'''