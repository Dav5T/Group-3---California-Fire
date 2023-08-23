from flask import Flask, jsonify
from pymongo import MongoClient

app = Flask(__name__)

# Connect to the MongoDB server
client = MongoClient("mongodb://localhost:27017/")

# Select your database (replace "mydatabase" with your database name)
db = client["California_Wilfires_db"]

@app.route("/")
def welcome():
    return(
        f"<b>Welcome</br>"
        f"Available Routes:<br/>"
        f"/api/v1.0/county<br/>"
        f"/api/v1.0/weather<br/>"
        f"/api/v1.0/fire<br/>"
        f"/api/v1.0/mapbox<br/>"

    )
@app.route("/api/v1.0/county")
def county():
    # Retrieve all documents from "mycollection" (replace with your collection name)
    items = list(db.county_boundary.find({}))
    
    # Convert ObjectId to string for JSON serialization
    for item in items:
        item["_id"] = str(item["_id"])
    
    return jsonify(items)

@app.route("/api/v1.0/weather")
def weather():
    # Retrieve all documents from "mycollection" (replace with your collection name)
    items = list(db.weather.find({}))
    
    # Convert ObjectId to string for JSON serialization
    for item in items:
        item["_id"] = str(item["_id"])
    
    return jsonify(items)

@app.route("/api/v1.0/fire")
def fire():
    # Retrieve all documents from "mycollection" (replace with your collection name)
    items = list(db.fire_incident.find({}))
    
    # Convert ObjectId to string for JSON serialization
    for item in items:
        item["_id"] = str(item["_id"])
    
    return jsonify(items)

@app.route("/api/v1.0/mapbox")
def mapbox():
    # Retrieve all documents from "mycollection" (replace with your collection name)
    items = list(db.mapbox_map.find({}))
    
    # Convert ObjectId to string for JSON serialization
    for item in items:
        item["_id"] = str(item["_id"])
    
    return jsonify(items)

if __name__ == '__main__':
    app.run(debug=True)



