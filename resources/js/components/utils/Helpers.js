import { settings } from './Settings'

const axios = require('axios');

let cache = {
    orgunitList: null,

}

export async function SaveSubmission(submission, ptFile) {

    try {
        const formData = new FormData();
        formData.append('file', ptFile);
        formData.append('submission', JSON.stringify(submission));
        let response = await axios.post(`${settings.serverBaseApi}/save_submission`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        // const response = await axios({
        //     method: 'post',
        //     url: `${settings.serverBaseApi}/save_submission`,
        //     data: {
        //         submission: submission,
        //     }
        // });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err);
        return err.response
    }
}


export async function FetchSubmissions() {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_submissions`);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }

}

export async function FetchUserSamples() {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_user_samples`);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }

}

export async function FetchSampleResponseResultById(id) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_sample_response_result/` + id);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }

}

export async function FetchReadnessSurvey() {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_readiness_survey`);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }

}

export async function FetchReadnessSurveyById(readinessId) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_readiness_survey_by_id/` + readinessId);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }

}

export async function FetchReadnessSurveyByIdAndLab(readinessId, labId) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_readiness_survey_by_id_and_labid/` + readinessId + '/' + labId);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }

}

export async function FetchCurrentParticipantDemographics(id) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_participant_demographics/` + id);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }

}

export async function FetchSubmission(shipmentId) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_submission_by_id/` + shipmentId);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }

}

export async function UpdateSubmission(submission) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/update_submission`,
            data: {
                submission: submission,
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err);
        return err.response
    }
}


export async function UpdateOwnBio(personel) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/own_bio_update`,
            data: {
                personel: personel,
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err);
        return err.response
    }
}

export async function FetchAdminUsers() {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_admin_users`);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }

}

export async function FetchAdminUser(userId) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_admin_user/` + userId);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }

}

export async function SaveAdminUser(user) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/create_admin`,
            data: {
                user: user,
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err);
        return err.response
    }
}

export async function UpdateAdminUser(user) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/edit_admin`,
            data: {
                user: user,
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err);
        return err.response
    }
}

export async function FetchParticipantList() {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_participants`);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function FetchParticipant(labId) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_participant/` + labId);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function SaveParticipant(lab) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/create_participant`,
            data: {
                lab: lab,
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err);
        return err.response
    }
}

export async function EditParticipant(lab) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/edit_participant`,
            data: {
                lab: lab,
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err);
        return err.response
    }
}


export async function FetchCounties() {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_counties/`);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function FetchLabPersonel() {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_lab_personel`);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function FetchLabPersonelById(id) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_lab_personel/` + id);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}


export async function SaveLabPersonel(personel) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/create_lab_personel`,
            data: {
                personel: personel,
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err);
        return err.response
    }
}

export async function getAMresource(resource, id) {
    try {
        let url = `${settings.serverBaseApi}/access-management/${resource}`
        if (id && id !== '') {
            url += `/${id}`
        }
        let response = await axios(url);
        return response;
    } catch (err) {
        console.log(err);
        return err.response
    }
}

export async function saveAMresource(payload, resource) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/access-management/${resource}`,
            data: {
                ...payload
            }
        });
        return response;
    } catch (err) {
        console.log(err);
        return err.response
    }
}

export async function updateAMresource(payload, resource, id) {
    try {
        const response = await axios({
            method: 'put',
            url: `${settings.serverBaseApi}/access-management/${resource}/` + id,
            data: {
                ...payload
            }
        });
        return response;
    } catch (err) {
        console.log(err);
        return err.response
    }
}
export async function deleteAMresource(payload, resource, id) {
    try {
        const response = await axios({
            method: 'delete',
            url: `${settings.serverBaseApi}/access-management/${resource}/` + id,
            data: {
                ...payload
            }
        });
        return response;
    } catch (err) {
        console.log(err);
        return err.response
    }
}

export async function FetchAuthorities() {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/authorities`);
        const authoritiesList = response.data;
        return authoritiesList;
    } catch (err) {
        // Handle Error Here
        return err.response
    }

}

