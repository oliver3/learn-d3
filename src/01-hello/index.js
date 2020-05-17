import * as d3 from 'd3';

const array = [100, 200, 300, 350, 375, 400, 500];

d3.select('#chart')
  .selectAll('circle')
  .data(array)
  .enter()
  .append('circle')
    .attr('r', 10)
    .attr('cy', 100)
    .attr('cx', (d) => d)


setTimeout(() => {
  d3.select('#chart')
  .selectAll('circle')
  .data(array.map((x) => x/2))
  .transition().duration(300)
    .attr('r', 5)
    .attr('cy', 100)
    .style('fill', 'red')
    .attr('cx', (d) => d)

}, 1000);
