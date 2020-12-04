class Controller {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private controllers = new Map<string, any>();
    constructor() {
        if (/.*(?<!Controller)$/.test(this.constructor.name)) {
            throw Error('The subclass should end with \'Controller\'.');
        }

        if (this.constructor === Controller) {
            throw Error('Don\'t use Controller base class directly.');
        }

        this.controllers.set(this.constructor.name, this);
    }

    execute(controllerName: string, actionName: string): void {
        const controller = this.controllers.get(controllerName);
        if (controller === undefined || controller[actionName] === undefined) {
            // TODO: return 404 status.
            throw Error();
        }
        controller[actionName]();
    }
}

export default Controller;