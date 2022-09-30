import json


results = []
categories = {}
nbProduct = 0

with open("products_enriched.json", "r") as products: 
   
    jsonProducts = json.load(products)
    for product in jsonProducts:
        nbProduct += 1
        del product['parent_category']
        del product['child_category']
        del product['categories']
        del product['url']
        results.append(product)
        if product['department'] in categories:
            categories[product['department']] += 1
        else: 
            categories[product['department']] = 1


print(nbProduct)

jsonString = json.dumps(results)
jsonFile = open("products.json", "w")
jsonFile.write(jsonString)
jsonFile.close()


# nbSuggest = 0
# suggests = []

# with open("suggest_es.json", "r") as suggestFile:
#      jsonSuggests = json.load(suggestFile)
#      for suggest in jsonSuggests[0:500]:
#         suggest = suggest['_source']
#         del suggest['brands']
#         suggests.append(suggest)

# print(nbSuggest)
# jsonString = json.dumps(suggests)
# jsonFile = open("suggests.json", "w")
# jsonFile.write(jsonString)
# jsonFile.close()