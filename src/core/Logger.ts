export class Logger {
    static count = 0

    static log(message: any) {
        console.log(`${Logger.count++}/${message}`)
    }
}