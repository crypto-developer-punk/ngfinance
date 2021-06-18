import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import styles from './pieChart.css'

const pieColors = (function () {
    var colors = [],
        base = Highcharts.getOptions().colors[10],
        i;

    for (i = 0; i < 10; i += 1) {
        // Start out with a darkened base color (negative brighten), and end
        // up with a much brighter color
        colors.push(Highcharts.color(base).brighten((i - 3) / 7).get());
    }
    return colors;
}());

const options = {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: ''
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            colors: pieColors,
            dataLabels: {
                enabled: true,
                format: '{point.percentage:.1f} %',
                distance: -30,
                filter: {
                    property: 'percentage',
                    operator: '>',
                    value: 4
                }
            },
            showInLegend: true
        }
    },
    credits: {
        enabled: false
    },
    series: [{
        name: '$PAINT Token',
        colorByPoint: true,
        data: [{
            name: 'Token Sale: 75%',
            y: 75,
            sliced: true,
            selected: true
        }, {
            name: 'Team: 15%',
            y: 4.67
        }, {
            name: 'Partners: 5%',
            y: 5
        }, {
            name: 'Treasury Fund: 5%',
            y: 5
        }]
    }]
};

const PieChart = () => {
    return (
        <div data-aos="fade-up">
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};

export default PieChart;

