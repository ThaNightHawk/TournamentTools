import { Client, Models, Packets } from "tournament-assistant-client";

export class ClickableModalOption extends Models.ModalOption {
    private clickHandler?: Function;

    constructor(data?: any[] | { label?: string; value?: string; }, clickHandler?: Function) {
        super(data);
        this.clickHandler = clickHandler;
    }

    toObject() {
        return {
            label: this.label,
            value: this.value,
            onClick: this.clickHandler,
        };
    }
}

export class CustomShowModal extends Packets.Command.ShowModal {
    setOption1(value: Models.ModalOption) {
        this.option_1 = value;
        console.log("User is " + value)
    }

    setOption2(value: Models.ModalOption) {
        this.option_2 = value;
        console.log("User is " + value)
    }
}