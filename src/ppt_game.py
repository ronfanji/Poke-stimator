
import json
import random

# can run it multiple times because i am checking cache for recency
entire_dict = {}
#print(entire_dict)

all_dict = {}

# deadass use binary search to find a value within a set that is within range (5% ish?)
for era in entire_dict:
    print(era, "\n")
    for set in entire_dict[era]:
        print(set)
        set_prices = entire_dict[era][set]
        for card in set_prices:
            cardset = card 
            if era != "Sealed":
                cardset = card + " from " + set
            all_dict[cardset] = set_prices[card]

    print("\n\n")


desc_dict = {k: v for k, v in sorted(all_dict.items(), key=lambda item: item[1])}

# sort all prices ascending, used for binary search
# because python has ordered dicts, they preserve order when calling these methods
# basically have a one-for-one indexing methodology for finding cards to prices through indexing
product_sorted = list(desc_dict.keys())
prices_sorted = list(desc_dict.values())
size = len(product_sorted)

# difficulties for upper lower game
easy_difficulty = 0.25
medium_difficulty = 0.15
hard_difficulty = 0.10

# threshold for minimum dollar difference
easy_threshold = 1.25
medium_threshold = 0.8
hard_threshold = 0.25 

# add like lower limit of how much differs (some differ by like 2 cents, so make a threshold)

# 
num_problems = 5

# Weights for finding card differences
easy_weights = [0, 0, 1]
#easy_weights = [0.8, 0.2, 0]
medium_weights = [0.6, 0.3, 0.1]
hard_weights = [0.475, 0.375, 0.15]



def upper_lower(num_problems):
    diff_input = input("What difficulty would you like to play? (E/M/H): ")
    while diff_input != "E" and diff_input != "M" and diff_input != "H":
        diff_input = input("Try Again! What difficulty would you like to play? (E/M/H): ")
        
    if diff_input == "E":
        curr_difficulty = easy_difficulty
        curr_threshold = easy_threshold
        weights = easy_weights
    elif diff_input == "M":
        curr_difficulty = medium_difficulty
        curr_threshold = medium_threshold
        weights = medium_weights
    else:
        curr_difficulty = hard_difficulty
        curr_threshold = hard_threshold
        weights = hard_weights

    problems = 0
        
    while problems < num_problems:
        base_index = random.randint(0, size-1)
        base_product = product_sorted[base_index]
        base_price = prices_sorted[base_index]

        # random float 0-1
        weight = random.random()
        pick_set = []

        # Only choosing one thing
        if weight < weights[0]:

            # create a set of indices of product that is sufficient, then choose a random indice to be the compared product
            tempIdx = base_index-1
            while(tempIdx >= 0 and base_price - prices_sorted[tempIdx] <= curr_difficulty * base_price 
                and base_price - prices_sorted[tempIdx] >= curr_threshold):
                pick_set.append(tempIdx)
                tempIdx-=1
            
            tempIdx = base_index + 1
            while(tempIdx < size and prices_sorted[tempIdx] - base_price <= curr_difficulty * base_price 
                and base_price - prices_sorted[tempIdx] >= curr_threshold):
                pick_set.append(tempIdx)
                tempIdx+=1

            # if the set to pick a second value is empty, skip this base value
            if(len(pick_set) == 0):
                continue

            # with a random index from the index set, now compare
            second_index = random.choice(pick_set)
            second_product = product_sorted[second_index]
            second_price = prices_sorted[second_index] 

        # Choosing two things and summing them up (use tuples of indices)
        elif weight < weights[1]:

            # iterate through values less than base_index
            for first_ind in range(0, base_index):
                # iterate through values less than base_index including first_ind
                # iterating to first_ind prevents duplicate tuples
                for second_ind in range(base_index-1, first_ind-1, -1):
                    price_sum = prices_sorted[first_ind] + prices_sorted[second_ind]
                    
                    if (abs(price_sum - base_price) <= curr_difficulty * base_price 
                        and abs(price_sum-base_price) >= curr_threshold):
                        pick_set.append((first_ind, second_ind))

            # if the set to pick a second value is empty, skip this base value
            if(len(pick_set) == 0):
                continue
                
            second_index = random.choice(pick_set)
            second_product = product_sorted[second_index[0]] + " and " + product_sorted[second_index[1]]
            second_price = prices_sorted[second_index[0]] + prices_sorted[second_index[1]]
            
        # Choosing three things and summing them up
        else:
            # double for loop
            for first_ind in range(0, base_index):
                for second_ind in range(first_ind, base_index):
                    # will be starting the third_ind at second_ind, so if first is already is greater, no point in checking
                    if(prices_sorted[first_ind] + prices_sorted[second_ind] + prices_sorted[second_ind] > base_price):
                        break
                        
                    # using binary search to find lower and upper bounds of the pickset
                    left = second_ind
                    right = base_index-1
                    lower_target = (1-curr_difficulty) * base_price
                    while left < right:
                        mid = int((left + right) / 2)

                        sum = prices_sorted[first_ind] + prices_sorted[second_ind] + prices_sorted[mid]
                        if(sum < lower_target):
                            left = mid + 1
                        else:
                            right = mid

                    lower_ind = left
                                                
                    upper_target = (1+curr_difficulty) * base_price
                    left = second_ind 
                    right = base_index - 1
                    while left < right:
                        mid = int((left + right) / 2)

                        sum = prices_sorted[first_ind] + prices_sorted[second_ind] + prices_sorted[mid]
                        if(sum < upper_target):
                            left = mid + 1
                        else:
                            right = mid
                    upper_ind = left
                        
                    # once found range, iterate through the bounds
                    # much more efficient than simply iterating through everything
                    for ind in range(lower_ind, upper_ind+1):
                        pick_set.append((first_ind, second_ind, ind))

            # if the set to pick a second value is empty, skip this base value
            if(len(pick_set) == 0):
                continue
                
            second_index = random.choice(pick_set)
            second_product = product_sorted[second_index[0]] + ", " + product_sorted[second_index[1]] + ", " + product_sorted[second_index[2]]
            second_price = prices_sorted[second_index[0]] + prices_sorted[second_index[1]] + prices_sorted[second_index[2]]


        player_answer = input(f"Which is more expensive (1 or 2):\n {base_product} (1)\n {second_product} (2): ")
        while "1" not in player_answer and "2" not in player_answer:
            player_answer = input(f"Try Again! Which is more expensive (1 or 2):\n {base_product} (1)\n {second_product} (2): ")

        if "1" in player_answer:
            if(base_price >= second_price):
                print("Correct!")
            else:
                print("WRONG")
        else:
            if(base_price <= second_price):
                print("Correct!")
            else:
                print("WRONG")

        print("BASE PRODUCT: ", base_product, base_price)
        print("SECOND PRODUCT: ", second_product, second_price)

        if(type(second_index) is tuple):
            for i in second_index:
                print("Individual Product:", product_sorted[i], "  Price:", prices_sorted[i])
            
        problems += 1

