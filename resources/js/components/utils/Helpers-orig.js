import { settings } from './Settings'

const axios = require('axios');

let cache = {
    orgunitList: null,

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

export async function FetchCurrentParticipantDemographics() {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_participant_demographics`);
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

export async function FetchShipmentReadiness() {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_shipment_readiness`);
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