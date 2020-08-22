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
        name: "Top 10",
        type: "bar",
        orientation: "h",
      },
    ];

    // format plot area
    var bar_layout = { title: "Top 10 OTUs" };
    Plotly.newPlot("bar", bar_trace, bar_layout);
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
        marker: { color: otu_ids, size: sample_values },
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

//Adapt the gauge chart to show washing frequency
function buildGaugeChart(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter((sampleObj) => sampleObj.id == sample);
    var result = resultArray[0];
    console.log(result);
    var washFreq = result.wfreq;
    console.log(washFreq);

    // load data for plotting
    var gauge_trace = [
      {
        //domain: { x: [0, 1], y: [0, 1] },
        value: washFreq,
        showlegend: false,
        hole: 0.4,
        rotation: 90,
        title: { text: "Belly Button Washing Frequency" },
        type: "pie",
        //mode: "gauge+number",
        direction: "clockwise",
        textinfo: "text",
        textposition: "inside",
        marker: {
          labels: [
            "0-1",
            "1-2",
            "2-3",
            "3-4",
            "4-5",
            "5-6",
            "6-7",
            "7-8",
            "8-9",
          ],
        },
        /*gauge: {
          axis: { range: [null, 10] },
          bar: { color: "green" },
        },*/
      },
    ];

    // format plot area
    var gauge_layout = {
      shapes: [
        {
          type: "line",
          x0: 0.5,
          y0: 0.5,
          x1: 0.6,
          y1: 0.6,
          line: {
            color: "black",
            width: 3,
          },
        },
      ],
    };
    Plotly.newPlot("gauge", gauge_trace, gauge_layout);
  });
}
