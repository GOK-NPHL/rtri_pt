import { settings } from './Settings'

const axios = require('axios');

let cache = {
    orgunitList: null,

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

export async function FetchOdkData(orgUnitIds, orgTimeline, siteType, startDate, endDate) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/odk_data`,
            data: {
                orgUnitIds: orgUnitIds,
                orgTimeline: orgTimeline,
                siteType: siteType,
                startDate: startDate,
                endDate: endDate
            }
        });
        return response;
    } catch (err) {
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
        return response.data;
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

export async function SaveOrgUnits(orgUnits, orgunitMetadata) {
    let response;
    try {
        response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/save_orgunits`,
            data: {
                orgunits: orgUnits,
                orgunit_metadata: orgunitMetadata,
            }
        });
        return response;
    } catch (err) {
        return err.response
    }
}


export async function UpdateOrg(org_unit_id, name) {
    try {
        const response = await axios({
            method: 'put',
            url: `${settings.serverBaseApi}/update_org`,
            data: {
                id: org_unit_id,
                name, name
            }
        });
        localStorage.removeItem('orgunitList');
        localStorage.removeItem('treeStruc');
        return response.data.Message;
    } catch (err) {
        // Handle Error Here
        err.response
        return err.response
    }
}

export async function DeleteOrg(org) {
    try {
        const response = await axios({
            method: 'delete',
            url: `${settings.serverBaseApi}/delete_org`,
            data: {
                org: org,
            }
        });
        console.log(response);
        return response;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function DeleteAllOrgs() {
    try {

        const response = await axios({
            method: 'delete',
            url: `${settings.serverBaseApi}/delete_all_orgs`
        });
        localStorage.removeItem('orgunitList');
        localStorage.removeItem('treeStruc');
        localStorage.removeItem("orgunitTableStruc");
        return response;
    } catch (err) {
        // Handle Error Here
        return err.response
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
let counter = 0;
function OrgUnitStructureMaker(arr, orgUnitToAdd, processedItems) {

    // if(counter>100) return;
    if (arr.length != 0) {

        arr.map((item) => {
            if (item.id == orgUnitToAdd.parent_id && !processedItems.includes(orgUnitToAdd.org_unit_id)) {

                let orgUnit = {
                    id: orgUnitToAdd.org_unit_id,
                    name: orgUnitToAdd.odk_unit_name,
                    level: orgUnitToAdd.level,
                    parentId: orgUnitToAdd.parent_id,
                    updatedAt: orgUnitToAdd.updated_at,
                    children: [
                    ]
                };
                item.children.push(orgUnit);
                processedItems.push(orgUnitToAdd.org_unit_id);

            } else {
                if (orgUnitToAdd.level > item.level && !processedItems.includes(orgUnitToAdd.org_unit_id)) {
                    arr = OrgUnitStructureMaker(item.children, orgUnitToAdd, processedItems);
                }
            }
        });

    } else {
        let orgUnit = {
            id: orgUnitToAdd.org_unit_id,
            name: orgUnitToAdd.odk_unit_name,
            level: orgUnitToAdd.level,
            parentId: orgUnitToAdd.parent_id,
            updatedAt: orgUnitToAdd.updated_at,
            children: [
            ]
        };
        arr.push(orgUnit);
        processedItems.push(orgUnitToAdd.org_unit_id);
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

export async function SaveSubmission(submission) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/save_submission`,
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

export async function FetchReadiness() {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_readiness`);
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

export async function FetchShipments() {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_shipments`);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}
