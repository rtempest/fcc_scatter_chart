const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'

d3.json(url, function (error, json) {

    // height and width of svg
    const h = 500
    const w = 800
    const pX = 80
    const pY = 70

    // find min and max x data for scale domain
    const yearData = json.map(d => d['Year'])
    const minX = d3.min(yearData)
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
    const circle = svg.selectAll('circle')
        .data(json)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('data-xvalue', (d, i) => yearData[i])
        .attr('data-yvalue', (d, i) => timeData[i])
        .attr('r', 4)
        .attr('cx', (d) => xScale(d['Year']))
        .attr('cy', (d, i) => yScale(timeData[i]))
        .style('fill', (c) => c.Doping ? '#C14953' : '#4C4C47')


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
    const legendWidth = 100;
    const legendHeight = 60;

    svg.append('rect')
        .attr('id', 'legend')
        .style('width', legendWidth)
        .style('height', legendHeight)
        .attr('x', legendSide)
        .attr('y', legendTop)
        .style('fill', 'white')
        .style('stroke', 'black')
        .style('stroke-width', '0.5')

    // legend doping circle
    svg.append('circle')
        .attr('r', 4)
        .attr('cx', legendSide + 10)
        .attr('cy', legendTop + 20)
        .style('fill', '#C14953')

    // legend doping label
    svg.append('text')
        .attr('x', legendSide + 25)
        .attr('y', legendTop + 25)
        .text('doping')

    // legend non-doping circle
    svg.append('circle')
        .attr('r', 4)
        .attr('cx', legendSide + 10)
        .attr('cy', legendTop + 40)
        .style('fill', '#4C4C47')

    // legend non-doping label
    svg.append('text')
        .attr('x', legendSide + 25)
        .attr('y', legendTop + 45)
        .text('non-doping')

    // create tooltip
    const tooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')

    // add tooltip as a mouseover event
    circle
        .on('mouseover', (event) => {
            place = event['Place']
            thisCircle = json.filter((x) => x['Place'] === place)[0]
            const { Name, Doping, Time, Nationality } = thisCircle
            const dopingStr = () => Doping ? `<li><strong>Doping Allegations:</strong> ${Doping}</li>` : '';
            d3.select('#tooltip')
                .style('visibility', 'visible')
                .style('top', '500px')
                .html(`<li><strong>Cyclist:</strong> ${Name}</li><li><strong>Time:</strong> ${Time}</li><li><strong>Country:</strong> ${Nationality}</li>${dopingStr()}`)
        })
        .on('mouseout', (event) => {
            d3.select('#tooltip')
                .style('visibility', 'hidden')
        });


});

