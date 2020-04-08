import {DatabaseJob} from "./database";
import {EmailJob} from "./email";

export class Jobs {
    static runRequiredJobs() {
        DatabaseJob.runDatabaseJob();
        EmailJob.runEmailJob();
    }
}