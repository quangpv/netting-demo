export interface AppConfig {

    test(): string
}

export class AppConfigImpl implements AppConfig {
    test(): string {
        return `Click here to next ${Math.random().toString()}`
    }
}