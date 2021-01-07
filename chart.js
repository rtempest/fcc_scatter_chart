const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'

d3.json(url, function (error, json) {
    console.log(json)

    // height and width of svg
    h = 400
    w = 700

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
        .attr('r', 3)
        .attr('cx', (d) => 200)
        .attr('cy', 200)

});

