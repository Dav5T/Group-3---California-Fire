
# Group 3 - California Wildfires
Our goal is to find out what factors contribute to California Wildfire 

## Description

### Files and folders
There should be a total of 3 folders under Darvy which contains other files and subfolders:
<br>**1. data:**
<br>&ensp;• CaliforniaWeather.json 
<br>&ensp;• FireIncident.json 
<br>&ensp;• us-county-boundaries.json 
<br>**2. MapbBox Forest Fires**
<br>&ensp;• css --> style.css
<br>&ensp;• 2018.json (used for mapbox just in case you run into CORS issues)
<br>&ensp;• mapbox.html (javascript is embedded in the body)
<br>**3. static**
<br>&ensp;• css --> style.css
<br>&ensp;• js --> chart.js (linked to temperature_graph.html), logic.js (linked to temperature.html)


### HTML pages

The pages are hyperlinked to the next. The order of the pages is as followed:
<br>
<br>&ensp;•Title
<br>&ensp;•Agenda
<br>&ensp;•Introduction
<br>&ensp;•DataSet
<br>&ensp;•mapbox (found in the Mapbox Forest Fire Folder)
<br>&ensp;•Temperature
<br>&ensp;•Temperature graph
<br>&ensp;•conclusion 

### Database:
We used MongoDB to store the data

### Flask routes:
/api/v1.0/county
<br>/api/v1.0/weather
<br>/api/v1.0/fire
<br>/api/v1.0/mapbox
<br>I was able to access the data through Jupyter Notebook, but when it came to using it with Javascript, I kept running into CORS Policy issues

### Data cleanup:
A lot of merging of json and geojson were required. Using Javascript, I was able to merge sections of other data to add to other json data. In Visual Studio Code, I had to use a combination of Regex and Matchcase to cleanup and merge the weather data. 

### Other Library:
I ended up using Mapbox to display the locations of the fires each years when using the slider

## Source

### Data
**Califire API:** https://www.fire.ca.gov/incidents/
<br>**National Centers for Environmental Information (weather):**  https://www.ncei.noaa.gov/access/monitoring/climate-at-a-glance/county/mapping/4/tavg/202208/1/rank
<br>**Opendatasoft (US County Boundaries):**  https://public.opendatasoft.com/explore/dataset/us-county-boundaries/export/?disjunctive.statefp&disjunctive.countyfp&disjunctive.name&disjunctive.namelsad&disjunctive.stusab&disjunctive.state_name&refine.stusab=CA
<br>

### References
*1. Linear Regression Calculation*
<br>https://www.graphpad.com/quickcalcs/linear1/
<br>
<br>*2. Linear Regressions Javascript*
<br>https://www.w3schools.com/ai/ai_regressions.asp
<br>
<br>*3. Sort GeoJson*
<br>https://stackoverflow.com/questions/65411098/how-do-i-sort-a-geojson-features-array-by-a-property-value#:~:text=Geojson%20is%20still%20valid%20json,schema%2C%20not%20a%20new%20type.
<br>
<br>*4. Mapbox*
<br>https://docs.mapbox.com/help/tutorials/show-changes-over-time/
<br>













