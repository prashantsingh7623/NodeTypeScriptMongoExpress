import * as encrypt from 'bcrypt';
import * as Multer from 'multer';

const storage_options = Multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './src/uploads');
    },
    filename(req, file, callback) {
        callback(null, file.originalname);
    }
});

const file_filter = (req, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        callback(null, true);
    } else {
        callback(null, false);
    }
};

export class Utility {
    public MAX_TOKEN_TIME = 60000; //6 min : 1 min = 10000ms
    public multer:any = Multer({storage: storage_options, fileFilter: file_filter});

    static generateVerificationToken() {
        let digits = '0123456789';
        let otp='';
        for(let i=0; i<5; i++) {
            otp += digits[Math.floor(Math.random() * 10)];
        }
        return parseInt(otp);
    }
    static encryptPassword(pass: string): Promise<any> {
        return new Promise((resolve, reject) => {
            encrypt.hash(pass, 10, (err, hash) => {
                if (err) {
                    reject(err)
                } else {
                     resolve(hash)
                }
            })
        })
    }
    static async comparePassword(pass : { plainPass:string, encryptedPass:string}): Promise<any> {
        return new Promise((resolve, reject) => {
            encrypt.compare(pass.plainPass, pass.encryptedPass, (err, same) => {
                if (err) {
                    reject(err);
                } else if (!same) {
                    reject(new Error('user and password did\'t match...!'));
                } else {
                    resolve(true);
                }
            })
        })
    }

}