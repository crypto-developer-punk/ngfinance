import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const pieColors = (function () {
    var colors = [],
        base = Highcharts.getOptions().colors[0],
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
        name: 'Token distribution',
        colorByPoint: true,
        data: [{
            name: 'Token Sale: 61.41%',
            y: 61.41,
            sliced: true,
            selected: true
        }, {
            name: 'Community Mining: 11.84%',
            y: 11.84
        }, {
            name: 'Liquidity Fund: 10.85%',
            y: 10.85
        }, {
            name: 'Team: 4.67%',
            y: 4.67
        }, {
            name: 'Team: 4.18%',
            y: 4.18
        }, {
            name: 'Tresury Fund: 1.64%',
            y: 1.64
        }]
    }]
};

const PieChart = () => {
    return (
        <div>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};

export default PieChart;

