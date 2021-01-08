const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'

d3.json(url, function (error, json) {
    console.log(json)

    // height and width of svg
    const h = 500
    const w = 800
    const pX = 80
    const pY = 70

    // find min and max x data for scale domain
    const yearData = json.map(d => d['Year'])
    const minX = d3.min(yearData) - 1
    const maxX = d3.max(yearData)

    // create x scale
    const xScale = d3.scaleLinear()
        .domain([minX, maxX])
        .range([pX, w - pX])
        .nice();

    //  create array of time data
    const timeData = json.map(d => {
        // create date object from mm:ss string
        time = d.Time.split(':')
        console.log(time[0])
        return new Date(2000, 0, 1, 0, time[0], time[1])
    })
    // find min and max time for y scale domain
    const minTime = d3.min(timeData)
    const maxTime = d3.max(timeData)

    // create y scale
    const yScale = d3.scaleTime()
        .domain([maxTime, minTime])
        .range([h - pY, pY])
        .nice();

    // create svg
    let svg = d3.select('body')
        .append('svg')
        .attr('height', h)
        .attr('width', w)

    // add a title
    svg.append('text')
        .attr('x', w / 2)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .attr('id', 'title')
        .text('Doping Allegations in Professional Cycling')

    // add circles
    svg.selectAll('circle')
        .data(json)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('r', 4)
        .attr('cx', (d) => xScale(d['Year']))
        .attr('cy', (d, i) => yScale(timeData[i]))
        .style('fill', (c) => c.Doping ? 'red' : 'blue')

    // add the x axis
    let xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format('.4r'))

    svg.append('g')
        .attr('id', 'x-axis')
        .attr('transform', `translate(0,${h - pY})`)
        .call(xAxis)

    // add the x axis label
    svg.append('text')
        .attr('x', w / 2)
        .attr('y', h - pX / 5)
        .attr('class', 'label')
        .text('Year')

    // add the y axis
    let yAxis = d3.axisLeft().scale(yScale).tickFormat(d3.timeFormat('%M:%S'))

    svg.append('g')
        .attr('id', 'y-axis')
        .attr('transform', `translate(${pX},0)`)
        .call(yAxis)

    // add the y axis label


    svg.append('text')
        .attr('x', 0 - h / 2)
        .attr('y', pY / 3)
        .attr('class', 'label')
        .attr('transform', 'rotate(-90)')
        .text('Time')

    // add legend
    // var legend = d3.select('body')

    const legendTop = h - (h / 3 * 2)
    const legendSide = w - pX * 3

    svg.append('rect')
        .attr('id', 'legend')
        .style('width', 100)
        .style('height', 60)
        .attr('x', legendSide)
        .attr('y', legendTop)
        .style('fill', 'white')
        .style('stroke', 'black')
        .style('stroke-width', '0.5')

    // doping circle
    svg.append('circle')
        .attr('r', 4)
        .attr('cx', legendSide + 10)
        .attr('cy', legendTop + 20)
        .style('fill', 'red')

    // doping label
    svg.append('text')
        .attr('x', legendSide + 25)
        .attr('y', legendTop + 23)
        .text('doping')

    // non-doping circle
    svg.append('circle')
        .attr('r', 4)
        .attr('cx', legendSide + 10)
        .attr('cy', legendTop + 40)
        .style('fill', 'blue')

});

