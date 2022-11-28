import React from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import Pagination from "react-js-pagination";
import { FetchLotParticipants, FetchLot } from '../../../components/utils/Helpers';
import { matchPath } from 'react-router';


class LotParticipants extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
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
            path: `/lots/:lotId/participants`,
        });
        let lotId = pathObject?.params?.lotId || null;
        this.setState({
            lotId: lotId
        });
        if (lotId) {
            (async () => {
                let response = await FetchLot(lotId);
                this.setState({
                    lot: {
                        ...response,
                        ending_ids: Array.from(response.ending_ids.split(','), Number)
                    }
                });
            })();
            (async () => {
                let response = await FetchLotParticipants(lotId);
                this.setState({
                    data: response
                });
            })();
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
        const imgStyle = {
            width: "100%"
        };

        const rowStle = {
            marginBottom: "5px"
        };

        let tableElem = [];

        if (this.state.data.length > 0) {

            this.state.data.map((element, index) => {
                tableElem.push(<tr key={index}>
                    <th scope="row">{index + 1}</th>
                    {/* <td colSpan={5}>{JSON.stringify(element)}</td> */}
                    <td>{element.lab_name}</td>
                    <td>{element.name} {element.second_name}</td>
                    <td>{element.email}</td>
                    <td>{element.phone_number}</td>
                    <td>{element.mfl_code}</td>

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


        let pageContent = <div id='user_table' className='row'>
            <div className="row w-100 mb-3 mt-3">
                <div className="col-sm-3">
                    <a className="float-left" href="/lots">&larr; Go back</a>
                </div>
                <div className="col-sm-6">
                    <h3>Lot participants</h3>
                </div>
                <div className="col-sm-3">
                    <a style={{ "color": "white" }} type="button" href="lots/new" className="btn btn-info float-right">Add Lot</a>
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
                        className="form-control" style={{display:'none'}} placeholder="search personel"></input>
                </div>

                <table className="table table-striped table-sm  table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Laboratory/Facility</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Phone</th>
                            <th scope="col">MFL Code</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.currElementsTableEl.slice(this.state.startTableData, this.state.endeTableData)}
                    </tbody>

                </table>
                <br />
                {/* <Pagination
                    itemClass="page-item"
                    linkClass="page-link"
                    activePage={this.state.activePage}
                    itemsCountPerPage={10}
                    totalItemsCount={this.state.currElementsTableEl.length}
                    pageRangeDisplayed={5}
                    onChange={this.handlePageChange.bind(this)}
                /> */}
            </div>
        </div>;

        return (
            <React.Fragment>
                {pageContent}
            </React.Fragment>
        );
    }

}

export default LotParticipants;

if (document.getElementById('list_lot_participants')) {
    ReactDOM.render(<LotParticipants />, document.getElementById('list_lot_participants'));
}