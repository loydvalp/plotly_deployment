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
        marker: { color: "rgb(77, 78, 218)" },
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
        marker: { color: otu_ids, size: sample_values, colorscale: "Rainbow" },
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
function buildGaugeChart(wfreq) {
  d3.json("samples.json").then((data) => {
    //var metadata = data.metadata;
    //var resultArray = metadata.filter((sampleObj) => sampleObj.id == sample);
    //var result = resultArray[0];
    //console.log(result);
    var washFreq = wfreq / 9;
    //use trigonometry to calculate meter point
    var level = washFreq * 180;
    var degrees = 180 - level,
      radius = 0.5;
    var radians = (degrees * Math.PI) / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);
    // Path: may have to change to create a better triangle
    var mainPath = "M -.0 -0.05 L .0 0.05 L ",
      pathX = String(x),
      space = " ",
      pathY = String(y),
      pathEnd = " Z";
    var path = mainPath.concat(pathX, space, pathY, pathEnd);
    var data = [
      {
        type: "scatter",
        x: [0],
        y: [0],
        marker: { size: 12, color: "850000" },
        showlegend: false,
        name: "Freq",
        text: level,
        hoverinfo: "text+name",
      },
      {
        values: [
          50 / 9,
          50 / 9,
          50 / 9,
          50 / 9,
          50 / 9,
          50 / 9,
          50 / 9,
          50 / 9,
          50 / 9,
          50,
        ],
        rotation: 90,
        text: [
          "8-9",
          "7-8",
          "6-7",
          "5-6",
          "4-5",
          "3-4",
          "2-3",
          "1-2",
          "0-1",
          "",
        ],
        textinfo: "text",
        textposition: "inside",
        marker: {
          colors: [
            "rgb(250, 0, 0)",
            "rgb(250, 129, 8)",
            "rgb(250, 234, 10)",
            "rgb(15, 224, 0)",
            "rgb(0, 238, 255)",
            "rgb(0, 0, 255)",
            "rgb(123, 8, 255)",
            "rgb(191, 15, 255)",
            "rgb(255, 15, 255)",
            "rgba(255, 255, 255, 0)",
          ],
        },
        labels: [
          "8-9",
          "7-8",
          "6-7",
          "5-6",
          "4-5",
          "3-4",
          "2-3",
          "1-2",
          "0-1",
          "",
        ],
        hoverinfo: "label",
        hole: 0.5,
        type: "pie",
        showlegend: false,
      },
    ];
    var layout = {
      shapes: [
        {
          type: "path",
          path: path,
          fillcolor: "850000",
          line: {
            color: "850000",
          },
        },
      ],
      title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
      height: 500,
      width: 500,
      xaxis: {
        zeroline: false,
        showticklabels: false,
        showgrid: false,
        range: [-1, 1],
      },
      yaxis: {
        zeroline: false,
        showticklabels: false,
        showgrid: false,
        range: [-1, 1],
      },
    };
    Plotly.newPlot("gauge", data, layout);
  });
}
