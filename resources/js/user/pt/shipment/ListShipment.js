import React from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import Pagination from "react-js-pagination";
import { FetchShipments, DeleteShipment } from '../../../components/utils/Helpers';


class ListShipment extends React.Component {

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
        this.fetchListing();
    }

    fetchListing() {
        (async () => {
            let response = await FetchShipments(this.props.userId, this.props.filterEmpty);
            this.setState({
                data: response
            });
        })();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.currentPage !== this.props.currentPage) {
            this.fetchListing(this.props.userId);
        }

        if (prevProps.userId !== this.props.userId) {
            this.fetchListing(this.props.userId);
        }
    }

    handlePageChange(pageNumber) {
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
                    <td style={{ verticalAlign: 'middle' }} className='text-center'>{element.round_name}</td>
                    <td style={{ verticalAlign: 'middle' }} className='text-center'>{element.code || element.shipment_code}</td>
                    <td style={{ verticalAlign: 'middle' }} className='text-center'>{element.pass_mark}</td>
                    {!this.props.isParticipant && <td style={{ verticalAlign: 'middle' }} className='text-center'>
                        {element?.panels?.map((panel, index) => (
                            <div className='d-block' key={panel.id + "_" + index}>
                                <span className='text-center' style={{ fontWeight: 'normal', fontSize: '0.88em', lineHeight: '1.7' }}>
                                    {panel?.name}&nbsp; &nbsp;({panel?.participant_count || 0} participants)
                                </span>
                            </div>
                        ))}
                    </td>}
                    <td style={{ verticalAlign: 'middle' }} className='text-center'>{new Date(element.updated_at).toLocaleString('en-GB')}</td>
                    <td style={{ verticalAlign: 'middle' }}>
                        {
                            this.props.isParticipant ?
                                <a
                                    onClick={() => {
                                        window.location.assign('/get-participant-shipment-response-performance/' + element.id)
                                    }}
                                    data-toggle="tooltip" data-placement="top" title="View performance report"
                                    style={{ 'marginRight': '5px' }}
                                    className="d-none d-sm-inline-block btn btn-sm btn-info shadow-sm text-white">
                                    <i className="fas fa-file-pdf"></i> Performance
                                </a>
                                :
                                <div style={{ display: 'flex wrap', alignItems: 'center', justifyContent: 'space-around', marginBottom: '3px', gap: '5px' }}>

                                    {
                                        this.props.page != 'report' ?
                                            <a href="#"
                                                onClick={
                                                    () => {
                                                        this.props.toggleView('edit', element.id);
                                                    }
                                                }
                                                style={{ height: 'auto', margin: '3px' }}
                                                className="d-none d-sm-inline-block btn btn-sm btn-info shadow-sm text-white">
                                                <i className="fas fa-edit"></i> Edit
                                            </a> : ''
                                    }
                                    <a
                                        onClick={() => {
                                            //// this.props.page != 'report' ? //// INVESTIGATE REASON FOR THIS
                                            true ?
                                                window.location.assign('get-shipment-responses/' + element.id) :
                                                window.location.assign('get-shipment-report-responses/' + element.id)
                                        }}
                                        style={{ height: 'auto', margin: '3px' }}
                                        data-toggle="tooltip" data-placement="top" title="View shipment responses"
                                        className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm text-white">
                                        <i className="fas fa-file"></i> View
                                    </a>
                                    <a
                                        onClick={
                                            (ev) => {
                                                ev.preventDefault();
                                                ev.stopPropagation();
                                                window.confirm('Are you sure you wish to delete this item?') &&
                                                    (async () => {
                                                        let response = await DeleteShipment(element.id);
                                                        if (response) {
                                                            window.location.reload();
                                                        }
                                                    })();
                                            }
                                        }
                                        style={{ height: 'auto', margin: '3px' }}
                                        data-toggle="tooltip" data-placement="top" title="Delete Lot"
                                        className="d-none d-sm-inline-block btn btn-sm btn-danger shadow-sm text-white">
                                        <i className="fas fa-trash"></i> Delete
                                    </a>
                                </div>
                        }


                    </td>

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
            {this.props.isShowNewShipmentPage ? <div className="col-sm-12 mb-3 mt-3"><h3 className="float-left">All Shipments</h3> </div> : ''}
            <div className='col-sm-12 col-md-12'>
                <div className="form-group mb-2">
                    <input type="text"
                        onChange={(event) => {
                            let currElementsTableEl = this.state.allTableElements.filter(elemnt =>
                                elemnt['props']['children'][1]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase()) ||
                                elemnt['props']['children'][2]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase())
                            );
                            this.updatedSearchItem(currElementsTableEl);
                        }}
                        className="form-control" placeholder="search shipment"></input>
                </div>

                <table className="table table-striped table-bordered table-condensed table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Round Name</th>
                            <th scope="col">Shipement Code</th>
                            <th scope="col">Pass Mark</th>
                            {!this.props.isParticipant && <th scope="col">Panels (&amp; Participant Count)</th>}
                            <th scope="col">Last Update</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.currElementsTableEl.slice(this.state.startTableData, this.state.endeTableData)}
                    </tbody>

                </table>
                <br />
                <Pagination
                    itemClass="page-item"
                    linkClass="page-link"
                    activePage={this.state.activePage}
                    itemsCountPerPage={10}
                    totalItemsCount={this.state.currElementsTableEl.length}
                    pageRangeDisplayed={5}
                    onChange={this.handlePageChange.bind(this)}
                />
            </div>
        </div>;

        return (
            <React.Fragment>
                {this.props.isShowEditShipmentPage ? <hr /> : ""}
                {this.props.isShowEditShipmentPage ? <h3>All Shipments</h3> : ""}
                {pageContent}
            </React.Fragment>
        );
    }

}

export default ListShipment;