export async function FetchUserAuthorities() {

    try {
        let response = await axios.get(`${settings.serverBaseApi}/user_authorities`);
        // let response = await axios.get(`${settings.serverBaseApi}/access-management/permissions`);
        return response.data;
    } catch (err) {
        // Handle Error Here
        return err.response
    }

}


export async function FetchRoles() {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/roles`);
        const rolesList = response.data;
        return rolesList;
    } catch (err) {
        // Handle Error Here
        return err.response
    }

}

export async function SaveRole(roleName, authoritiesSelected) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/save_role`,
            data: {
                name: roleName,
                authoritiesSelected: authoritiesSelected
            }
        });
        console.log("saved role");
    } catch (err) {
        // Handle Error Here
        console.log(err);
        return err.response
    }
}

export async function DeleteRole(roleId) {
    let response = '';
    try {
        response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/delete_role`,
            data: {
                role_id: roleId,
            }

        });
        return response;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}


export async function UpdateRole(role_id, roleName, authoritiesSelected) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/update_role`,
            data: {
                role_id: role_id,
                name: roleName,
                authoritiesSelected: authoritiesSelected
            }
        });
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function UpdateLabPersonel(personel) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/edit_lab_personel`,
            data: {
                personel: personel,
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err);
        return err.response
    }
}

export async function SaveReadiness(readiness) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/create_readiness`,
            data: {
                readiness: readiness,
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err.response);
        return err.response
    }
}

export async function UpdateReadiness(readiness) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/edit_readiness`,
            data: {
                readiness: readiness,
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err.response);
        return err.response
    }
}

export async function FetchReadinessById(id) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_readiness_by_id/` + id);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function FetchDefaultReadinessQn() {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_default_readiness_qns`);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function FetchReadiness(readiness_id) {
    let url = `${settings.serverBaseApi}/get_readiness`;
    if (readiness_id && readiness_id !== '') {
        url = `${settings.serverBaseApi}/get_readiness/` + readiness_id;
    }
    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_readiness`);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function FetchShipmentReadiness(getAll) {
    let url = `${settings.serverBaseApi}/get_shipment_readiness`;
    if (getAll && (getAll === true || getAll === 1)) {
        url = `${settings.serverBaseApi}/get_shipment_readiness?get_all=1`;
    }
    try {
        const response = await axios.get(url);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function FetchShipmentById(id) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_shipment_by_id/` + id);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function SaveShipment(shipement) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/create_shipment`,
            data: {
                shipement: shipement,
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err.response);
        return err.response
    }
}

export async function UpdateShipment(shipement) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/update_shipment`,
            data: {
                shipement: shipement,
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err.response);
        return err.response
    }
}

export async function FetchShipments(userId, filterEmpty) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_shipments/` + userId + '/' + filterEmpty);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function SaveSuveyAnswers(survey) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/save_survey_answers`,
            data: {
                survey: survey,
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err);
        return err.response
    }

}

export async function ApproveReadinessAnswer(readinessId, labId) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/approve_readiness_answer`,
            data: {
                readiness_id: readinessId,
                lab_id: labId
            }
        });
        return response;
    } catch (err) {
        console.log(err);
        return err.response
    }

}

export async function FetchReadinessResponses(id) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_readiness_response/` + id);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function FetchShipmentResponses(id) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_shipment_responses/` + id);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function FetchShipmentResponsesReport(id, isPart) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_shipment_response_report/` + id + '/' + isPart);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function FetchuserId(id) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_user_id/`);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function Saveuser(first_name, last_name, email, password, orgunits, role) {

    try {
        let orgsId = [];
        for (const [key, value] of Object.entries(orgunits)) {
            orgsId.push(key);
        }

        const response = await axios({
            method: 'put',
            url: `${settings.serverBaseApi}/save_user`,
            data: {
                name: first_name,
                last_name: last_name,
                email: email,
                password: password,
                orgunits: orgsId,
                role: role
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err);
        return err.response
    }
}


export async function FetchUsers() {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/users`);
        const userList = response.data;
        return userList;
    } catch (err) {
        // Handle Error Here
        return err.response
    }

}

export async function FetchUserProfile() {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_user_profile`);
        const userProfile = response.data;
        return userProfile;
    } catch (err) {
        // Handle Error Here
        return err.response
    }

}