def estimate(num_problems):
    print("Low: $10-100")
    print("Medium: $100-500")
    print("High: $500-1500")
    print("Super High: >$1000")
    diff_input = input("What range would you like to play: (L/M/H/S): ")
    while diff_input != "L" and diff_input != "M" and diff_input != "H" and diff_input != "S":
        diff_input = input("Try Again! What range would you like to play: (L/M/H/S): ")
    
    if diff_input == "L":
        weights = easy_weights
        percent = 80
        low_target = 10
        high_target = 100
    elif diff_input == "M":
        weights = medium_weights
        percent = 85
        low_target = 100
        high_target = 500
    elif diff_input == "H": 
        weights = hard_weights
        percent = 90
        low_target = 500
        high_target = 1500

    elif diff_input == "S": 
        weights = hard_weights
        percent = 92
        low_target = 1500
        high_target = 100000

    # if answer is within this threshold, give 100%
    correctness_threshold = 0.05

    # do like
    # 80% on < $100
    # 85% on < $500
    # 90% on rest
    # and only use cards > $10
    

    final_score = 0

    problems = 0

    while problems < num_problems:
        
        left = 0
        right = size - 1

        while(left < right):
            mid = int((left + right) / 2)

            if prices_sorted[mid] < low_target:
                left = mid + 1
            else:
                right = mid 
        
        low_index = left-1

        left = 0
        right = size - 1

        while(left < right):
            mid = int((left + right) / 2)

            if prices_sorted[mid] < high_target:
                left = mid + 1
            else:
                right = mid 
        
        high_index = left-1

        base_index = random.randint(low_index, high_index)
        base_product = product_sorted[base_index]
        base_price = prices_sorted[base_index]

        
        correct_price = round(percent/100 * base_price, 2)

        # continue berating user until they give a proper float value
        estimate_ans = input(f"What is {percent}% of a {base_product}?: ")
        partition = estimate_ans.partition(".")
        while(not(partition[0].isdigit()
            or partition[0].isdigit() and partition[1] == "." and partition[2].isdigit() 
            or partition[0] == '' and partition[1] == "." and partition[2].isdigit() 
            or partition[0].isdigit() and partition[1] == "." and partition[2] =='')):
            estimate_ans = input(f"Try again! What is {percent}% of a {base_product}?: ")
            partition = estimate_ans.partition(".")

                
        print("Correct Price:", correct_price)
        
        if abs(correct_price - float(estimate_ans)) <= correct_price * correctness_threshold:
            points_awarded = 100
        else:
            points_awarded = (float(estimate_ans) / correct_price + correctness_threshold) * 100

        print("Points Awarded: ", points_awarded)

        final_score += points_awarded
        
        problems += 1

    return round(final_score / num_problems, 2)
    


def cash_adder(num_problems):
    
    return 1

# -------------------------------------- GAME MANAGER LOOP --------------------------------------
while(True):

    print("What gamemode would you like to play? (1/2)")
    print("Upper Lower (1)")
    print("Estimate (2)")
    gamemode = input("Answer: ")
    while gamemode != "1" and gamemode != "2":
        gamemode = input("Answer Unread! Please Input Again: ")
    
    print("\n")

    if gamemode == "1":
        upper_lower(5)

    elif gamemode == "2":
        print("FINAL SCORE:", estimate(5))
    
    continue_game = input("Continue? (Y/N)")

    if continue_game != "Y":
        break