import * as d3 from 'd3'

d3.json('/data/sol_2016.json')
  .then(
    (data) => data.planets
      .map(({ name, semiMajorAxisAU }) => ({ name, distance: semiMajorAxisAU }))
  )
  .then(draw);

function draw(distances) {
  distances.sort((a, b) => d3.ascending(a.distance, b.distance));

  const maxDistance = d3.max(distances, d => d.distance);

  const barScale = d3.scaleLinear()
    .domain([0, maxDistance])
    .range([0, 500]);

  const colorScale = d3.scaleLinear()
    .domain([0, maxDistance])
    .range([0, 1]);

  const fmt = d3.format('.2f');

  const svg = d3.select('body')
    .append('svg')
    .attr('class', 'bar-chart')
    .style('height', () => `${distances.length * 21}px`);

  const entries = svg.selectAll('g').data(distances)
    .enter().append('g')
    .attr('class', 'entry')
    .attr('transform', (d, i) => `translate(0, ${i * 21})`);

  entries.each(function ({ name, distance }) {
    const entry = d3.select(this);

    entry.append('text').attr('class', 'label category')
      .attr('x', 90)
      .attr('y', 15)
      .text(name);

    const color = d3.color('orange')
      .darker(colorScale(distance));

    entry.append('rect').attr('class', 'bar')
      .attr('x', 100)
      .attr('width', barScale(distance))
      .style('fill', color);

    entry.append('text').attr('class', 'label value')
      .attr('y', 15)
      .attr('x', barScale(distance) + 105)
      .text(`${fmt(distance)} AU`);
  });


}
