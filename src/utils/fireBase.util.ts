
import {request} from "request";
import rp from "request-promise";

export const callFirebaseApi = (fcm_token) =>{
    /**
     * add firebase api
     */
    const form = {
        "to" : fcm_token,
        "collapse_key" : "type_a",
        "notification" : {
            "title" : "test4",
            "body" : "test4",
            "sound" : "default",
            "content_available" : true,
            "priority" : "high"
        },
        "data" : {
            "event_type" : "TicketReleaseInformation",
            "event_id" : "28849",
            "title" : "test title",
            "body" : "test body",
            "url" : "",
            "place" : "",
            "category" : "",
            "start" : "2021-09-18 00:00:00",
            "end" : "2021-09-18 00:00:00",
            "allDay" : "0"
        }
    }

    var options = {
        method: 'POST',
        uri: 'https://fcm.googleapis.com/fcm/send',
        headers: {
            'Authorization': 'key=AAAA0SzsXzg:APA91bHj6aze15cDoleG9U6q7l9ntOqlWZcdj_ABwg2Vogjjpm7ew-mckgxhqCi9bRrU-O4e57rb3P8o9WoiAzLuJm9WiE6aWZhOpwOJqvRbvykNsVRnklvMyz5xNEmhi2FhzLhi6Bcd'
        },
        body: form,
        json: true // Automatically stringifies the body to JSON
    };

    rp(options, function(err, res, body) {
        let json = JSON.stringify(body);
        console.log(json);
    });
    //---------------------------firebase api

}