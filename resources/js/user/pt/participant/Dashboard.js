import React from 'react';
import ReactDOM from 'react-dom';
import Pagination from "react-js-pagination";
import { FetchUserSamples } from '../../../components/utils/Helpers';
import SubmitResults from './SubmitResults';


class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {},
            currElementsTableEl: [],
            allTableElements: [],
            selectedElement: null,
            allowedPermissions: [],
            userActionState: 'userList',
            startTableData: 0,
            endeTableData: 10,
            activePage: 1,
            page: 'list'
        }
        this.handlePageChange = this.handlePageChange.bind(this);
        this.toggleView = this.toggleView.bind(this);

    }

    componentDidMount() {

        (async () => {
            let response = await FetchUserSamples();
            console.log(response);
            this.setState({
                data: response
            })
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

    toggleView(page) {
        this.setState({
            page: page
        });
    }

    render() {
        const imgStyle = {
            width: "100%"
        };

        const rowStle = {
            marginBottom: "5px"
        };

        let tableElem = [];

        console.log("trying");
        console.log(this.state.data);
        if (Object.keys(this.state.data).length != 0 && this.state.page == 'list') {
            let index = 1;

            for (const [key, element] of Object.entries(this.state.data)) {

                tableElem.push(<tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{element.round_name}</td>
                    <td>{element.code}</td>
                    <td>{element.end_date}</td>

                    {

                        <td>

                            <button
                                onClick={() => {
                                    this.setState({
                                        selectedElement: element,
                                        page: 'edit'
                                    });
                                }}
                                type="button"
                                className="btn btn-success">
                                <i className="far fa-edit"></i> View/Edit
                            </button>
                            {/* <a
                                onClick={() => {
                                    this.setState({
                                        selectedElement: element
                                    });
                                    $('#deleteConfirmModal').modal('toggle');
                                }} className="d-none d-sm-inline-block btn btn-sm btn-danger shadow-sm">
                                <i className="fas fa-user-times"></i>
                            </a> */}

                        </td>
                    }

                </tr>
                );
                index += 1;
            }
            if (this.state.allTableElements.length == 0) {
                this.setState({
                    allTableElements: tableElem,
                    currElementsTableEl: tableElem
                })
            }

        }

        let pageContent = <div id='user_table' className='row'>
            <div className="col-sm-12 mt-3">
                <h3 className="float-left">RTRI PT Samples</h3>

            </div>

            <div className='col-sm-12 col-md-12'>
                <hr />
                <div className="form-group mb-2">
                    <input type="text"
                        onChange={(event) => {
                            let currElementsTableEl = this.state.allTableElements.filter(elemnt =>
                                elemnt['props']['children'][1]['props']['children'].toString().toLowerCase().trim().includes(event.target.value.trim().toLowerCase()) ||
                                elemnt['props']['children'][2]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase())
                            );
                            this.updatedSearchItem(currElementsTableEl);
                        }}
                        className="form-control float-right w-25 mb-1" placeholder="search shipment"></input>
                </div>

                <table className="table table-striped table-sm  table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Round</th>
                            <th scope="col">Code</th>
                            <th scope="col">End Date</th>
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

        if (this.state.page == 'edit') {
            pageContent = <SubmitResults shipment={this.state.selectedElement} toggleView={this.toggleView} />
        }

        return (
            <React.Fragment>
                {pageContent}
            </React.Fragment>
        );
    }

}


export default Dashboard;

if (document.getElementById('participant-pt-dashboard')) {
    ReactDOM.render(<Dashboard />, document.getElementById('participant-pt-dashboard'));
}