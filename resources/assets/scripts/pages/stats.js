import Base from './base';
import ChartJS from 'chart.js'

class Stats extends Base {
  get pageId() {
    return '#pageStats';
  }

  init() {
    this.initResponseCodesPerHourLastDay();
  }

  initResponseCodesPerHourLastDay() {
    let $chart = this.$scope.find('[data-id=responseCodesPerHourLastDayChart]');

    let dataLabels = [];
    let dataValues200304 = [];
    let dataValues301302 = [];
    let dataValues400401403404 = [];
    let dataValues50x = [];

    let data = $chart.data('data');
    for (let index in data) {
      let value = data[index];

      dataLabels.push(value.hour);
      dataValues200304.push(value['200304']);
      dataValues301302.push(value['301302']);
      dataValues400401403404.push(value['400401403404']);
      dataValues50x.push(value['50x']);
    }

    console.log(data, dataLabels, dataValues200304);

    data = {
      labels: dataLabels,
      datasets: [
        {
          label: '200, 304',
          borderWidth: 0,
          backgroundColor: 'rgba(70, 200, 125, 0.8)',
          hoverBackgroundColor: 'rgba(70, 200, 125, 1)',
          data: dataValues200304
        },
        {
          label: '301, 302',
          borderWidth: 0,
          backgroundColor: 'rgba(241, 196, 15, 0.8)',
          hoverBackgroundColor: 'rgba(241, 196, 15, 1)',
          data: dataValues301302
        },
        {
          label: '400, 401, 403, 404',
          borderWidth: 0,
          backgroundColor: 'rgba(230, 126, 34, 0.8)',
          hoverBackgroundColor: 'rgba(230, 126, 34, 1)',
          data: dataValues400401403404
        },
        {
          label: '50x',
          borderWidth: 0,
          backgroundColor: 'rgba(231, 76, 60, 0.8)',
          hoverBackgroundColor: 'rgba(231, 76, 60, 1)',
          data: dataValues50x
        }
      ]
    };

    let options = {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        xAxes: [{
          stacked: true,
          scaleLabel: {
            display: true,
            labelString: 'Time'
          }
        }],
        yAxes: [{
          stacked: true,
          scaleLabel: {
            display: true,
            labelString: 'Response Status Codes'
          }
        }]
      }
    };

    // Init chart
    new ChartJS($chart, { type: 'bar', data: data, options: options });
  }
}

export default Stats;
