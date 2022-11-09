import React from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import Pagination from "react-js-pagination";
import { exportToExcel, FetchLotsByReadiness, } from '../../../components/utils/Helpers';
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
    }

    componentDidMount() {

        let pathname = window.location.pathname;
        let pathObject = matchPath(pathname, {
            path: `/readiness_participants/:readinessId`,
        });
        let readinessId = pathObject?.params?.readinessId || null;
        this.setState({
            readinessId: readinessId
        });
        if (readinessId) {
            (async () => {
                let response = await FetchLotsByReadiness(readinessId);
                this.setState({
                    data: response,
                    readiness: response[0].readiness
                });
                response.map((lot) => {
                    lot.participants.map((participant) => {
                        this.setState({
                            participants: [...this.state.participants, {
                                // ...participant,
                                lot_id: lot.id,
                                lot_name: lot.name,
                                id: participant.id,
                                name: participant.name + ' ' + participant.second_name,
                                email: participant.email,
                                phone_number: participant.phone_number,
                                is_active: participant.is_active,
                                lab_id: participant.lab.lab_id,
                                lab_code: participant.lab.mfl_code,
                                lab_name: participant.lab.lab_name,
                            }]
                        });
                    });
                });
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
                            <a className="float-left" href="/list-readiness">&larr; Go back</a>
                        </div>
                        <div className="col-sm-6">
                            <h3><b>{this.state.readiness?.name}</b> participants</h3>
                        </div>
                        <div className="col-sm-3">
                            <button type="button" className="btn btn-success btn-sm mx-1" onClick={() => {
                                if (this.state.participants && this.state.participants.length > 0) {
                                    let final_data = this.state.participants;
                                    exportToExcel(final_data, this.state.readiness?.name+' Participants');
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
                                    <th scope="col">Laboratory/Facility</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">Lot</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.participants.map((participant, index) => (
                                    <tr key={participant.id}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{participant.lab_name} {participant.lab_code && <span>({participant.lab_code})</span>}</td>
                                        <td>{participant.name}</td>
                                        <td>{participant.email}</td>
                                        <td>{participant.phone_number}</td>
                                        <td>{participant.lot_name}</td>
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

if (document.getElementById('list_readiness_participants')) {
    ReactDOM.render(<LotParticipants />, document.getElementById('list_readiness_participants'));
}