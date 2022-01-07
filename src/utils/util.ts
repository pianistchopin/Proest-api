import multer from "multer";
import {RequestWithCoach, RequestWithStudent} from "@interfaces/auth.interface";

/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
    if (value === null) {
        return true;
    } else if (typeof value !== 'number' && value === '') {
        return true;
    } else if (typeof value === 'undefined' || value === undefined) {
        return true;
    } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
        return true;
    } else {
        return false;
    }
};

const storage_student = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/student')
    },

    filename: function (req: RequestWithStudent, file: any, cb: any) {
        const student_id = req.student.id;
        cb(null, "student_" + student_id + ".jpg");
    }
});

export const studentUpload = multer({storage: storage_student});

const storage_coach = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/coach')
    },

    filename: function (req: RequestWithCoach, file: any, cb: any) {
        // const coach_id = req.coach.id;
        // cb(null, "coach_" + coach_id + ".jpg");

        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];

        let fieldname = file.fieldname;
        cb(null, Date.now() + "_" +fieldname + "." + extension);
    }
});

export const coachUpload = multer({storage: storage_coach});