export async function updateUserProfile(first_name, last_name, email, password) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/update_user_profile`,
            data: {
                name: first_name,
                last_name: last_name,
                email: email,
                password: password
            }
        });
        return response;
    } catch (err) {
        return err.response
    }
}

export async function DeleteUser(user) {
    try {
        const response = await axios({
            method: 'delete',
            url: `${settings.serverBaseApi}/delete_user`,
            data: {
                user: user,
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function FetchOrgunits() {
    let cacheOrgUnit = localStorage.getItem("orgunitList");
    if (cacheOrgUnit == null || JSON.parse(cacheOrgUnit).payload[0].length == 0) {
        let response;
        try {
            response = await axios.get(`${settings.serverBaseApi}/org_units`);
            const orgunitList = response.data;
            localStorage.setItem("orgunitList", JSON.stringify(orgunitList));
            return orgunitList;
        } catch (err) {
            console.error(err);
            return response;
        }
    } else {
        return JSON.parse(cacheOrgUnit);
    }
}

export async function AddSubOrg(org, name) {

    let response;
    try {
        response = await axios({
            method: 'put',
            url: `${settings.serverBaseApi}/add_sub_org`,
            data: {
                parent_org: org,
                child_org: name
            }
        });
        console.log(response);
        return response;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export function DevelopOrgStructure(orunitData) {
    let cacheOrgUnit = localStorage.getItem("orgunitTableStruc");
    if (cacheOrgUnit == null) {
        let tableOrgs = [];
        let processedItems = [];
        orunitData.payload[0].map((orgUnitToAdd) => {
            OrgUnitStructureMaker(tableOrgs, orgUnitToAdd, processedItems);
            if (!processedItems.includes(orgUnitToAdd.org_unit_id)) {
                let orgUnit = {
                    id: orgUnitToAdd.org_unit_id,
                    name: orgUnitToAdd.odk_unit_name,
                    level: orgUnitToAdd.level,
                    parentId: orgUnitToAdd.parent_id,
                    updatedAt: orgUnitToAdd.updated_at,
                    children: [
                    ]
                };
                tableOrgs.push(orgUnit);
                processedItems.push(orgUnitToAdd.org_unit_id)
            }
        });

        try {
            localStorage.setItem("orgunitTableStruc", JSON.stringify(tableOrgs));
        } catch (err) {

        }
        return tableOrgs;
    } else {
        return JSON.parse(cacheOrgUnit);
    }

}
export async function FetchuserParams(id) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_user_params/`);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function FetchAdminParams(id) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_admin_params/`);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}


export function exportToExcel(bundle, filename) {
    console.log('Exporting to Excel');
    if (!filename || filename == '' || filename == null || filename == undefined) {
        filename = 'data';
    }
    // let bundle = this.state.data
    if (bundle.length > 0) {
        let csv = '';
        filename = filename + '-' + new Date().toLocaleDateString().split('/').join('_') + '.csv'
        let keys = Object.keys(bundle[0])//.map(key => key.split('_').join(' '));
        csv += keys.join(',') + '\r\n';
        bundle.forEach(item => {
            csv += keys.map(key => item[key]).join(',') + '\r\n';
        });
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            if (document && document.createElement) {
                let link = document.createElement("a");
                if (link.download !== undefined) { // feature detection
                    // Browsers that support HTML5 download attribute
                    var url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", filename);
                } else {
                    link.setAttribute("href", 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
                }
                link.style.visibility = 'hidden';
                // link.textContent = 'Download '+filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

            } else {
                if (window && window.open) {
                    window.open('data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
                }
            }
        }
        console.log('Exported to Excel');
    } else {
        console.log('No data to export');
        alert('No data to export');
    }
}






export async function FetchAllFiles() {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/resources/files_all`);
        const flList = response.data;
        return flList;
    } catch (err) {
        return err.response
    }
}

