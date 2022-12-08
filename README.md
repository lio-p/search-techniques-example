# Search techniques example

Examples of different search techniques implementation using Search UI and Elastic

# Pre-reqs

- [Elastic Cloud](https://cloud.elastic.co/) Deployment created, new accounts can sign-up for a limitless 14-day free trial to POC building a solution like this

## Setup Elastic Cloud

To get started with this sample, create a 14-day free trial of Elastic Cloud by going to https://cloud.elastic.co/registration and signing up with your Google or Microsoft Account or by signing up with another email. 

After logging in, you will be prompted with the Elastic Cloud console. Clicking `Create Deployment` will walk you through creating a new Elastic Cloud deployment, hosted in the Cloud Provider and region of your choice. 

There will be a username and password shown during the provisioning process, so be sure to save that somewhere safe as it is an admin account for your cluster.
<p align="center">
<img src="static/create-deployment.gif" height="500">
 </p>

Once the cluster is ready, you can navigate to it at the link provided. This will take you to Kibana, the solution management and visualization tool for Elastic. There are a few settings that you should capture and place in the sample to point it at this newly created Elastic Cloud instance. These settings are

- ELASTICSEARCH_PASSWORD: Password shown when deployment is created
- ELASTICSEARCH_URL: URL found on Deployments Page
- CLOUD_ID: Cloud id Found on Deployments Page (Look for Cloud ID Area)
<p align="center">
<img src="static/get-cloud-id.gif" height="500">
</p>
- AS_BASE_URL, AS_SEARCH_API_KEY & AS_SEARCH_PRIVATE_KEY : URL of Elastic App Search Instance and API Key for search experience in the UI. Retrieve it like below

<p align="center">
<img src="static/loader/get_as_base_url.gif" height="500">
</p>

## Load data

Once your deployment is ready, you can load the sample data. 

In this demo, we're using two datasets, one to search for cities and one to search for stores.

You can use the script [init.py](init.py) to create the engines in App Search and load the data. 

Pass the App Search URL and private key as part of the script execution. Example: `python3 init.py --app_search_private_key private-xyz --app_search_url https://xyz.ent.us-central1.gcp.cloud.es.io:443 --cloud_id xyz:xyz --es_password xyz`


## Run the application locally

Install the dependencies: `yarn install`

Install the dependencies for the client: `cd app-ui && install`

Go back to the root folder, run the application: `yarn dev`

Access the application on [http://localhost:3000](http://localhost:3000)
