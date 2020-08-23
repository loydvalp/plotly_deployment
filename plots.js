function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector.append("option").text(sample).property("value", sample);
    });
  });
}
init();

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildBarChart(newSample);
  buildBubbleChart(newSample);
  buildGaugeChart(newSample);
}

// display data values for selected object
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter((sampleObj) => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");
    PANEL.html("");
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(key.toUpperCase() + ": " + value);
    });
  });
}
//Create a bar chart of the top ten bacterial species in a volunteer’s navel
//Select only the most populous species
function buildBarChart(sample) {
  d3.json("samples.json").then((data) => {
    console.log(data);
    var resultArray = data.samples.filter((sampleObj) => {
      return sampleObj.id === sample;
    });
    var result = resultArray[0];

    //create bar chart
    var top_ten_OTU = result.otu_ids
      .slice(0, 10)
      .map((idnum) => {
        return "OTU " + idnum;
      })
      .reverse();

    var top_ten_sample = result.sample_values.slice(0, 10).reverse();
    var top_ten_labels = result.otu_labels.slice(0, 10).reverse();

    var bar_trace = [
      {
        x: top_ten_sample,
        y: top_ten_OTU,
        text: top_ten_labels,
        name: "Top 10 OTU",
        type: "bar",
        orientation: "h",
        marker: { color: "rgb(76, 168, 100)" },
      },
    ];

    // format plot area
    Plotly.newPlot("bar", bar_trace);
  });
}
//Create a bubble chart to visualize the relative frequency of all the bacterial species found in a volunteer’s navel
function buildBubbleChart(sample) {
  d3.json("samples.json").then((data) => {
    console.log(data);
    var resultArray = data.samples.filter((sampleObj) => {
      return sampleObj.id === sample;
    });
    var result = resultArray[0];

    //create bubble chart
    var otu_ids = result.otu_ids
      .map((idnum) => {
        return idnum;
      })
      .reverse();

    var sample_values = result.sample_values.reverse();
    var otu_labels = result.otu_labels.reverse();

    // load data for plotting
    var bubble_trace = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: { color: otu_ids, size: sample_values, colorscale: "Greens" },
      },
    ];

    // format plot area
    var bubble_layout = {
      title: "OTU ID",
      showlegend: false,
    };
    Plotly.newPlot("bubble", bubble_trace, bubble_layout);
  });
}

function buildGaugeChart(Sample) {
  d3.json("samples.json").then((data) => {
    var samples = data.metadata;
    var resultArray = samples.filter((sampleObj) => sampleObj.id == Sample);
    var result = resultArray[0];

    var gauge_chart = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: result.wfreq,
        title: "Belly Button Washing Scrubs per Week",
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          bar: { color: "white" },
          axis: { range: [null, 9] },
          steps: [
            { range: [0, 1], color: "rgb(249, 253, 248)" },
            { range: [1, 2], color: "rgb(217, 240, 212)" },
            { range: [2, 3], color: "rgb(195, 231, 191)" },
            { range: [3, 4], color: "rgb(143, 208, 141))" },
            { range: [4, 5], color: "rgb(115, 189, 136)" },
            { range: [5, 6], color: "rgb(78, 154, 108)" },
            { range: [6, 7], color: "rgb(77, 134, 100)" },
            { range: [7, 8], color: "rgb(77, 124, 96)" },
            { range: [8, 9], color: "rgb(24, 58, 22)" },
          ],
        },
      },
    ];
    var layout = {
      width: 500,
      height: 450,
      margin: { t: 0, b: 0 },
    };

    Plotly.newPlot("gauge", gauge_chart, layout);
  });
}
