import * as jobSchedular from 'node-schedule';

export class EmailJob {
    static runEmailJob() {
        this.emailJob();
    }

    private static emailJob() {
        jobSchedular.scheduleJob('send email job','* * * * *',() => {
            console.log('email job')
        })
    }
}