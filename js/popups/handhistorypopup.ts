﻿import * as ko from "knockout";
import { TableView } from "../table/tableview";
import { PlayerWinInformation } from "../table/handhistory";
import { GameActionsQueue } from "../table/gameactionsqueue";
import { SimplePopup } from "../popups/simplepopup";
import { PopupBase } from "../ui/popupbase";
import { appConfig } from "../appconfig";
import { App } from "../app";

declare var app: App;

enum HandHistoryDisplayMode {
    Short = 1,
    Detailed,
}

export class HandHistoryPopup extends PopupBase {
    detailedOperations: KnockoutObservableArray<string>;
    shortOperations: KnockoutObservableArray<string>;
    tableView: KnockoutObservable<TableView>;
    mode: KnockoutObservable<HandHistoryDisplayMode>;
    cards: KnockoutObservableArray<string>;
    playersData: KnockoutObservableArray<PlayerWinInformation>;
    displayLoginSeparately: boolean;
    showHistoryModeSelector = ko.observable(true);
    isShortMode: KnockoutComputed<boolean>;
    isDetailedMode: KnockoutComputed<boolean>;

    constructor() {
        super();
        this.detailedOperations = ko.observableArray<string>([]);
        this.shortOperations = ko.observableArray<string>([]);
        this.tableView = ko.observable<TableView>();
        if (appConfig.game.handHistory.showPictureHistory) {
            this.mode = ko.observable(HandHistoryDisplayMode.Short);
        } else {
            this.mode = ko.observable(HandHistoryDisplayMode.Detailed);
        }

        this.isShortMode = ko.computed(() => {
            return this.mode() === HandHistoryDisplayMode.Short;
        });
        this.isDetailedMode = ko.computed(() => {
            return this.mode() === HandHistoryDisplayMode.Detailed;
        });

        this.cards = ko.observableArray<string>([]);
        this.playersData = ko.observableArray<PlayerWinInformation>([]);
        this.displayLoginSeparately = false;
    }
    shown(): void {
        super.shown();
        this.showHistoryModeSelector(appConfig.game.handHistory.showPictureHistory && appConfig.game.handHistory.showTextHistory);
        const view = this.tableView();
        const lastHand = view.lastHandHistory();
        this.detailedOperations(lastHand.detailedOperations());
        this.shortOperations(lastHand.shortOperations());
        this.cards(lastHand.cards());
        this.playersData(lastHand.playersData());
        GameActionsQueue.waitDisabled = true;
        app.tablesPage.tablesShown(false);
        app.popupClosed.addOnce(function (popupName: string) {
            if (popupName === "handHistory") {
                GameActionsQueue.waitDisabled = false;
                app.tablesPage.tablesShown(true);
            }
        }, this, 0);
    }
    selectMode(mode: HandHistoryDisplayMode) {
        this.mode(mode);
    }
    selectShortMode() {
        this.mode(HandHistoryDisplayMode.Short);
    }
    selectDetailedMode() {
        this.mode(HandHistoryDisplayMode.Detailed);
    }
}
