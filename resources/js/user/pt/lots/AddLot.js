import React from 'react';
import ReactDOM from 'react-dom';
import { SaveLot, FetchShipments, FetchuserId } from '../../../components/utils/Helpers';
// import { v4 as uuidv4 } from 'uuid';

class AddLots extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            payload: null,
            shipments: [],
            userId: '156f41ed97',
            message: null,
            status: null
        }
        this.saveLot = this.saveLot.bind(this);
    }

    saveLot() {
        // console.log('saveLot', this.state.payload);
        (async () => {
            let response = await SaveLot({
                ...this.state.payload,
                ending_ids: this.state.payload.ending_ids.join(',')//JSON.stringify(this.state.payload.ending_ids),
            });
            // console.log('response', response);
            this.setState({
                message: response.status == 200 ? 'Lot updated successfully' : 'Error updating lot',
                status: response.status
            });
            if (response.status === 200) {
                this.setState({
                    payload: null
                });
            }

        })();

    }

    componentDidMount() {
        (async () => {
            let response = await FetchShipments(this.state.userId, 0);
            this.setState({
                shipments: response
            });
        })();
    }

    render() {


        return (
            <div className='container'>
                <div className='row'>
                    {/* <div className='col-md-3'>
                        <small>
                            <details open>
                                <summary>this.state</summary>
                                <pre>
                                    {JSON.stringify(this.state, null, 2)}
                                </pre>
                            </details>
                        </small>
                    </div>
                    <div className='col-md-9'> */}
                        <div className='col-md-12'>
                        <div className='col-md-12' style={{ margin: '8px 2px' }}>
                            <a href='/lots'> &larr; Go back</a>
                        </div>
                        <div className='row'>
                            <div className="card">
                                <div className="card-body">
                                    <div className="row text-center">
                                        <div className="col-md-12">
                                            <h3 className="text-bold">New Lot</h3>
                                            {/* alerts */}
                                            {this.state.status && this.state.message && <div className='row'>
                                                <div className='col-md-12'>
                                                    <div className={"alert alert-default-" + (this.state.status == 200 ? 'success' :
                                                        ['success', 'info', 'warning'].includes(this.state.status) ? this.state.status : [500, 400, 404, 502].includes(this.state.status) ? 'danger' : 'info')} role="alert">
                                                        <button type="button" className="close" data-dismiss="alert" aria-hidden="true">×</button>
                                                        {this.state.message || "Alert"}
                                                    </div>
                                                </div>
                                            </div>}
                                            {/* <div className='alert alert-default-primary'>
                                                <button type="button" className="close" data-dismiss="alert" aria-hidden="true">×</button>
                                                This is used to randomize the selection of participants for a round. We will use the <b>ending IDs</b> below to pick from the participants.
                                            </div> */}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <form className='col-md-12'>
                                            <div className="row">
                                                <div className='col-md-12'>
                                                    <div className="form-group">
                                                        <label htmlFor="name">Name</label>
                                                        <input type="text" className="form-control" id="name" placeholder="Enter name" onChange={ev => {
                                                            this.setState({
                                                                payload: {
                                                                    ...this.state.payload || {},
                                                                    name: ev.target.value
                                                                }
                                                            });
                                                        }} />
                                                    </div>
                                                </div>
                                                <div className='col-md-12'>
                                                    <div className="form-group">
                                                        <label htmlFor="description">Shipment</label>
                                                        <select className='form-control' id='shipment' onChange={ev => {
                                                            this.setState({
                                                                payload: {
                                                                    ...this.state.payload || {},
                                                                    shipment_id: parseInt(ev.target.value)
                                                                }
                                                            });
                                                        }}>
                                                            <option value=''>Select Shipment</option>
                                                            {this.state.shipments.length > 0 && this.state.shipments.map((shipment, index) => {
                                                                return (
                                                                    <option key={index} value={shipment.id}>{shipment.round_name}</option>
                                                                )
                                                            })}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className='col-md-12'>
                                                    <div className="form-group">
                                                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', marginBottom: '6px', gap: '5px' }}>
                                                            <label className='control-label mb-0' htmlFor="description">Ending IDs (pick 2 random)</label>
                                                            { this.state.payload && this.state.payload.ending_ids && this.state.payload.ending_ids.length > 2
                                                            && <div><small className='alert alert-default-danger' style={{ padding: '1px 2px' }}>Please select only 2</small></div>}
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '15px', flexDirection: 'row' }}>
                                                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => {
                                                                return (
                                                                    <div key={item} style={{ display: 'flex', gap: '3px', flexDirection: 'row' }}>
                                                                        <input type="checkbox" id="ending_ids" placeholder="Enter ending ids" name='ending_ids' value={item} onInput={ev => {
                                                                            if (ev.target.checked) {
                                                                                this.setState({
                                                                                    payload: {
                                                                                        ...this.state.payload || {},
                                                                                        ending_ids: [
                                                                                            ...this.state.payload?.ending_ids || [],
                                                                                            Number(ev.target.value)
                                                                                        ]
                                                                                    }
                                                                                });
                                                                            } else {
                                                                                this.setState({
                                                                                    payload: {
                                                                                        ...this.state.payload || {},
                                                                                        ending_ids: this.state.payload?.ending_ids?.filter(id => id != Number(ev.target.value))
                                                                                    }
                                                                                });
                                                                            }
                                                                        }} />
                                                                        {' '}{item}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-md-12 mt-3'>
                                                    <input type="submit" disabled={
                                                        !this.state.payload?.name || !this.state.payload?.shipment_id || !this.state.payload?.ending_ids || (this.state.payload?.ending_ids.length < 2 || this.state.payload?.ending_ids.length > 2)
                                                    } className="btn btn-primary" value='Save' onClick={(ev) => {
                                                        ev.preventDefault();
                                                        this.saveLot();
                                                    }} />
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> {/* end of col-md-8 */}
                </div> {/* end row */}
            </div> // end container
        )
    }

}

export default AddLots;

if (document.getElementById('add_lot')) {
    ReactDOM.render(<AddLots />, document.getElementById('add_lot'));
}