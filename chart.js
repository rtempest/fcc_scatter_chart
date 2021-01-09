const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'

d3.json(url, function (error, json) {

    // height and width of svg
    const h = 550
    const w = 750
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
        .attr('y', 40)
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
        .style('fill', (c) => c.Doping ? '#EF476F' : '#26547C')


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
        .attr('text-anchor', 'middle')
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
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .text("Time up Alpe D'Huez (minutes)")

    // add legend
    const legendTop = h - h + 150
    const legendSide = w - pX * 3.5
    const legendWidth = 210;
    const legendHeight = 50;

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
        .attr('cy', legendTop + 15)
        .style('fill', '#EF476F')

    // legend doping label
    svg.append('text')
        .attr('x', legendSide + 25)
        .attr('y', legendTop + 20)
        .style('font-size', '9pt')
        .text('Riders with doping allegations')

    // legend non-doping circle
    svg.append('circle')
        .attr('r', 4)
        .attr('cx', legendSide + 10)
        .attr('cy', legendTop + 35)
        .style('fill', '#26547C')

    // legend non-doping label
    svg.append('text')
        .attr('x', legendSide + 25)
        .attr('y', legendTop + 40)
        .style('font-size', '9pt')
        .text('Riders without doping allegations')

    // create tooltip
    const tooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')


    // add tooltip as a mouseover event
    circle
        .on('mouseover', (e) => {
            place = e.Place
            thisCircle = json.filter((x) => x['Place'] === place)[0]
            const dopingStr = () => e.Doping ? `<li></strong> ${e.Doping}</li>` : '';
            tooltip
                .style('top', d3.event.pageY + 'px')
                .style('left', d3.event.pageX + 10 + 'px')
                .attr('data-year', e.Year)
                .html(`<li><strong>Cyclist:</strong> ${e.Name}</li><li><strong>Time:</strong> ${e.Time}</li><li><strong>Country:</strong> ${e.Nationality}</li>${dopingStr()}`)
            tooltip.transition()
                .duration(200)
                .style('opacity', 1)
        })
        .on('mouseout', (event) => {
            tooltip
                .transition().duration(600)
                .style('opacity', 0)
        });


});

