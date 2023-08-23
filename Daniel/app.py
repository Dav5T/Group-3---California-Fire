from flask import Flask, jsonify, render_template
from flask_cors import CORS
import geopandas as gpd
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load GeoJSON files
fire_data = gpd.read_file('Resources/California_Fire_Perimeters_(all).geojson')
counties_data = gpd.read_file('Resources/California_Counties.geojson')
fire_data['ALARM_DATE'] = pd.to_datetime(fire_data['ALARM_DATE'], errors='coerce')

# Convert 'alarm_date' to datetime
fire_data['ALARM_DATE'] = pd.to_datetime(fire_data['ALARM_DATE'], errors='coerce')

# Map cause codes
cause_mapping = {
    1: "Lightning", 2: "Equipment Use", 3: "Smoking",
    4: "Campfire", 5: "Debris", 6: "Transportation",  # Combine Railroad & Aircraft
    7: "Arson", 8: "Playing with fire", 9: "Unknown / Miscellaneous", # Combine Unknown & Miscellaneous
    10: "Vehicle", 11: "Powerline", 15: "Structure", 18: "Escaped Prescribed Burn"
}

# Apply cause mapping
fire_data['CAUSE'] = fire_data['CAUSE'].map(cause_mapping)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/get_counties_data')
def get_counties_data():
    return counties_data.to_json()

@app.route('/api/most_common_cause_per_county')
def most_common_cause_per_county():
    # Calculate the most common cause per county
    merged_data = gpd.sjoin(counties_data, fire_data, how="inner", op='intersects')
    most_common_cause = merged_data.groupby('NAME')['CAUSE'].agg(lambda x: x.value_counts().index[0]).to_dict()
    return jsonify(most_common_cause)

@app.route('/api/most_common_cause_per_year')
def most_common_cause_per_year():
    # Calculate the most common cause per year
    yearly_cause = fire_data.groupby(fire_data['ALARM_DATE'].dt.year)['CAUSE'].agg(lambda x: x.value_counts().index[0]).to_dict()
    return jsonify(yearly_cause)

@app.route('/api/average_size_per_cause')
def average_size_per_cause():
    # Calculate the average size per cause
    avg_size = fire_data.groupby('CAUSE')['GIS_ACRES'].mean().to_dict()
    return jsonify(avg_size)

if __name__ == '__main__':
    app.run(debug=True)