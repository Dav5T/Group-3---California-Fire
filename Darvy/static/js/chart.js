d3.json("CaliforniaWeather.json").then(function (weatherData) {
    
    d3.json("FireIncident.json").then(fireData =>{
      
        let weather = weatherData
        let fire = fireData.features
        
        // Creates a dictionary for average temperature per year 
        function temperatureAverage(yearArray)
        {
            let temperature=[]

            

            for (var y in weather[yearArray].data){
                temperature.push((weather[yearArray].data[y].value-32)*(5/9))
            }
    
            
            //AVERAGE TEMPERATURE 
            function Average(array){
                var total = 0
                var count = 0

                array.forEach(function(item, index){
                total += item;
                count++
                });
                return total/count;
            }
            return Average(temperature)
        }

        let tempAvg =[]
        for (let i = 0; i < 6; i++)
        {
            tempAvg.push(temperatureAverage(i))
        }
        console.log(tempAvg)

        let trace ={
            x: ['2018', '2019', '2020', '2021', '2022', '2023'], 
            y: tempAvg,
            type: "scatter",
            marker: {
              color: 'green',
              line: {
                color: 'rgb(8,48,107)',
                width: 1.5
              }
            }
        
          }
        
        let layout ={
            xaxis:{title:"Year"},
            yaxis:{title:"Temperature (°C)"},
            title:{
              text: "Average Temperature", 
              font:{
                size: 20
              }
            }
        }
        
        let data = [trace]
        Plotly.newPlot("temperature", data, layout)

        // grabbing year information 
        let years = fire.map(h => h.properties.StartedDateOnly)
        
        // fetching year only and converting into integer while putting it into an array 
        let year =[]
        for (var i in years){
            year.push(parseInt(new Date(years[i]).getFullYear()))
        }
          console.log(year)
  
          var num2018 = 0
          var num2019 = 0
          var num2020 = 0
          var num2021 = 0
          var num2022 = 0
          var num2023 = 0
    
        // TRACKS THE NUMBER OF FIRES PER YEAR 
        for (var i in year){
            if (year[i] == 2018)
            { num2018 +=1 }
            else if (year[i] ==2019)
            {num2019 += 1;}
            else if (year[i] ==2020)
            {num2020 += 1}
            else if (year[i] ==2021)
            {num2021 += 1}
            else if (year[i] ==2022)
            {num2022 += 1}
            else 
            {num2023 += 1}
        }
        


        let trace1 ={
            x: ['2018', '2019', '2020', '2021', '2022', '2023'], 
            y: [num2018, num2019, num2020, num2021, num2022, num2023],
            type: "bar",
            marker: {
              color: 'rgb(142, 124, 195)',
              line: {
                color: 'rgb(8,48,107)',
                width: 1.5
              }
            }
        
          }
        
        let layout1 ={
            xaxis:{title:"Year"},
            yaxis:{title:"Number of wildfires"},
            title:{
              text: "Number of Wildfires", 
              font:{
                size: 20
              }
            }
        }

        let data1 = [trace1]
        Plotly.newPlot("bar", data1, layout1)
  
        let acres = fire.map(g => g.properties.AcresBurned)
     

        let acresburned =[]
        for (var x in year)
        {
          acresburned.push({"year" : year[x]})
        }
      
        console.log(acresburned)
        // ADD THE ACRES BURNED INTO THE acresburned DICTIONARY 
        acresburned.forEach((i) =>{ 
            let index = acresburned.indexOf(i);
          i['Acres'] = acres[index]
        });

        console.log(acresburned)
        var y2018 = 0
        var y2019 = 0
        var y2020 = 0
        var y2021 = 0
        var y2022 = 0
        var y2023 = 0
    
      // TRACKS THE NUMBER OF ACRES PER YEAR IN ORDER TO CREATE A BAR GRAPH 
        for (var i in acresburned){
            if (acresburned[i].year == 2018)
            { y2018 += acresburned[i].Acres}
            else if (acresburned[i].year ==2019)
            {y2019 += acresburned[i].Acres}
            else if (acresburned[i].year ==2020)
            {y2020 += acresburned[i].Acres}
            else if (acresburned[i].year ==2021)
            {y2021 += acresburned[i].Acres}
            else if (acresburned[i].year ==2022)
            {y2022 += acresburned[i].Acres}
            else 
            {y2023 += acresburned[i].Acres}
        }
        console.log([y2018, y2019, y2020, y2021, y2022, y2023])
        let trace2 ={
            x: ['2018', '2019', '2020', '2021', '2022', '2023'], 
            y: [y2018, y2019, y2020, y2021, y2022, y2023], 
            type: "bar",
            marker: {
                color: 'rgb(158,202,225)',
                line: {
                    color: 'rgb(8,48,107)',
                    width: 1.5
            }
            }
        
        }
        
        let layout2 ={
            xaxis:{title:"Year"},
            yaxis:{title:"Acres"},
            title:{
                text: "Acres Burned", 
                font:{
                    size: 20
                }
            }
        }
    

      let data2 = [trace2]
      Plotly.newPlot("acres", data2, layout2)
    
      
      let trace3 ={
        x: [y2018, y2019, y2020, y2021, y2022, y2023], 
        y: tempAvg, 
        mode: "markers",
        name: "acres",
        marker: {
            color: 'rgb(255, 217, 102)',
            line: {
                color: 'rgb(8,48,107)',
                width: 1.5
        }
        }
    
    }

    

    let trace4 =
    {
        x:[28000, 2940000], 
        y:[23.65, 23.9383],
        mode: "line",
        name: "Rsquared = 0.05"  
    }
    
    let layout3 ={
        xaxis:{title:"Acres"},
        yaxis:{title:"Temperature (°C)"},
        title:{
            text: "Temperature vs Acres Burned", 
            font:{
                size: 20
            }
        }
    }

    
  let data3 = [trace3, trace4]
  Plotly.newPlot("coorelation", data3, layout3)




    });
    
});
    