import React from 'react';
import ReactDOM from 'react-dom';
import DualListBox from 'react-dual-listbox';
import { UpdatePanel, FetchLots, FetchPanel } from '../../../components/utils/Helpers';
import '../shipment/PtShipment.css';
import { v4 as uuidv4 } from 'uuid';
import { matchPath } from 'react-router';
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
            status: null,
        }
        this.savePanel = this.savePanel.bind(this);
        this.addSampleRow = this.addSampleRow.bind(this);
        this.deleteSampleRow = this.deleteSampleRow.bind(this);
        this.sampleReferenceResultChange = this.sampleReferenceResultChange.bind(this);
        this.sampleNameChange = this.sampleNameChange.bind(this);
    }



    ///////////////////////////////////<<<<<<<<<<<<<<<<<<////////////////////////////////////////
    /////////////////////////////////SAMPLE MANAGEMENT////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    deleteSampleRow(index) {
        let tableRows = this.state.tableRows;
        let pl_samples_ds = this.state?.payload?.samples;
        // if there is a 'deleted' attribute, set it to true, otherwise remove the element
        let pl_sample = pl_samples_ds.find(p=>p.index==index)
        console.log('deleteSampleRow', index, pl_sample);
        if(pl_sample && pl_sample?.deleted == 0 && pl_sample?.id){ // mark existing sample as deleted
            pl_sample.deleted = 1;
            pl_sample.name = null;
            pl_sample.reference_result = null;
        }else{
            pl_samples_ds = pl_samples_ds.filter(p=>p.index!=index);
        }
        // delete pl_samples_ds[index];
        // delete tableRows[index];
        tableRows = tableRows.filter((row, i) => row.props.index != index);
        this.setState({
            tableRows: tableRows,
            samplesNumber: this.state.samplesNumber - 1,
            payload: {
                ...this.state.payload,
                samples: pl_samples_ds.filter(pf => pf != null)
            }
        })
    }
    sampleReferenceResultChange(index, refResult) {
        let pl_samples_nc = this.state?.payload?.samples;
        let pl_sample = pl_samples_nc.find(p=>p.index==index)
        if (!pl_sample || pl_sample == null || pl_sample == undefined) {
            console.log('sample ', index, ' not found');
            if (index > pl_samples_nc.length) {
                pl_sample = pl_samples_nc[pl_samples_nc.length - 1];
            }
        } else {
            pl_sample.reference_result = refResult;
            pl_samples_nc.filter(p=>p.index==index)[0] = pl_sample;
            this.setState({
                payload: {
                    ...this.state.payload,
                    samples: pl_samples_nc.filter(pf => pf != null)
                }
            })
        }
    }
    sampleNameChange(index, name) {
        let pl_samples_nc = this.state?.payload?.samples;
        let pl_sample = pl_samples_nc.find(p=>p.index==index)
        if (!pl_sample || pl_sample == null || pl_sample == undefined) {
            console.log('sample ', index, ' not found');
            if (index > pl_samples_nc.length) {
                pl_sample = pl_samples_nc[pl_samples_nc.length - 1];
            }
        } else {
            pl_sample.name = name;
            pl_samples_nc.filter(p=>p.index==index)[0] = pl_sample;
            this.setState({
                payload: {
                    ...this.state.payload,
                    samples: pl_samples_nc.filter(pf => pf != null)
                }
            })
        }
    }
    addSampleRow(index, val) {
        console.log('addSampleRow', index, val);
        let tableRows = this.state.tableRows;

        // let samples = this.state.samples;
        let pl_samples_as = this.state?.payload?.samples;
        let newSample = {};
        newSample['index'] = index;
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
        // samples.push(newSample);
        pl_samples_as.push(newSample);
        this.setState({
            tableRows: tableRows,
            // samples: samples,
            samplesNumber: this.state.samplesNumber + 1,
            payload: {
                ...this.state.payload,
                samples: pl_samples_as.filter(pf => pf != null)
            }
        });
    }

    

    savePanel() {
        console.log('updatePanel', this.state.panelId, this.state.payload);
        (async () => {
            let response = await UpdatePanel(this.state.panelId, this.state.payload);
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
    //////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////SAMPLE MANAGEMENT////////////////////////////////////////
    //////////////////////////////////>>>>>>>>>>>>>/////////////////////////////////////////////

    componentDidMount() {
        let pathname = window.location.pathname;
        let pathObject = matchPath(pathname, {
            path: `/panels/edit/:panelId`,
        });
        let panelId = pathObject.params.panelId;
        this.setState({
            panelId: panelId
        });

        (async () => {
            FetchPanel(pathObject.params.panelId).then((response) => {
                this.setState({
                    payload: {
                        name: response.name,
                        samples: Array.from(response.samples, (sp, sx) => {
                            return {
                                id: sp.id,
                                index: sx,
                                name: sp.name,
                                reference_result: sp.reference_result,
                                deleted: 0
                            }
                        }),
                        lot_ids: Array.from(response.lots, l => l.id) || [],
                    }
                });
            }).then(() => {
                this.setState({
                    tableRows: this.state.payload.samples.map((sp, index) => {
                        return <ShipmentSample
                            key={uuidv4()}
                            index={index}
                            deleteSampleRow={this.deleteSampleRow}
                            result={sp.reference_result}
                            name={sp.name}
                            sampleReferenceResultChange={this.sampleReferenceResultChange}
                            sampleNameChange={this.sampleNameChange}
                        />
                    })
                });
            });
        })();

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
                                            <h3 className="text-bold">Edit Panel {this.state?.payload?.name || ''}</h3>
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
                                                        <input type="text" className="form-control" id="name" placeholder="Enter name"
                                                            defaultValue={this.state.payload && this.state.payload.name} onChange={ev => {
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

if (document.getElementById('edit_panel')) {
    ReactDOM.render(<AddPanels />, document.getElementById('edit_panel'));
}