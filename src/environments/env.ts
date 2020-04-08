import {ProdEnv} from "./prod.env";
import {DevEnv} from "./dev.env";

export interface Environment {
    db_url: string;
    jwt_secret_key: string;
}

export function getEnvVariable() {
    if (process.env.NODE_ENV == 'production') {
        return ProdEnv;
    }
    return DevEnv;
}