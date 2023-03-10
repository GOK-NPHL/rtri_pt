import React from 'react'
import { render } from 'react-dom'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'


class DashboardSubmissionSummaries extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            options: {
                colors: ['#2f7ed8', '#8bbc21', '#910000', '#1aadce',
                    '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'],

                chart: {
                    type: 'column'
                },
                title: {
                    text: 'PT Participants statistics'
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: [],
                    title: {
                        text: 'Round'
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Participants',
                        align: 'high'
                    },
                    labels: {
                        overflow: 'justify'
                    }
                },
                tooltip: {
                    valueSuffix: ''
                },
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x: -40,
                    y: 80,
                    floating: true,
                    borderWidth: 1,
                    backgroundColor:
                        Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
                    shadow: true
                },
                credits: {
                    enabled: false
                },
                series: []
                // [{
                //     name: 'Year 1800',
                //     data: [107, 31, 635, 203, 2]
                // }, {
                //     name: 'Year 1900',
                //     data: [133, 156, 947, 408, 6]
                // }, {
                //     name: 'Year 2000',
                //     data: [814, 841, 3714, 727, 31]
                // }, {
                //     name: 'Year 2016',
                //     data: [1216, 1001, 4436, 738, 40]
                // }]
            }
        }
    }

    componentDidMount() {

    }


    componentDidUpdate(prevProps, prevState) {
        if (prevProps.data != this.props.data) {
            let categories = [];
            let shipments = { name: 'Shipments', data: [] }
            let responses = { name: 'Responses', data: [] }

            for (const [key, element] of Object.entries(this.props.data)) {
                categories.push(key);
                shipments['data'].push(element['total_shipment']);
                responses['data'].push(element['total_responses']);
            }
            let series = [shipments, responses]
            this.setState({

                options: {
                    series: series,
                    xAxis: {
                        categories: categories
                    }
                }
            })


        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="card" >
                    <div className="card-header" style={{ "backgroundColor": "#2c3e50", "color": "white" }}>
                        PT Participants statistics
                    </div>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={this.state.options}
                    />
                </div>
            </React.Fragment>
        );
    }

}

export default DashboardSubmissionSummaries;