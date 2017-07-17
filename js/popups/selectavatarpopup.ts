﻿/// <reference path="../poker.commanding.api.ts" />

import * as ko from "knockout";
import { PopupBase } from "../ui/popupbase";
import * as metadataManager from "../metadatamanager";
import { App } from "../app";

declare var app: App;

export class SelectAvatarPopup extends PopupBase {
    public avatars = ko.observableArray<string>();
    public selectedAvatar = ko.observable<string>();
    public selected = new signals.Signal();

    public shown() {
        super.shown();
        this.avatars(metadataManager.avatars);
    }
    public confirm() {
        this.selected.dispatch(this.selectedAvatar());
    }
    public selectAvatar(item) {
        this.selectedAvatar(item);
        this.close();
    }
    public close() {
        super.close();
        this.confirm();
        app.registrationPopup.visible(true);
    }
}
