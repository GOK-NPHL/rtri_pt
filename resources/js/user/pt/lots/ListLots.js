import React from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import Pagination from "react-js-pagination";
import { FetchLots } from '../../../components/utils/Helpers';


class ListLots extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
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

        (async () => {
            let response = await FetchLots();
            this.setState({
                data: response
            });
        })();

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
                    <td>{element.name}</td>
                    <td>{element.ending_ids}</td>
                    <td>{element?.participant_count || 0 }</td>
                    <td>{element.shipment['round_name'] || element.shipment_id}</td>
                    <td>{element.created_at ? new Date(element.created_at).toLocaleString() : '-'}</td>
                    {

                        <td>

                            <a
                                onClick={() => {
                                    window.location.assign('/lots/' + element.id + '/participants')
                                }}
                                style={{ 'marginRight': '5px' }}
                                data-toggle="tooltip" data-placement="top" title="View readiness responses"
                                className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm text-white">
                                <i className="fas fa-file"></i> View participants
                            </a>
                            <a
                                onClick={
                                    () => {
                                        window.location.assign('/lots/edit/' + element.id)
                                    }
                                }
                                data-toggle="tooltip" data-placement="top" title="Edit readiness"
                                className="d-none d-sm-inline-block btn btn-sm btn-info shadow-sm text-white">
                                <i className="fas fa-edit"></i> Edit
                            </a>

                        </td>
                    }

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
            <div className="col-sm-12 mb-3 mt-3">
                <h3 className="float-left">Lots</h3>
                <a style={{ "color": "white" }} type="button" href="lots/new" className="btn btn-info float-right">Add Lot</a>
            </div>
            <div className='col-sm-12 col-md-12'>
                <div className="form-group mb-2">
                    <input type="text"
                        onChange={(event) => {
                            console.log(this.state.allTableElements);
                            let currElementsTableEl = this.state.allTableElements.filter(elemnt =>
                                elemnt['props']['children'][1]['props']['children'].toString().toLowerCase().trim().includes(event.target.value.trim().toLowerCase()) ||
                                elemnt['props']['children'][2]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase()) 
                                // || elemnt['props']['children'][3]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase())
                            );
                            this.updatedSearchItem(currElementsTableEl);
                        }}
                        className="form-control" placeholder="search lot"></input>
                </div>

                <table className="table table-striped table-sm  table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Lot Name</th>
                            <th scope="col">Ending IDs</th>
                            <th scope="col">No. of participants</th>
                            <th scope="col">Shipment/Round</th>
                            <th scope="col">Created on</th>
                            <th scope="col">Action</th>
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

export default ListLots;

if (document.getElementById('list_lots')) {
    ReactDOM.render(<ListLots />, document.getElementById('list_lots'));
}