import React from 'react';
import ReactDOM from 'react-dom';
import { FetchSubmissions } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import AddShipement from './AddShipment';
import ListShipment from './ListShipment';
import EditShipment from './EditShipment';


class PtShipment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowNewShipmentPage: false,
            isShowEditShipmentPage: false,
            newShipmentButtonText: 'Add new PT shipment',
            shipmentId: null,
            currentPage: ''
        }
        this.toggleView = this.toggleView.bind(this);
    }

    componentDidMount() {

    }

    toggleView(page, shipmentId) {

        if (page == 'edit') {
            this.setState({
                isShowEditShipmentPage: !this.state.isShowEditShipmentPage,
                shipmentId: shipmentId,
                currentPage: 'edit'
            })
        } else if (page == 'add') {
            this.setState({
                isShowNewShipmentPage: !this.state.isShowNewShipmentPage,
                currentPage: 'add'
            })
        }

    }

    render() {

        return (
            <React.Fragment>
                <div id='user_table' className='row'>
                    <div className="col-sm-12 mb-3 mt-3">
                        {this.state.isShowNewShipmentPage ? <h3 className="float-left">New Shipment</h3> : ''}
                        {this.state.isShowEditShipmentPage ? <h3 className="float-left">Edit Shipment</h3> : ''}
                        {!(this.state.isShowNewShipmentPage) && !(this.state.isShowEditShipmentPage)
                            ? <h3 className="float-left">All Shipments</h3> : ''}
                        <a style={{ "color": "white" }}
                            onClick={

                                () => {
                                    if (this.state.isShowEditShipmentPage) {
                                        this.toggleView('edit');
                                    } else if (this.state.isShowNewShipmentPage) {
                                        this.toggleView('add');
                                    } else {
                                        this.toggleView('add');
                                    }
                                }
                            }
                            type="button" href="#"
                            className="btn btn-info 
                float-right">{this.state.isShowNewShipmentPage ? 'Close open shipment' : 'Add new PT shipment'}</a>
                    </div>
                </div>
                {this.state.isShowNewShipmentPage ? <AddShipement toggleView={this.toggleView} /> : ''}
                {this.state.isShowEditShipmentPage ? <EditShipment id={this.state.shipmentId} toggleView={this.toggleView} /> : ''}
                <ListShipment isShowEditShipmentPage={this.state.isShowEditShipmentPage} toggleView={this.toggleView} isShowNewShipmentPage={this.state.isShowNewShipmentPage} />
            </React.Fragment>
        );
    }

}

export default PtShipment;

if (document.getElementById('pt_shipment')) {
    ReactDOM.render(<PtShipment />, document.getElementById('pt_shipment'));
}