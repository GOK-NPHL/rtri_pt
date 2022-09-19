import React from 'react';
import ReactDOM from 'react-dom';
import DualListBox from 'react-dual-listbox';
import { SavePanel, FetchLots } from '../../../components/utils/Helpers';
import '../shipment/PtShipment.css';
import { v4 as uuidv4 } from 'uuid';
import ReactTooltip from 'react-tooltip';
import ShipmentSample from '../shipment/ShipmentSample';

class AddPanels extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            payload: null,
            lots: [],
            samples: [],
            samplesNumber: 0,
            tableRows: [], //samples elements,
            message: null,
            status: null
        }
        this.savePanel = this.savePanel.bind(this);
        this.addSampleRow = this.addSampleRow.bind(this);
        this.deleteSampleRow = this.deleteSampleRow.bind(this);
        this.sampleReferenceResultChange = this.sampleReferenceResultChange.bind(this);
        this.sampleNameChange = this.sampleNameChange.bind(this);
    }

    savePanel() {
        // console.log('savePanel', this.state.payload);
        (async () => {
            let response = await SavePanel({
                ...this.state.payload,
                lot_ids: this.state.payload.lot_ids.join(',')//JSON.stringify(this.state.payload.lot_ids),
            });
            // console.log('response', response);
            this.setState({
                message: response.status == 200 ? 'Panel updated successfully' : 'Error updating panel',
                status: response.status
            });
            if (response.status === 200) {
                this.setState({
                    payload: null
                });
            }

        })();

    }



    ///////////////////////////////////<<<<<<<<<<<<<<<<<<////////////////////////////////////////
    /////////////////////////////////SAMPLE MANAGEMENT////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    deleteSampleRow(index) {

        let tableRows = this.state.tableRows;
        let samples = this.state.samples;
        delete samples[index];
        delete tableRows[index];
        this.setState({
            tableRows: tableRows,
            samples: samples,
            samplesNumber: this.state.samplesNumber - 1
        })
    }
    sampleReferenceResultChange(index, refResult) {
        let samples = this.state.samples;
        let sample = samples[index];
        if (sample) {
            sample['reference_result'] = refResult;
            samples[index] = sample;
            this.setState({
                samples: samples
            })
        }
    }
    sampleNameChange(index, name) {
        let samples = this.state.samples;
        let sample = samples[index];
        if (sample) {
            sample['name'] = name;
            samples[index] = sample;
            this.setState({
                samples: samples
            })
        } else {
            console.log('sample ', name, ' not found');
        }
    }
    addSampleRow(index, val) {
        let tableRows = this.state.tableRows;

        let samples = this.state.samples;
        let newSample = {};
        newSample['name'] = '';
        newSample['reference_result'] = '';

        tableRows.push(<ShipmentSample
            key={uuidv4()}
            index={index}
            deleteSampleRow={this.deleteSampleRow}
            result={val ? val.reference_result : ''}
            name={val ? val.name : ''}
            sampleReferenceResultChange={this.sampleReferenceResultChange}
            sampleNameChange={this.sampleNameChange}
        />);
        samples.push(newSample);
        this.setState({
            tableRows: tableRows,
            samples: samples,
            samplesNumber: this.state.samplesNumber + 1,
            payload: {
                ...this.state.payload,
                samples: samples
            }
        });
    }

    savePanel() {
        console.log('savePanel', this.state.payload);
        (async () => {
            let response = await SavePanel(this.state.payload);
            // console.log('response', response);
            this.setState({
                message: response.status == 200 ? 'Panel saved successfully' : 'Error saving panel',
                status: response.status
            });
            if (response.status === 200) {
                this.setState({
                    payload: null
                });
            }

        })();

    }
    //////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////SAMPLE MANAGEMENT////////////////////////////////////////
    //////////////////////////////////>>>>>>>>>>>>>/////////////////////////////////////////////

    componentDidMount() {
        (async () => {
            let response = await FetchLots();
            this.setState({
                lots: response
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
                            <a href='/panels'> &larr; Go back</a>
                        </div>
                        <div className='row'>
                            <div className="card">
                                <div className="card-body">
                                    <div className="row text-center">
                                        <div className="col-md-12">
                                            <h3 className="text-bold">New Panel</h3>
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
                                                        <label className='mt-3' htmlFor="description">Lots</label>
                                                        &nbsp;<small>(Randomized participant groups)</small>
                                                        <DualListBox
                                                            canFilter
                                                            options={Array.from(this.state.lots).map(lot => {
                                                                return {
                                                                    value: lot.id,
                                                                    label: lot.name + ' (Readiness: ' + lot.readiness_name + ', Participants: ' + lot.participant_count + ')'
                                                                }
                                                            })}
                                                            selected={(this.state.payload?.lot_ids && this.state.payload?.lot_ids.length > 0) ? this.state.payload.lot_ids : []}
                                                            onChange={(selected) => {
                                                                this.setState({
                                                                    lot_ids: selected,
                                                                    payload: {
                                                                        ...this.state.payload || {},
                                                                        lot_ids: selected
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* //////////////////<<<<<<<<<///////////////// */}
                                                {/* /////////////////SAMPLE STUFF/////////////// */}
                                                {/* //////////////////////////////////////////// */}
                                                <div className='col-md-12'>
                                                    <div className="form-row bg-white">
                                                        <label className='mt-3'>Sample results</label>
                                                        <div className="col-sm-12">
                                                            <table className="table unstrip table-bordered table-sm ">
                                                                <thead>
                                                                    <tr>
                                                                        <th scope="col">Sample *</th>
                                                                        <th scope="col">Reference result *</th>
                                                                        <th scope="col">Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>

                                                                    {this.state.tableRows.map((row) => {
                                                                        if (row != undefined)
                                                                            return row;
                                                                    })}
                                                                    <tr>
                                                                        <td>
                                                                            <a onClick={() => {
                                                                                this.addSampleRow(this.state.tableRows.length)
                                                                            }}>
                                                                                <ReactTooltip />
                                                                                <i data-tip="Add sample" style={{ "color": "blue" }} className="fas fa-plus-circle fa-2x"></i>
                                                                            </a>
                                                                        </td>
                                                                    </tr>

                                                                </tbody>
                                                            </table>
                                                        </div>

                                                    </div>
                                                </div>
                                                {/* //////////////////////////////////////////// */}
                                                {/* /////////////////SAMPLE STUFF/////////////// */}
                                                {/* //////////////////>>>>>>>>>///////////////// */}




                                                <div className='col-md-12 mt-3 text-center'>
                                                    <input type="submit" disabled={
                                                        !this.state.payload?.name || !this.state.payload?.lot_ids || this.state.payload?.lot_ids.length < 1 || !this.state?.payload?.samples || this.state?.payload?.samples.length < 1
                                                    } className="btn btn-primary" value='Save Panel' onClick={(ev) => {
                                                        ev.preventDefault();
                                                        this.savePanel();
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

export default AddPanels;

if (document.getElementById('add_panel')) {
    ReactDOM.render(<AddPanels />, document.getElementById('add_panel'));
}