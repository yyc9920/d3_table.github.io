d3.csv("./Korea_DustData_20211130_3.csv").then(function (data) {
    data.sort((a, b) => a.ACOSD - b.ACOSD);

    let title = data.columns;

    title.splice(title.indexOf("Time"), title.indexOf("Time"));
    data.forEach(d => { d.Date = d.Date + " | " + d.Time; });

    let table = d3.select("body")
        .append("table")
        .attr("class", "table table-striped");

    let thead = table.append("thead").attr("class", "table table-light");
    let header = thead.append("tr")
        .selectAll("th")
        .data(title)
        .enter()
        .append("th")
        .attr("class", d => d + "_")
        .text(d => d == "Date" ? (d + "Time") : d == "ACOSD" ? "" : d );

    let tbody = table.append("tbody");
    let rows = tbody.selectAll("tr").data(data).enter().append("tr");

    let cells = rows.selectAll("td")
        .data( d => title.map( title => ({ title: title, value: d[title] }) ) )
        .enter()
        .append("td")
        .attr("class", d => d.title)
        .text(d => d.value);

    let colorByKey = function (key, colorRanges) {
        let valuesFromKey = data.map(value => Number(value[key]));
        let color = d3.scaleLinear()
            .domain([0, d3.median(valuesFromKey), d3.max(valuesFromKey)])
            .range(colorRanges);

        let colorScale = d3.selectAll(`.${key}`)
            .style("background-color", d => color(d.value));
    };

    colorByKey("ACOSD", ["green", "yellow", "red"]);
    colorByKey("Temp", ["blue", "white", "red"]);
    colorByKey("Humidity", ["white", "skyblue", "blue"]);

    let hover = d3.select('.ACOSD_')
        .append('div')
        .attr("class", "tooltip")
        .text("ACOSD");

    let tooltip = d3.select(".tooltip")
        .append('span')
        .attr("class", "tooltiptext")
        .text("재비산먼지 평균농도");
});