export async function FetchPublicFiles() {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/resources/files_public`);
        const pbFlst = response.data;
        return pbFlst;
    } catch (err) {
        return err.response
    }
}
export async function FetchPrivateFiles() {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/resources/files_private`);
        const prvFlst = response.data;
        return prvFlst;
    } catch (err) {
        return err.response
    }
}

export async function SaveFile(payload, isPub = false) {
    let response;
    try {
        const formData = new FormData();
        formData.append('file', payload);
        formData.append('isPublic', isPub);
        response = await axios.post(`${settings.serverBaseApi}/resources/files`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    } catch (err) {
        return err.response
    }
}

export async function DeleteFile(fileId) {
    let response;
    try {
        response = await axios({
            method: 'delete',
            url: `${settings.serverBaseApi}/resources/files/${fileId}`,
        });
        return response;
    } catch (err) {
        return err.response
    }
}








// Lots CRUD
export async function FetchLots() {
    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_lots`);
        const lots = response.data;
        return lots;
    } catch (err) {
        return err.response
    }
}

//one
export async function FetchLot(lotId) {
    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_lot/${lotId}`);
        const lot = response.data;
        return lot;
    }
    catch (err) {
        return err.response
    }
}

// by readiness
export async function FetchLotsByReadiness(readinessId) {
    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_lots_by_readiness/${readinessId}`);
        const lots = response.data;
        return lots;
    } catch (err) {
        return err.response
    }
}

// lot participants
export async function FetchLotParticipants(lotId) {
    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_lot/${lotId}/participants`);
        const participants = response.data;
        return participants;
    } catch (err) {
        return err.response
    }
}

export async function SaveLot(payload) {
    let response;
    try {
        response = await axios.post(`${settings.serverBaseApi}/lot`, payload);
        return response;
    } catch (err) {
        return err.response
    }
}

export async function UpdateLot(id, payload) {
    let response;
    try {
        response = await axios.put(`${settings.serverBaseApi}/lot/${id}`, payload);
        return response;
    } catch (err) {
        return err.response
    }
}

export async function DeleteLot(id) {
    let response;
    try {
        response = await axios({
            method: 'delete',
            url: `${settings.serverBaseApi}/lot/${id}`,
        });
        return response;
    } catch (err) {
        return err.response
    }
}









// Panels CRUD
export async function FetchPanels() {
    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_panels`);
        const panels = response.data;
        return panels;
    } catch (err) {
        return err.response
    }
}

//one
export async function FetchPanel(panelId) {
    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_panel/${panelId}`);
        const panel = response.data;
        return panel;
    }
    catch (err) {
        return err.response
    }
}

// panel participants
export async function FetchPanelParticipants(panelId) {
    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_panel/${panelId}/participants`);
        const participants = response.data;
        return participants;
    } catch (err) {
        return err.response
    }
}

export async function SavePanel(payload) {
    let response;
    try {
        response = await axios.post(`${settings.serverBaseApi}/panel`, payload);
        return response;
    } catch (err) {
        return err.response
    }
}

export async function UpdatePanel(id, payload) {
    let response;
    try {
        response = await axios.put(`${settings.serverBaseApi}/panel/${id}`, payload);
        return response;
    } catch (err) {
        return err.response
    }
}

export async function DeletePanel(id) {
    let response;
    try {
        response = await axios({
            method: 'delete',
            url: `${settings.serverBaseApi}/panel/${id}`,
        });
        return response;
    } catch (err) {
        return err.response
    }
}