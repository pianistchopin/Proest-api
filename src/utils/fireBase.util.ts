
import {request} from "request";
import rp from "request-promise";

export const callFirebaseApi = (fcm_token, noti_body, body_data) =>{
    /**
     * add firebase api
     */
    const form = {
        "to" : fcm_token,
        "collapse_key" : "type_a",
        "notification" : {
            "title" : "Proest",
            "body" : noti_body,
            "sound" : "default",
            "content_available" : true,
            "priority" : "high"
        },
        data : body_data
    }

    var options = {
        method: 'POST',
        uri: 'https://fcm.googleapis.com/fcm/send',
        headers: {
            'Authorization': 'key=AAAA4Q16ytY:APA91bEeSn4oHnVx6Nh86k1x_8aUforiwFxvJCjkst6oULz4ptOivoH6XyMfr1z6uIIftaCkWC1wSuDs5e3paBRESOO0c37HU_a8Ao5gX3Fv2mq9QHw8g8G8CXNFoD91N11zlpY4rOxH'
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