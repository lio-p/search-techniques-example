import json 
from elastic_enterprise_search import AppSearch, EnterpriseSearch
from elasticsearch import Elasticsearch, helpers
import time
import argparse

def index(file, engineName, idField):
    fileJson = json.load(file)
    count = 0
    documents = []
    for jsonDoc in fileJson:
        jsonDoc['id'] = jsonDoc[idField]
        documents.append(jsonDoc)
        count = count + 1
        if count >= 100:
            response = app_search.index_documents(
                engine_name=engineName, documents=documents, request_timeout=60)
            documents = []
            count = 0
            time.sleep(2)
            print(".", end='', flush=True)

parser = argparse.ArgumentParser()
parser.add_argument('--app_search_url', dest='app_search_url', required=True)
parser.add_argument('--app_search_private_key', dest='app_search_private_key', required=True)
parser.add_argument('--cloud_id', dest='cloud_id', required=True)
parser.add_argument('--es_password', dest='es_password', required=True)
parser.add_argument('--es_user', dest='es_user', required=False, default='elastic')
args = parser.parse_args()

print("Init Elasticsearch client")
es = Elasticsearch(
    cloud_id=args.cloud_id,
    basic_auth=(args.es_user, args.es_password),
    request_timeout=30
)


print("Init App search client")
app_search = AppSearch(args.app_search_url, bearer_auth=args.app_search_private_key)


print("Index product suggestions")
settingFile = open("./data/config/settings.json")
setting = json.load(settingFile)

mappingFile = open("./data/config/mapping.json")
mapping = json.load(mappingFile)
   

checkForIndex = es.indices.exists(index="suggest")
if checkForIndex:
    print("Index already exists, skipping it")
else:
    print("Index does not exist, creating it")
    es.indices.create(index="suggest", settings=setting, mappings=mapping)
    print("Index created")

print("Indexing product suggestions")
suggestFile = open("./data/suggests.json")
suggestJson = json.load(suggestFile)
helpers.bulk(es, suggestJson, index="suggest")
print("Indexed product suggestions")


print("Create product engine if it doesn't exist")
try:
    print("Checking for the products engine")
    app_search.get_engine(engine_name="products")
except Exception:
    print("Products engine does not exist, creating it")
    app_search.create_engine(engine_name="products", request_timeout=30)
    print("Product engine created")
else:
    print("Products engine already exists")

print("Indexing product data to App Search")
productFile = open("./data/products.json")
index(productFile, "products", 'sku')


checkForIndex = es.indices.exists(index="search-products")
if checkForIndex:
    print("Index already exists, skipping it")
else:
    print("Index does not exist, creating it")
    es.indices.create(index="search-products")
    print("Index created")

print("Indexing products")
suggestFile = open("./data/products.json")
suggestJson = json.load(suggestFile)
helpers.bulk(es, suggestJson, index="search-products")
print("Indexed product suggestions")

print("Add did you mean search template")
body = {
    "script": {
        "lang": "mustache",
        "source": {
            "suggest": {
                "text": "{{query_string}}",
                "simple_phrase": {
                    "phrase": {
                        "field": "name.suggest",
                        "size": 1,
                        "direct_generator": [
                            {
                                "field": "name.suggest",
                                "suggest_mode": "always"
                            },
                            {
                                "field": "name.reverse",
                                "suggest_mode": "always",
                                "pre_filter": "reverse",
                                "post_filter": "reverse"
                            }
                        ]
                    }
                }
            }
        }
    }
}
es.put_script(id='did-you-mean-template', body=body)