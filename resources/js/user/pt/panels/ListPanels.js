import React from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import Pagination from "react-js-pagination";
import { DeletePanel, FetchPanels } from '../../../components/utils/Helpers';


class ListPanels extends React.Component {

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
            let response = await FetchPanels();
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
                    <td style={{verticalAlign: 'middle'}}>{element.name}</td>
                    <td style={{verticalAlign: 'middle'}}>{element?.readiness?.name || ""}</td>
                    <td style={{display: 'flex', flexDirection: 'column', verticalAlign: 'middle'}}>{
                        (element.lots && element.lots.length > 0) ?
                            element.lots.map(
                                (l, x) => <span className='badge py-2' key={l.name + "_" + x}>
                                    {l.name} ({l.participants} participants)
                                </span>) :
                            <div><label style={{ fontWeight: 'normal', color: 'black' }} className='badge badge-warning'>No lots found</label></div>
                    }</td>
                    <td style={{verticalAlign: 'middle'}}>{element.created_at ? new Date(element.created_at).toLocaleString() : '-'}</td>
                    {

                        <td style={{verticalAlign: 'middle'}}>
                            <a
                                onClick={
                                    () => {
                                        window.location.assign('/panels/edit/' + element.id)
                                    }
                                }
                                data-toggle="tooltip" data-placement="top" title="Edit Panel"
                                className="d-none d-sm-inline-block btn btn-sm btn-info shadow-sm text-white">
                                <i className="fas fa-edit"></i> Edit
                            </a> &nbsp;
                            <a
                                onClick={
                                    (ev) => {
                                        ev.preventDefault();
                                        ev.stopPropagation();
                                        window.confirm('Are you sure you wish to delete this item?') &&
                                        ( async () => {
                                            let response = await DeletePanel(element.id);
                                            if (response) {
                                                window.location.reload();
                                            }
                                        } )();
                                    }
                                }
                                data-toggle="tooltip" data-placement="top" title="Delete Panel"
                                className="d-none d-sm-inline-block btn btn-sm btn-danger shadow-sm text-white">
                                <i className="fas fa-trash"></i> Delete
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
                <h3 className="float-left">Panels</h3>
                <a style={{ "color": "white" }} type="button" href="panels/new" className="btn btn-info float-right">Add Panel</a>
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
                        className="form-control" placeholder="search panel"></input>
                </div>

                <table className="table table-striped table-bordered table-condensed table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Panel Name</th>
                            <th scope="col">Readiness Checklist</th>
                            <th scope="col">Lots</th>
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

export default ListPanels;

if (document.getElementById('list_panels_page')) {
    ReactDOM.render(<ListPanels />, document.getElementById('list_panels_page'));
}
// else{
//     console.log('list_panels_page not found');
// }