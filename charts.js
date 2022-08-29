function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}
//***Demographics Panel***//
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;

    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {

  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

    // 3. Create a variable that holds the samples array. 
    console.log(data);
    var sampleArray = data.samples;
    console.log(sampleArray);

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredArray = sampleArray.filter(data => data.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var result = filteredArray[0];
    console.log(result);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = result.otu_ids;
    var otuLabels = result.otu_labels;
    var sampleValues = result.sample_values;
    console.log(otuIds);
    console.log(otuLabels);
    console.log(sampleValues);

    //***BAR CHART***//

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last.
    var yticks = otuIds.slice(0,10).map(id => "OTU " + id).reverse();
    console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0,10).reverse(),
      text: otuLabels.slice(0,10).reverse(),
      type: "bar"
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top Ten Bacterial Cultures Found</b>",
      yaxis: {
        tickmode: "array",
        tickvals: [0,1,2,3,4,5,6,7,8,9],
        ticktext: yticks
      },
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    //***BUBBLE CHART***//

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "Blues"
      }
    }];
    console.log(bubbleData);

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<b>Bacteria Cultures Per Sample</b>",
      xaxis: {title: "OTU ID", automargin: true},
      hovermode: "closest"
    };
    console.log(bubbleLayout);

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
  
    //***GAUGE CHART***//

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataArray = data.metadata
    var filteredMetadata = metadataArray.filter(sampleObj => sampleObj.id == sample);
   
    // 2. Create a variable that holds the first sample in the metadata array.
    var metadataResult = filteredMetadata[0];
    console.log(metadataResult);

    // 3. Create a variable that holds the washing frequency.
    var washFreq = metadataResult.wfreq;

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
    	{
        value: washFreq,
        type: "indicator",
        mode: "gauge+number",
        title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs Per Week" },
        gauge: {
          axis: { range: [null, 10], tickwidth: 1, tickcolor: "dimgrey" },
          bar: { color: "dimgrey" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0, 2], color: "aliceblue" },
            { range: [2, 4], color: "lavender" },
            { range: [4, 6], color: "skyblue" },
            { range: [6, 8], color: "deepskyblue" },
            { range: [8, 10], color: "steelblue" }
          ],
        }  
      }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "ghostwhite",
      font: { color: "black", family: "Arial" }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}

