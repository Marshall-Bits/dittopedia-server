# DittoPedia server
This is the server for the DittoPedia project. It is a RESTful API that serves data to the DittoPedia client.

## Purpose
The purpose of this project is to create a database of useful resources for developers. The resources are organized by categories in the DB.
Through the API, the client can request the resources by category, and the server will return the resources in JSON format.

## Fancy Feature
The server accepts GET requests with the query of a url. Then, by scrapping the url, it will connect to OpenAI's GPT-4o and generate the new entry for the resource based on the headings and meta information of the page. This way, the server can generate new resources for the DB and categorize them automatically.
