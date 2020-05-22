import * as d3 from 'd3'

const planets = [];

const charts = [
  { key: 'avg', title: 'Average', color: 'orange' },
  { key: 'max', title: 'Maximum', color: 'blue' },
  { key: 'min', title: 'Minimum', color: 'red' }
];

const chart = {
  width: 800,
  height: 0,
  current: charts[0]
};


const barScale = d3.scaleLinear().range([0, 500]);
const colorScale = d3.scaleLinear().range([0, 1]);
const format = d3.format('.2f');
const svg = d3.select('svg.bar-chart');

d3.selectAll('button')
  .on('click', function () {
    chart.current = charts.filter(c => c.key === this.id)[0];
    draw();
  })

d3.json('/data/sol_2016.json')
  .then(function (data) {
    data.planets.forEach((planet) => {
      planets.push({
        name: planet.name,
        avg: planet.semiMajorAxisAU,
        max: planet.apheliumAU,
        min: planet.periheliumAU
      });
    });
    init();
  });

function init() {
  chart.height = planets.length * 21;
  svg
    .attr('width', chart.width)
    .attr('height', chart.height);

  setupView();

  const entries = svg.selectAll('g').data(planets)
    .enter().append('g')
    .attr('class', 'entry')
    .attr('transform', (d, i) => `translate(0, ${i * 21})`);

  entries.each(function (d) {
    const entry = d3.select(this);
    const key = chart.current.key;

    entry.append('text').attr('class', 'label category')
      .attr('x', 90)
      .attr('y', 15)
      .text(d.name);

    const color = d3.color('orange')
      .darker(colorScale(d[key]));

    entry.append('rect').attr('class', 'bar')
      .attr('x', 100)
      .attr('height', 20)
      .attr('width', barScale(d[key]))
      .style('fill', color);

    entry.append('text').attr('class', 'label value')
      .attr('y', 15)
      .attr('x', barScale(d[key]) + 105)
      .text(`${format(d[key])} AU`);
  });

}

function setupView() {
  d3.select('#chart').text(chart.current.title);

  const key = chart.current.key;
  d3.selectAll('button').property('disabled', false);
  d3.select(`#${key}`).property('disabled', true);

  planets.sort((a, b) => d3.ascending(a[key], b[key]));

  const maxValue = d3.max(planets, d => d[key]);
  barScale.domain([0, maxValue]);
  colorScale.domain([0, maxValue]);
}


function draw() {
  setupView();

  const entries = svg.selectAll('g.entry')
    .data(planets)
    .each(function (d) {
      const entry = d3.select(this);
      const key = chart.current.key;

      entry.select('.label.category')
        .text(d.name);

      const color = d3.color(chart.current.color)
        .darker(colorScale(d[key]));

      entry.select('.bar')
        .attr('width', barScale(d[key]))
        .style('fill', color);

      entry.select('.label.value')
        .attr('x', barScale(d[key]) + 105)
        .text(`${format(d[key])} AU`);
    });

}