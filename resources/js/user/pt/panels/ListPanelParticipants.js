import React from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import Pagination from "react-js-pagination";
import { exportToExcel, FetchPanel, } from '../../../components/utils/Helpers';
import { matchPath } from 'react-router';


class LotParticipants extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            participants: [],
            lot: {},
            currElementsTableEl: [],
            allTableElements: [],
            selectedElement: null,
            allowedPermissions: [],
            userActionState: 'userList',
            startTableData: 0,
            endeTableData: 10,
            activePage: 1,
        }
        this.handlePageChange = this.handlePageChange.bind(this)
        this.processLinelist = this.processLinelist.bind(this)
    }


    processLinelist(panel) {
        let line_list = [];
        // data.map((panel, index) => {
            panel.lots.map((lot,li) => {
                lot.participants_list.map((person,li) => {
                    line_list.push({
                        // panel_id: panel?.id,
                        panel: panel?.name,
                        name: person?.name + ' ' + person?.second_name,
                        email: person?.email,
                        phone: person?.phone_number,
                        lab_name: person?.lab?.lab_name || person?.lab?.institute_name,
                        mfl_code: person?.lab?.mfl_code
                    })
                })
            })
        // });
        this.setState({
            participants: line_list
        })
    }

    componentDidMount() {

        let pathname = window.location.pathname;
        let pathObject = matchPath(pathname, {
            path: `/panels/:panelId/participants`,
        });
        let panelId = pathObject?.params?.panelId || null;
        this.setState({
            panelId: panelId
        });
        if (panelId) {
            (async () => {
                let response = await FetchPanel(panelId);
                this.setState({
                    data: response,
                });
                this.processLinelist(response);
            })();


            let tableElem = [];

            if (this.state.participants.length > 0) {
                this.state.participants.map((element, index) => {
                    tableElem.push(<tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{element.lab_name} {element.lab_code && <span>({element.lab_code})</span>}</td>
                        <td>{element.name}</td>
                        <td>{element.email}</td>
                        <td>{element.phone_number}</td>
                        <td>{element.lot_name}</td>
                    </tr>
                    );
                });
                if (this.state.allTableElements.length == 0) {
                    this.setState({
                        allTableElements: tableElem,
                        currElementsTableEl: tableElem
                    })
                }
            }
        }
    }



    handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        let pgNumber = pageNumber * 10 + 1;
        this.setState({
            startTableData: pgNumber - 11,
            endeTableData: pgNumber - 1,
            activePage: pageNumber
        });
    }

    updatedSearchItem(currElementsTableEl) {
        this.setState({
            currElementsTableEl: currElementsTableEl,
            activePage: 1,
            startTableData: 0,
            endeTableData: 10,
        })
    }

    render() {

        // return (
        //     <div className='container'>
        //         <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(this.state.participants, null, 2)}</pre>
        //     </div>
        // )

        return (
            <React.Fragment>
                <div id='user_table' className='row'>
                    <div className="row w-100 mb-3 mt-3">
                        <div className="col-sm-3">
                            <a className="float-left" href="/pt_panels">&larr; Go back</a>
                        </div>
                        <div className="col-sm-6">
                            <h3><b>{this.state.data?.name}</b> Participants</h3>
                        </div>
                        <div className="col-sm-3">
                            <button type="button" className="btn btn-success btn-sm mx-1" onClick={() => {
                                if (this.state.participants && this.state.participants.length > 0) {
                                    let final_data = this.state.participants;
                                    exportToExcel(final_data, this.state.data?.name+' Participants');
                                } else {
                                    console.error('No data to export');
                                    alert('No data to export')
                                }
                            }}>
                                <i className='fa fa-download'></i>&nbsp;
                                Excel/CSV
                            </button>
                        </div>
                    </div>
                    <div className='col-sm-12 col-md-12'>
                        <div className="form-group mb-2">
                            <input type="text"
                                onChange={(event) => {
                                    console.log(this.state.allTableElements);
                                    let currElementsTableEl = this.state.allTableElements.filter(elemnt =>
                                        elemnt['props']['children'][1]['props']['children'].toString().toLowerCase().trim().includes(event.target.value.trim().toLowerCase()) ||
                                        elemnt['props']['children'][2]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase()) ||
                                        elemnt['props']['children'][3]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase()) ||
                                        elemnt['props']['children'][4]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase())
                                    );
                                    this.updatedSearchItem(currElementsTableEl);
                                }}
                                className="form-control" style={{ display: 'none' }} placeholder="search personel"></input>
                        </div>

                        <table className="table table-striped table-sm  table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Panel</th>
                                    <th scope="col">Laboratory/Facility</th>
                                    <th scope="col">MFL Code</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Phone</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.participants.map((participant, index) => (
                                    <tr key={participant.id}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{participant.panel}</td>
                                        <td>{participant?.lab_name}</td>
                                        <td>{participant?.mfl_code}</td>
                                        <td>{participant.name}</td>
                                        <td>{participant.email}</td>
                                        <td>{participant.phone}</td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                        <br />
                    </div>
                </div>
            </React.Fragment>
        );
    }

}

export default LotParticipants;

if (document.getElementById('list_panel_participants')) {
    ReactDOM.render(<LotParticipants />, document.getElementById('list_panel_participants'));
}