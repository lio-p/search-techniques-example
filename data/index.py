import json 
from elastic_enterprise_search import AppSearch, EnterpriseSearch
from elasticsearch import Elasticsearch, helpers
import time

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

print("Init Elasticsearch client")
es = Elasticsearch(
    cloud_id="test-blog:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvOjQ0MyRjNzQ4ZWVjNTFjNjU0NDhhYmQzYmY2Nzc3NTA2YjUyOCQ4YWUwMTM3NjkyMjA0NzA0YmI2MzEwMWMzMjk2Njk2Ng==",
    basic_auth=("elastic", "***"),
    request_timeout=30
)


print("Init App search client")
app_search = AppSearch("https://test-blog.ent.us-central1.gcp.cloud.es.io:9243", bearer_auth="***")


print("Index product suggestions")
setting = {
    "index": {
        "number_of_replicas": 0,
        "analysis": {
            "filter": {
                "shingle": {
                    "max_shingle_size": "5",
                    "min_shingle_size": "3",
                    "type": "shingle"
                }
            },
            "analyzer": {
                "reverse": {
                    "filter": [
                        "reverse"
                    ],
                    "type": "custom",
                    "tokenizer": "standard"
                },
                "trigram": {
                    "filter": [
                        "shingle"
                    ],
                    "type": "custom",
                    "tokenizer": "standard"
                }
            }
        }

    }
}
mapping = {
    "properties": {
        "category": {
            "properties": {
                "name": {
                    "type": "text",
                    "fields": {
                        "keyword": {
                            "type": "keyword",
                            "ignore_above": 256
                        }
                    }
                },
                "value": {
                    "type": "long"
                }
            }
        },
        "name": {
            "type": "search_as_you_type",
            "doc_values": "false",
            "max_shingle_size": 3,
            "fields": {
                "reverse": {
                    "type": "text",
                    "analyzer": "reverse"
                },
                "suggest": {
                    "type": "text",
                    "analyzer": "trigram"
                }
            }
        },
        "weight": {
            "type": "rank_feature",
            "fields": {
                "numeric": {
                    "type": "integer"
                }
            }
        }
    }
}

checkForIndex = es.indices.exists(index="suggest")
if checkForIndex:
    print("Index already exists, skipping it")
else:
    print("Index does not exist, creating it")
    es.indices.create(index="suggest", settings=setting, mappings=mapping)
    print("Index created")

print("Indexing product suggestions")
suggestFile = open("suggests.json")
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
productFile = open("products.json")
index(productFile, "products", 'sku')



checkForIndex = es.indices.exists(index="search-products")
if checkForIndex:
    print("Index already exists, skipping it")
else:
    print("Index does not exist, creating it")
    es.indices.create(index="search-products")
    print("Index created")

print("Indexing products")
suggestFile = open("products.json")
suggestJson = json.load(suggestFile)
helpers.bulk(es, suggestJson, index="search-products")
print("Indexed product suggestions")

