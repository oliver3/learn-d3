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

  const chart = d3.select('body')
    .append('div')
    .attr('class', 'bar-chart')
    .style('height', () => distances.length * 21 + 'px');

  const entries = chart.selectAll('div').data(distances)
    .enter().append('div')
    .attr('class', 'entry')
    .style('top', (d, i) => i * 21 + 'px');

  entries.each(function ({ name, distance }) {
    const entry = d3.select(this);

    entry.append('div').attr('class', 'label category')
      .text(name);

    const color = d3.color('orange')
      .darker(colorScale(distance));

    entry.append('div').attr('class', 'bar')
      .style('width', `${barScale(distance)}px`)
      .style('background-color', color);

    entry.append('div').attr('class', 'label value')
      .style('left', `${barScale(distance) + 100}px`)
      .text(`${fmt(distance)} AU`);
  });


}
