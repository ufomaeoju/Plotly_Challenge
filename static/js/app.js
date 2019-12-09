function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function(sampledata) => {
    console.log(sampledata);
    // Use d3 to select the panel with id of `#sample-metadata`
    var meta_data = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    meta_data.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sampledata).forEach(([key, value]) => {
      meta_data.append("h6").text(`${key}: ${value}`);
      console.log(key, value);
    })
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
})
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(sampledata) => {
    console.log(sampledata);
  
    // @TODO: Build a Bubble Chart using the sample data
    const otu_ids = sampledata.otus_ids;
    const otu_labels = sampledata.otu_lables;
    const sample_values = sampledata.sample_values;
    console.log(otu_ids, otu_labels, sample_values);
    
    var trace2 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values,
        showscale: True
      }
    };

    var mydata = [trace2];

    var layoutBubble = {
      title: 'Marker Size and Color',
      showlegend: false,
      height: 600,
      width: 600
    };

    Plotly.newPlot("bubble", mydata, layoutBubble);

    // @TODO: Build a Pie Chart
    var trace1 = {
      labels: [otus_ids],
      values: [sample_values],
      type: 'pie'
    };

    var data = [trace1];

    var layout = {
      title: "'Pie' Chart",
    };

    Plotly.plot("", data, layout);
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
