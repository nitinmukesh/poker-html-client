/* tslint:disable:no-bitwise */

import * as ko from "knockout";
import * as moment from "moment";
import * as timeService from "../timeservice";
import * as authManager from "../authmanager";
import { TablePlaceModel } from "./tabpleplacemodel";
import { TournamentView } from "./tournamentview";
import { TablePlaces } from "./tableplaces";
import { HandHistory } from "./handhistory";
import { PlayerMessage } from "./playerMessage";
import { SystemMessage } from "./SystemMessage";
import { slowInternetService, connectionService, soundManager } from "../services";
import { SlowInternetService } from "../services/slowinternetservice";
import { ConnectionWrapper } from "../services/connectionwrapper";
import { SimplePopup } from "../popups/simplepopup";
import { App } from "../app";
import { appConfig } from "../appconfig";
import { ActionBlock } from "./actionBlock";
import { GameActionsQueue } from "./gameactionsqueue";
import { debugSettings } from "../debugsettings";
import { settings } from "../settings";
import * as runtimeSettings from "./runtimesettings";
import { TableCardsPlace } from "./tableCardsPlace";
import { _ } from "../languagemanager";
import { withCommas } from "../helpers";

declare let apiHost: string;
declare let app: App;

export class TableView {
    public tableName: KnockoutObservable<string>;

    /**
    * Current login which sitting on this view.
    */
    public currentLogin: KnockoutObservable<string>;

    /**
    * Represents the value indicating that information 
    * about the table is retreiving.
    */
    public connecting: KnockoutObservable<boolean>;

    /**
    * Request which performs connecting to the table.
    */
    public connectingRequest: JQueryDeferred<any> = null;

    public smallBlind: KnockoutObservable<number>;
    public bigBlind: KnockoutObservable<number>;
    public ante: KnockoutObservable<number>;
    /**
    * Minimal amount of money which currently authenticated player 
    * could bring on the table if he stand up from the table lately.
    */
    public minimalPlayerBuyIn: KnockoutObservable<number>;
    /**
    * Minimal base amount of buy-in in BB to bring on the table.
    */
    public minimalBuyIn: KnockoutObservable<number>;
    public gamePlayers: KnockoutObservableArray<number>;
    public places: KnockoutComputed<TablePlaceModel[]>;
    public pots: KnockoutObservableArray<number>;
    public tableCards: TableCardsPlace;
    public messages: KnockoutObservableArray<PlayerMessage>;
    public systemMessages: KnockoutObservableArray<SystemMessage>;
    public lastRaise: KnockoutObservable<number>;
    public timePass: KnockoutObservable<number>;
    /**
     * Count of actual actions which was performed by the players during the current game
     */
    public actionsCount: KnockoutObservable<number>;
    /**
    * Indicating whether authenticated player is playing in the game
    */
    public myPlayerInGame: KnockoutComputed<boolean>;
    /**
    * Indicating whether authenticated player was playing in the game
    */
    public myPlayerWasInGame: KnockoutComputed<boolean>;
    /**
    * Id of the current game on the table.
    */
    public gameId: KnockoutObservable<number>;
    public currentGameId: KnockoutObservable<number>;
    /**
    * Indicates that game finished.
    */
    public gameFinished: KnockoutObservable<boolean>;
    /**
    * Indicates that prizes distributed in the game.
    */
    public prizesDistributed: KnockoutObservable<boolean>;
    /**
    * Indicates that game started.
    */
    public gameStarted: KnockoutObservable<boolean>;
    /**
    * Count of active players in the game
    */
    public activePlayersCount: KnockoutComputed<number>;
    /**
    * Value indicating whether all bets are rounded.
    */
    public allBetsRounded: KnockoutObservable<boolean>;
    /**
    * Value indicating whether use cards variant up
    */
    public cardsVariantUp: KnockoutObservable<boolean>;
    /**
    * Value indicating whether use cards variant down
    */
    public cardsVariantDown: KnockoutObservable<boolean>;
    /**
    * Css rules for table-container
    */
    public containerCss: KnockoutObservable<any>;

    public timeLeft: KnockoutComputed<number>;
    public timerInterval: number;
    public chipWidth: number;
    private sitting = false;

    public chatMessage: KnockoutObservable<string>;
    public combinations: KnockoutObservableArray<string>;
    public currentPlayer: KnockoutComputed<TablePlaceModel>;
    public myPlayer: KnockoutComputed<TablePlaceModel>;
    public mainButtonsEnabled: KnockoutObservable<boolean>;
    public playerActions: KnockoutObservable<any>;
    public turnEnabled: KnockoutComputed<boolean>;
    public isMyTurn: KnockoutComputed<boolean>;
    public notMyTurn: KnockoutComputed<boolean>;
    public isInGame: KnockoutComputed<boolean>;
    public checkOrCallAmount: KnockoutComputed<number>;

    /**
    * Bet amount for currently active player.
    */
    public currentBet: KnockoutComputed<number>;

    /**
    * Bet amount for player.
    */
    public myBet: KnockoutComputed<number>;
    public currentTotalBet: KnockoutComputed<number>;
    public maximumBet: KnockoutComputed<number>;
    public currentRaise: KnockoutComputed<number>;
    public minimumRaiseAmount: KnockoutComputed<number>;
    public maximumRaiseAmount: KnockoutComputed<number>;
    public amountSupported: KnockoutObservable<number>;
    public maxAmountOfMoneyForOtherActivePlayers: KnockoutObservable<number>;
    public isSitOut: KnockoutComputed<boolean>;
    public totalPot: KnockoutComputed<number>;
    public totalPotCaption: KnockoutComputed<string>;
    public currentCombination = ko.observable("");
    public actionBlock: ActionBlock;
    public onMyTurn: Signal;
    private cardsReceived: boolean;
    private queue: GameActionsQueue;
    private handHistory: HandHistory;
    public tablePlaces: TablePlaces;
    public lastHandHistory: KnockoutObservable<HandHistory>;
    public hasPreviousHand: KnockoutComputed<boolean>;
    public tableBetsCaption: KnockoutComputed<string>;
    public currentHandCaption: KnockoutComputed<string>;
    public previousHandCaption: KnockoutComputed<string>;
    /**
    * Indicates that animation is suppressed from playing.
    */
    public animationSuppressed = ko.observable(false);
    private animationSettings = AnimationSettings.getSettings();

    /**
    * Tournament to which belongs given table.
    */
    public tournament = ko.observable<TournamentView>(null);

    /**
    * Indicates that table is frozen.
    */
    public frozen = ko.observable(false);

    /**
    * Indicates that table is opened
    */
    public opened = ko.observable(true);

    /**
    * Indicates that table is paused
    */
    public paused = ko.observable(false);
    public pauseDate = ko.observable<number>(null);
    private pauseDescription = ko.observable("");
    private pauseDescriptionHandle: number = null;
    public soundEnabled = false;
    public hasPendingMoney = ko.observable(false);
    public hasNotification = ko.observable(false);
    public notification = ko.observable("");
    public couldAddChips: KnockoutComputed<boolean>;
    private notificationHandleTimeout: number = null;
    private notificationHandleInterval: number = null;
    private displayingRebuyAddonNotification = false;

    /* If of the last message Id starting from which messages could be displayed */
    public lastMessageId = 0;

    private enableInjectPlayerCards = false;

    constructor(public tableId: number, public model: GameTableModel) {
        /// <signature>
        ///     <summary>Updates the information about the table from the server</summary>
        ///     <param name="tableId" type="Number">Id of the table for which view has to be created.</param>
        /// </signature>
        const self = this;
        this.tableId = tableId;
        this.tableName = ko.observable(model === null ? "0" : model.TableName);
        this.connecting = ko.observable(true);
        this.gamePlayers = ko.observableArray<number>([]);
        this.pots = ko.observableArray<number>([]);
        this.tableCards = new TableCardsPlace();
        this.messages = ko.observableArray<PlayerMessage>([]);
        this.systemMessages = ko.observableArray<SystemMessage>([]);
        this.chatMessage = ko.observable("");
        this.playerActions = ko.observable();
        this.mainButtonsEnabled = ko.observable(false);
        this.gameId = ko.observable<number>();
        this.currentGameId = ko.observable<number>();
        this.actionsCount = ko.observable(0);
        this.bigBlind = ko.observable<number>(model === null ? 0 : model.BigBlind);
        this.smallBlind = ko.observable<number>(model === null ? 0 : model.SmallBlind);
        this.ante = ko.observable<number>(null);
        this.minimalPlayerBuyIn = ko.observable<number>();
        this.minimalBuyIn = ko.observable<number>();
        this.lastRaise = ko.observable<number>();
        this.timePass = ko.observable<number>();
        this.gameFinished = ko.observable(true);
        this.prizesDistributed = ko.observable(true);
        this.gameStarted = ko.observable(false);
        this.combinations = ko.observableArray<string>([]);
        this.actionBlock = new ActionBlock();
        this.tablePlaces = new TablePlaces(model == null ? 0 : model.MaxPlayers);
        this.chipWidth = 30;
        this.cardsReceived = false;
        this.onMyTurn = new signals.Signal();
        this.queue = new GameActionsQueue();
        this.cardsVariantUp = ko.observable<boolean>(false);
        this.cardsVariantDown = ko.observable<boolean>(true);

        this.places = ko.computed(function () {
            return self.tablePlaces.places();
        }, this);

        if (typeof window !== "undefined") {
            if (window.innerWidth >= 1024 || window.innerHeight >= 1024) {
                this.chipWidth = 60;
                if (window.innerWidth >= 1920 || window.innerHeight >= 1920) {
                    this.chipWidth = 2 * 83;
                }

                if (window.innerWidth >= 3840 || window.innerHeight >= 3840) {
                    this.chipWidth = 4 * 83;
                }
            }
        }

        this.myPlayer = ko.computed(function () {
            self.tablePlaces.placesRefreshTrigger();
            const p = self.places().filter((item) => {
                return item.PlayerName() === self.currentLogin();
            });
            if (p.length > 0) {
                return p[0];
            }

            return null;
        }, this).extend({ notify: "always" });

        this.myPlayerInGame = ko.computed(function () {
            const gid = self.gameId();
            if (gid === null || gid === 0) {
                return false;
            }

            const myself = self.myPlayer();
            if (myself === null) {
                return false;
            }

            return (myself.Cards() !== null) && (myself.Cards().length !== 0);
        }, this);

        this.currentLogin = ko.observable(authManager.login());
        authManager.login.subscribe(function (value) {
            self.currentLogin(value);
        });

        this.timeLeft = ko.computed(function () {
            if (self.frozen()) {
                return -1;
            }

            let pass = self.timePass();
            pass = pass === null ? 0 : pass;
            return runtimeSettings.game.moveTime - pass;
        });
        this.currentRaise = ko.computed<number>({
            read: function () {
                return self.actionBlock.tableSlider.current();
            },
            write: function (value) {
                self.actionBlock.tableSlider.current(value);
            },
            owner: this
        });
        this.currentPlayer = ko.computed(function () {
            self.tablePlaces.placesRefreshTrigger();
            const p = self.places().filter((item) => {
                return item.IsCurrent();
            });
            if (p.length > 0) {
                return p[0];
            }

            return null;
        }, this);

        this.activePlayersCount = ko.computed(function () {
            self.tablePlaces.placesRefreshTrigger();
            const activePlayersCount = self.places().reduce((prev: number, value: TablePlaceModel) => {
                const isActive = value.WasInGame() && (value.Cards() !== null);
                return prev + (isActive ? 1 : 0);
            }, 0);
            return activePlayersCount;
        }, this);

        this.myPlayerWasInGame = ko.computed(function () {
            self.tablePlaces.placesRefreshTrigger();
            const myself = self.myPlayer();
            if (myself === null) {
                return false;
            }

            return (myself.WasInGame() === true);
        }, this);

        this.turnEnabled = ko.computed(function () {
            self.tablePlaces.placesRefreshTrigger();
            const cp = self.currentPlayer();
            if (cp === null) {
                return false;
            }

            const activePlayersCount = this.places().reduce((prev: number, value: TablePlaceModel) => {
                const isActive = value.WasInGame() && (value.Cards() !== null);
                return prev + (isActive ? 1 : 0);
            }, 0);
            return (cp.PlayerName() === self.currentLogin()) && activePlayersCount > 1;
        }, this);

        this.isMyTurn = ko.computed(function () {
            self.tablePlaces.placesRefreshTrigger();
            const cp = self.myPlayer();
            if (cp === null || !cp.IsInGameStatus()) {
                return false;
            }

            if (!self.gameStarted()) {
                return false;
            }

            if (cp.IsCurrent() === null) {
                return false;
            }

            return cp.IsCurrent();
        }, this);

        this.notMyTurn = ko.computed(function () {
            self.tablePlaces.placesRefreshTrigger();
            const cp = self.myPlayer();
            if (cp === null || !cp.IsInGameStatus()) {
                return false;
            }

            if (cp.IsCurrent() === null) {
                return true;
            }

            return !cp.IsCurrent();
        }, this);

        this.isInGame = ko.computed(function () {
            self.tablePlaces.placesRefreshTrigger();
            const cp = self.myPlayer();
            if (cp === null || !cp.IsInGameStatus()) {
                return false;
            }

            return true;
        });

        this.maximumBet = ko.computed(function () {
            self.tablePlaces.placesRefreshTrigger();
            let result = 0;
            result = self.places().reduce(function (previousValue: number, currentValue: TablePlaceModel) {
                return Math.max(previousValue, currentValue.Bet());
            }, 0);
            return result;
        }, this);

        this.allBetsRounded = ko.computed(function () {
            self.tablePlaces.placesRefreshTrigger();
            const playersInGame = self.places().filter(value => value.WasInGame()).length;
            const activePlayers = self.places().filter(value => value.WasInGame() && (value.Cards() !== null));
            const maxBet = self.maximumBet();
            const allRounded = activePlayers.filter(player => (player.Bet() === maxBet) || (player.Money() === 0)).length
                === activePlayers.length;
            if (allRounded && (self.actionsCount() >= playersInGame)) {
                return true;
            }

            return false;
        }, this);

        this.currentBet = ko.computed(function () {
            self.tablePlaces.placesRefreshTrigger();
            const result = self.places().reduce(function (previousValue: number, currentValue: TablePlaceModel) {
                if (currentValue.IsCurrent()) {
                    return currentValue.Bet();
                }

                return previousValue;
            }, 0);
            return result;
        }, this);

        this.myBet = ko.computed(function () {
            self.tablePlaces.placesRefreshTrigger();
            const myPlayer = self.myPlayer();
            if (myPlayer === null) {
                return 0;
            }

            return myPlayer.Bet();
        }, this);

        this.currentTotalBet = ko.computed(function () {
            self.tablePlaces.placesRefreshTrigger();
            const result = self.places().reduce(function (previousValue: number, currentValue: TablePlaceModel) {
                if (currentValue.IsCurrent()) {
                    return currentValue.TotalBet();
                }

                return previousValue;
            }, 0);
            return result;
        }, this);

        this.checkOrCallAmount = ko.computed(function () {
            return self.maximumBet() - self.currentBet();
        }, this);

        this.minimumRaiseAmount = ko.computed(function () {
            self.tablePlaces.placesRefreshTrigger();
            const currentPlayer = self.myPlayer();
            if (currentPlayer === null) {
                return null;
            }

            let oldVersion = false;
            if (oldVersion) {
                const currentBet = self.currentBet();
                let mb = 2 * (self.lastRaise() - currentBet) - self.checkOrCallAmount();

                // No less then big blind.
                mb = Math.max(mb, self.bigBlind());

                // No more then current money
                mb = Math.min(mb, currentPlayer.Money());
                const addon = currentBet + self.checkOrCallAmount();
                let raiseAmount = mb + addon;
                const maxAmountOfMoneyForOtherActivePlayers = self.maxAmountOfMoneyForOtherActivePlayers();
                raiseAmount = Math.min(raiseAmount, maxAmountOfMoneyForOtherActivePlayers);
                return raiseAmount;
            } else {
                let basicRaise = self.maximumBet() + self.lastRaise();

                // No less then big blind.
                basicRaise = Math.max(basicRaise, self.bigBlind());

                // No more then current money
                basicRaise = Math.min(basicRaise, currentPlayer.Money() + currentPlayer.Bet());

                // No more then money which other players has.
                const maxAmountOfMoneyForOtherActivePlayers = self.maxAmountOfMoneyForOtherActivePlayers();
                const raiseAmount = Math.min(basicRaise, maxAmountOfMoneyForOtherActivePlayers);
                return raiseAmount;
            }
        }, this);

        this.isSitOut = ko.computed(function () {
            self.tablePlaces.placesRefreshTrigger();
            const currentPlayer = this.myPlayer();
            if (currentPlayer === null) {
                return false;
            }

            return (currentPlayer.Status() & 1) !== 0;
        }, this);

        this.maxAmountOfMoneyForOtherActivePlayers = ko.computed(function () {
            let result = 0;
            result = self.places().reduce(function (previousValue: number, currentValue: TablePlaceModel) {
                if (currentValue.PlayerName() === self.currentLogin()) {
                    return previousValue;
                }

                if (!currentValue.IsInGameStatus()) {
                    return previousValue;
                }

                if (currentValue.Cards() === null) {
                    return previousValue;
                }

                return Math.max(previousValue, currentValue.Bet() + currentValue.Money());
            }, 0);
            return result;
        }).extend({ notify: "always" });

        this.containerCss = ko.computed(() => {
            let cardsVariant = settings.cardsVariant();
            if (cardsVariant === "up") {
                this.cardsVariantUp = ko.observable<boolean>(true);
                this.cardsVariantDown = ko.observable<boolean>(false);
            } else if (cardsVariant === "down") {
                this.cardsVariantUp = ko.observable<boolean>(false);
                this.cardsVariantDown = ko.observable<boolean>(true);
            }
            return {
                expanded: this.actionBlock.expanded(),
                "cardsvariant-up": this.cardsVariantUp(),
                "cardsvariant-down": this.cardsVariantDown(),
            };
        });
        this.maximumRaiseAmount = ko.computed(function () {
            const currentPlayer = self.myPlayer();
            if (currentPlayer === null) {
                return null;
            }

            const max = self.maxAmountOfMoneyForOtherActivePlayers();
            const bet = currentPlayer.Bet();
            const money = currentPlayer.Money();
            return Math.min(money + bet, max) - bet;
        }, this).extend({ notify: "always" });

        this.totalPot = ko.computed(function () {
            self.tablePlaces.placesRefreshTrigger();
            const totalBetsOnTable = self.places().reduce((prev: number, item: TablePlaceModel) => {
                return prev + item.Bet();
            }, 0);
            const potsArray = self.pots();
            if (potsArray === null) {
                return totalBetsOnTable;
            }

            const pots = potsArray.reduce((prev: number, item: number) => {
                return prev + item;
            }, 0);

            return totalBetsOnTable + pots;
        }, this);

        this.totalPotCaption = ko.computed(function () {
            self.tablePlaces.placesRefreshTrigger();
            const totalPot = self.totalPot();
            if (totalPot === null || totalPot === 0) {
                return null;
            }

            return _("table.totalpot")
                .replace("#amount", withCommas(totalPot.toFixed(), ","));
        }, this);

        this.tableBetsCaption = ko.computed(function () {
            const hasAnte = self.ante() != null;
            if (hasAnte) {
                return _("table.betsWithAnte", { sb: self.smallBlind(), bb: self.bigBlind(), ante: self.ante() });
            }

            return _("table.bets", { sb: self.smallBlind(), bb: self.bigBlind() });
        }, this);

        this.couldAddChips = ko.pureComputed(function () {
            const me = self.myPlayer();
            if (me == null) {
                return false;
            }

            if (self.hasPendingMoney()) {
                return false;
            }

            if (appConfig.game.noTableMoneyLimit) {
                return true;
            }

            const totalBet = (me.TotalBet() == null ? 0 : me.TotalBet());
            const baseMinimalBuyIn = self.minimalBuyIn() * self.model.BigBlind;
            const tableTotal = totalBet + me.Money() + me.Bet();
            return (20 * baseMinimalBuyIn) > tableTotal;
        }, this);

        this.actionBlock.attach(this);

        this.initHandHistory();
    }


    /**
    * Gets current cards combination
    */
    public getCurrentCombination() {
        const my = this.myPlayer();
        if (my == null) {
            return null;
        }

        const tableCards = this.tableCards.tableCardsData();
        return my.getCombination(tableCards);
    }
    startTimer(startTime: number = 1) {
        const self: TableView = this;
        if (this.frozen()) {
            return;
        }

        self.timePass(startTime);
        this.timerInterval = timeService.setInterval(function () {
            if (runtimeSettings.updateTimer) {
                const time = self.timePass();
                self.timePass(time + 1);
                if (self.timeLeft() === 7) {
                    if (self.currentPlayer() === self.myPlayer()) {
                        if (self.soundEnabled) {
                            soundManager.playTurnReminder();
                        }
                    } else {
                        if (self.soundEnabled) {
                            soundManager.playTurnReminderForAll();
                        }
                    }
                }
            }
        }, 1000);
    }
    clearTimer() {
        timeService.clearInterval(this.timerInterval);
        this.timePass(null);
    }
    clearInformation() {
        this.messages([]);
    }
    updateTableInformation() {
        /// <signature>
        ///     <summary>Updates the information about the table from the server</summary>
        /// </signature>
        const self = this;
        if (this.connectingRequest !== null && this.connectingRequest.state() === "pending") {
            // Re-schedule updating information.
            this.connectingRequest.then(null, function () {
                self.log("Rescheduling the updating information.");
                self.updateTableInformation();
            });
            self.log("Cancelling the connection request process");
            self.cancelUpdateTableInformation();
            return;
        }

        this.connecting(true);
        const currentLoadingRequest = $.Deferred();
        this.clearTimer();
        const wrapper = connectionService.currentConnection;
        let hubId = wrapper.connection.id;
        const connectionInfo = "HID:" + hubId;
        this.log("Connecting to table " + this.tableId + " on connection " + connectionInfo);
        const startConnection = app.buildStartConnection();
        const api = new OnlinePoker.Commanding.API.Game(apiHost);

        // Set opening card parameters in parallel to other operations.
        api.SetOpenCardsParameters(this.tableId, !settings.autoHideCards());
        startConnection().then(function () {
            if (wrapper.terminated) {
                return;
            }

            hubId = wrapper.connection.id;
            self.log("Attempting to connect to table and chat over connection " + hubId);

            const joinTableRequest = self.joinTable(wrapper);
            const joinChatRequest = self.joinChat(wrapper);
            const joinRequest = $.when(joinTableRequest, joinChatRequest);
            currentLoadingRequest.progress(function (command: string) {
                self.log("Receiving request to cancel all joining operations");
                joinTableRequest.notify(command);
                joinChatRequest.notify(command);
            });
            joinRequest.then(function () {
                if (wrapper.terminated) {
                    currentLoadingRequest.reject("Cancelled");
                    return;
                }

                self.log("Jointing to table finished");
                currentLoadingRequest.resolve();
            }, function (result1, result2) {
                if (wrapper.terminated) {
                    return;
                }

                let message: string;
                if (result2 == null) {
                    let taskFailed;
                    if (result1[2] === joinTableRequest) {
                        taskFailed = "join table";
                    } else {
                        taskFailed = "join chat";
                    }

                    message = "Rejecting request due to " + taskFailed + " failure in the connection."
                        + "Failed request: " + result1[0];
                } else {
                    message = "Rejecting request due to one of the error in the connection."
                        + "First request: " + result1[0]
                        + "Second request: " + result2[0];
                }

                self.log(message);
                currentLoadingRequest.reject(message);
            });
        }, function (message) {
            self.log("Table connection failed. Error: " + message);
            currentLoadingRequest.reject("Table connection failed. Error: " + message);
        });
        this.connectingRequest = currentLoadingRequest;
    }
    cancelUpdateTableInformation() {
        if (this.connectingRequest !== null) {
            this.connectingRequest.notify("cancel");
            this.connectingRequest = null;
        }
    }
    joinTable(wrapper: ConnectionWrapper, maxAttempts = 3) {
        const self = this;
        const result = $.Deferred();
        if (maxAttempts === 0 || wrapper.terminated) {
            this.log("Stop connecting to table");
            result.reject("Stop connecting to table", false);
            return result;
        }

        const hubId = connectionService.currentConnection.connection.id;
        const connectionInfo = "HID:" + hubId;
        this.log("Joining table on connection " + connectionInfo);
        const cancelled = false;
        let subsequentDeferred: JQueryDeferred<any> = null;
        const cancelOperation = function () {
            self.log("Cancelling join table request");
            result.reject("Cancelled", true);
        };

        wrapper.buildStartConnection()().then(function () {
            if (wrapper.terminated) {
                cancelOperation();
                return;
            }

            self.log("Executing Game.join on connection " + wrapper.connection.id + " in state " + wrapper.connection.state);
            const operation = wrapper.connection.Game.server.join(self.tableId)
                .then(function () {
                    if (wrapper.terminated) {
                        cancelOperation();
                        return;
                    }

                    result.resolve();
                }, function (error: any) {
                    if (wrapper.terminated || cancelled || error === "Cancelled") {
                        cancelOperation();
                        return;
                    }

                    let message = "" + <string>error;
                    self.log("Failed to join table " + self.tableId + ", " + connectionInfo + ". Reason: " + message);
                    if (message.indexOf("Connection was disconnected before invocation result was received.") >= 0) {
                        self.log("Stopped connecting to table since underlying connection is broken");
                        slowInternetService.showReconnectFailedPopup();
                        result.reject("Stopped connecting to table since underlying connection is broken", false);
                        return;
                    } else {
                        subsequentDeferred = self.joinTable(wrapper, maxAttempts - 1);
                        return subsequentDeferred.then(function () {
                            result.resolve();
                        }, function (error, cancelled: boolean) {
                            result.reject(error, cancelled);
                        });
                    }
                });

            result.progress(function (command: string) {
                this.cancelled = true;
                result.reject("Cancelled");
                if (subsequentDeferred !== null) {
                    subsequentDeferred.notify("cancel");
                    subsequentDeferred = null;
                }
            });
        }, function () {
            cancelOperation();
        });
        return result;
    }
    joinChat(wrapper: ConnectionWrapper, maxAttempts = 3) {
        const self = this;
        const result = $.Deferred();
        if (maxAttempts === 0 || wrapper.terminated) {
            this.log("Stop connecting to table chat");
            result.reject("Stop connecting to table chat", false);
            return result;
        }

        const cancelled = false;
        let subsequentDeferred: JQueryDeferred<any> = null;
        const cancelOperation = function () {
            self.log("Cancelling join table request");
            result.reject("Cancelled", true);
        };

        wrapper.buildStartConnection()().then(function () {
            if (wrapper.terminated) {
                cancelOperation();
                return;
            }

            self.log("Executing Game.join on connection " + wrapper.connection.id + " in state " + wrapper.connection.state);
            const operation = wrapper.connection.Chat.server.join(self.tableId)
                .then(function () {
                    if (wrapper.terminated) {
                        cancelOperation();
                        return;
                    }

                    result.resolve();
                }, function (message: string) {
                    if (wrapper.terminated || cancelled) {
                        self.log("Cancelling join table chat request");
                        result.reject("Cancelled", true);
                        return;
                    }

                    self.log("Failed to join table " + self.tableId + " chat. Reason: " + message);
                    subsequentDeferred = self.joinChat(wrapper, maxAttempts - 1);
                    return subsequentDeferred.then(function () {
                        result.resolve();
                    }, function (error, cancelled: boolean) {
                        result.reject(error, cancelled);
                    });
                });

            result.progress(function (command: string) {
                this.cancelled = true;
                result.reject("Cancelled");
                if (subsequentDeferred !== null) {
                    subsequentDeferred.notify("cancel");
                    subsequentDeferred = null;
                }
            });
        }, function () {
            cancelOperation();
        });
        return result;
    }
    disconnect() {
        /// <signature>
        ///     <summary>Updates the information about the table from the server</summary>
        /// </signature>
        const self = this;
        // HACK: Game server should correctly leave from table.
        // Looks like when calling leave status stop receiving player specific 
        // notifications. Which is looks like SignalR connection is not correctly 
        // removed from the corresponding group.
        // connectionService.currentConnection.connection.Game.server.leave(this.tableId);
        // connectionService.currentConnection.connection.Chat.server.leave(this.tableId);
    }

    setDealer(dealerSeat) {
        const players = this.places();
        players.forEach((p) => {
            if (p.Seat() === dealerSeat) {
                p.IsDealer(true);
            } else {
                p.IsDealer(null);
            }
        });
        // this.places(players);
    }

    setCurrent(currentPlayerId: number) {
        const players = this.places();
        players.forEach((p) => {
            if (p.PlayerId() === currentPlayerId) {
                p.IsCurrent(true);
            } else {
                p.IsCurrent(null);
            }
        });
    }

    async onSit(playerId: number, seat: number, playerName: string, amount: number, playerUrl: string, points: number, stars: number) {
        /// <signature>
        ///     <summary>Sits players on the table.</summary>
        ///     <param name="playerId" type="Number">Id of the player which join the table</param>
        ///     <param name="seat" type="Number">Number of seat where player sit.</param>
        ///     <param name="playerName" type="String">Name of the player which join the table</param>
        ///     <param name="amount" type="Number">Amount of money which player bring to the table</param>
        /// </signature>
        this.logGameEvent("Player " + playerId + " sit on the seat " + seat);
        const places = this.places();

        const initialStatus = !this.paused() ? 0 : (8 /* IsParticipatingStatus */ + 16 /* IsInGame */);
        const playerModel = new TablePlaceModel({
            PlayerId: playerId,
            PlayerName: playerName,
            PlayerUrl: playerUrl,
            Seat: seat,
            Money: amount,
            Cards: null,
            Bet: null,
            Status: initialStatus,
            Points: points,
            Stars: stars
        });
        this.tablePlaces.sit(seat, playerModel);
        this.refreshPlaces();
        this.actionBlock.updateNeedBB();
        this.actionBlock.updateBlocks();
        if (playerName === this.currentLogin()) {
            const api = new OnlinePoker.Commanding.API.Game(apiHost);
            await api.SetOpenCardsParameters(this.tableId, !settings.autoHideCards());
        }
    }
    onStandup(playerId) {
        /// <signature>
        ///     <summary>Standup player from the table.</summary>
        ///     <param name="playerId" type="Number">Id of the player which join the table</param>
        /// </signature>
        const places = this.places();
        let lastAmount = 0;
        for (let p in places) {
            if (!places.hasOwnProperty(p)) {
                continue;
            }

            const currentPlayer = places[p];
            if (currentPlayer.PlayerId() === playerId) {
                if (currentPlayer.WasInGame()) {
                    this.actionsCount(Math.max(0, this.actionsCount() - 1));
                }

                lastAmount = currentPlayer.Money();
                this.tablePlaces.standup(currentPlayer.Seat());
                break;
            }
        }

        // If we no longer on the table then leave it.
        if (this.myPlayer() === null) {
            this.minimalPlayerBuyIn(lastAmount);
            this.updateCurrentCombination();
        }

        this.refreshPlaces();
        this.actionBlock.updateNeedBB();
        this.actionBlock.updateBlocks();
    }
    onFrozen() {
        this.frozen(true);
        this.clearTimer();
    }
    onUnfrozen() {
        this.frozen(false);
        this.startTimer();
    }
    onOpened() {
        this.pushCallback(() => {
            this.opened(true);
        });
    }
    onClosed() {
        this.pushCallback(() => {
            this.opened(false);
            this.tablePlaces.clear();
            this.pots([]);
            this.tableCards.clear();
        });
    }
    onPaused() {
        this.paused(true);
        this.pauseDate(new Date().valueOf());
        this.updatePauseDescription();
    }
    onResumed() {
        this.clearPauseMessage();
    }
    onFinalTableCardsOpened(cards: number[]) {
        this.handHistory.onFinalTableCardsOpened(cards);
    }

    /**
     * Notifies that table is tournament table.
     * @param tournamentId Id of the tournament to which table becomes belonging.
     */
    onTableTournamentChanged(tournamentId: number | null) {
        throw new Error("TableView.onTableTournamentChanged not implemented");
    }

    /**
    * Informs about current state on the table.
    * @param players Array of PlayerStatusInfo objects which describe current status of the players
    * @param pots Array of pots on the table.
    * @param cards Cards open on the table
    * @param dealerSeat Current dealer seat. 0 if no game on the table.
    * @param buyIn Minimum amount of money which player should bring on the table.
    * @param baseBuyIn Base amount in BB for joining table under normal conditions. 
    *                   20*baseBuyIn is maximum amount which player could bring-in.
    * @param leaveTime Time when player leave table last time.
    * @param timePass Time in second which is pass from last player turn.
    * @param currentPlayerId Id of the current player in the game.
    * @param lastRaise Amount of last raise in the game.
    * @param gameId Id of the game
    * @param authenticated Value indicating whether current user is authenticated or not.
    * @param actionsCount Count of actions which was performed by the player.
    * @param frozen A value indicating whether game on the table is frozen or not.
    * @param opened A value indicating whether the table is opened or not.
    * @param pauseData Unix time when game was paused. If game not paused, then null.
    * @param lastMessageId Last id of the message.
    */
    onTableStatusInfo(players: PlayerStatusInfo[], pots: number[], cards: string, dealerSeat: number, buyIn: number,
        baseBuyIn: number, leaveTime, timePass: number, currentPlayerId: number, lastRaise: number, gameId: number,
        authenticated: boolean, actionsCount: number, frozen: boolean, opened: boolean, pauseDate: number,
        lastMessageId: number) {
        const tablePlayers = <TablePlayer[]>[];
        for (let i = 0; i < players.length; i++) {
            const p = <TablePlayer><any>players[i];
            tablePlayers.push(p);
        }

        this.lastMessageId = lastMessageId;
        this.frozen(frozen);
        this.opened(opened);
        this.paused(pauseDate != null);
        this.pauseDate(pauseDate);
        this.updatePauseDescription();
        this.queue.clear();
        if (opened) {
            this.gameId(gameId);
            this.actionsCount(actionsCount);
            const gameFinished = gameId === 0 || gameId === null;
            this.gameFinished(gameFinished);
            this.gameStarted(!gameFinished);
            this.prizesDistributed(this.gameFinished());
            this.tablePlaces.setPlayers(players);
            if (this.activePlayersCount() <= 1) {
                this.gameFinished(true);
            }

            const cardsArr = decodeCardsArray(cards);
            this.setCards(cardsArr);
            this.setDealer(dealerSeat);

            this.actionBlock.buttonsEnabled(true);
            this.actionBlock.showCardsEnabled(true);
            this.actionBlock.showHoleCard1Enabled(true);
            this.actionBlock.showHoleCard2Enabled(true);
            this.actionBlock.dealsAllowed(true);
            timeService.setTimeout(() => {
                this.actionBlock.updateBounds();
            }, 500);
            this.setCurrent(currentPlayerId);
            this.minimalPlayerBuyIn(buyIn);
            this.minimalBuyIn(baseBuyIn);
            this.pots(pots);
            this.refreshPlaces();
            this.clearTimer();
            this.startTimer(timePass);
            this.cardsReceived = true;

            if (cards != null) {
                if (cards.length === 0) {
                    lastRaise = Math.max(lastRaise, this.bigBlind());
                }
            }

            this.lastRaise(lastRaise);
            this.currentRaise(this.minimumRaiseAmount());
            this.actionBlock.isRaise(lastRaise > 0);
            this.actionBlock.isCheck(this.checkOrCallAmount() === 0);
            this.actionBlock.checkOrCallAmount(this.checkOrCallAmount());
            this.actionBlock.resetWaitBB();
            this.actionBlock.processing(false);
            this.actionBlock.updateBlocks();
            const myself = this.myPlayer();
            if (myself != null) {
                this.actionBlock.updateAutomaticActionsText(myself.Money(), this.maximumBet() - this.myBet());
            }

            this.updateCurrentCombination();
        } else {
            this.tablePlaces.clear();
            this.pots([]);
            this.tableCards.clear();
        }

        this.cleanTableAfterGameFinish();
        this.connecting(false);
        this.log("Finishing connecting to table " + this.tableId);
    }
    onGameStartedCore(gameId, players: GamePlayerStartInformation[], actions: GameActionStartInformation[], dealerSeat) {
        /// <signature>
        ///     <summary>Start the game.</summary>
        ///     <param name="gameId" type="Number">Id of the player which join the table</param>
        ///     <param name="players" type="Array" 
        ///             value="[{PlayerId:1,PlayerName:'Login',PlayerUrl:'http://url/1.png',Money:100,Seat:9,Cards:[1,2],Status:1}]">
        ///     </param>
        ///     <param name="dealerSeat" type="Number">Seat where dealer sitting.</param>
        /// </signature>
        this.gameFinished(false);
        this.prizesDistributed(false);
        this.currentGameId(gameId);
        this.gameId(gameId);
        this.hasPendingMoney(false);
        this.actionBlock.isRaise(true);
        this.actionBlock.expanded(false);
        this.actionBlock.showCardsEnabled(true);
        this.actionBlock.showHoleCard1Enabled(true);
        this.actionBlock.showHoleCard2Enabled(true);
        this.actionBlock.updateBounds();
        this.actionsCount(0);
        this.setDealer(dealerSeat);
        this.tableCards.clear();
        this.pots([]);
        this.logGameEvent("Game started");
        if (this.displayingRebuyAddonNotification) {
            this.clearNotification();
        }

        const combinations: string[] = [];

        if (runtimeSettings.game.clearAutoFoldOrCheckOnNewGame) {
            this.actionBlock.autoFoldOrCheck(false);
        }

        this.cardsReceived = false;
        this.combinations(combinations);
        this.gamePlayers(players.map((item) => item.PlayerId));
        this.places().forEach(function (value) {
            value.prepareForNewGame();
            players.forEach(function (pvalue) {
                if (pvalue.PlayerId === value.PlayerId()) {
                    value.initializeForNewGame(pvalue.Money);
                }
            });
            if (players.every((pvalue) => pvalue.PlayerId !== value.PlayerId())) {
                value.WasInGame(null);
            }
        });
        if (this.soundEnabled) {
            soundManager.playDealCards();
        }

        this.refreshPlaces();
        this.lastRaise(this.bigBlind());

        this.actionBlock.resetAutomaticAction();
        if (players.some(_ => _.PlayerId === authManager.loginId())) {
            // Reset Wait BB status since player currently join the game.
            this.actionBlock.resetWaitBB();
        }
    }
    startDealCards() {
        const self = this;
        this.queue.pushCallback(() => {
            self.logGameEvent("Deal cards to players");
            self.places().forEach(function (value) {
                if (value.WasInGame()) {
                    value.startDealCards();
                }
            });
        });
        this.queue.wait(this.animationSettings.dealCardsTime);
        this.queue.pushCallback(() => {
            self.places().forEach(function (value) {
                value.IsDealCards(false);
            });
            self.clearTimer();
            self.startTimer();
        });
    }
    onGameStarted(gameId: number, players: GamePlayerStartInformation[], actions: GameActionStartInformation[], dealerSeat: number) {
        this.queue.pushCallback(() => {
            this.onGameStartedCore(gameId, players, actions, dealerSeat);
            this.handHistory.onGameStarted(gameId, players, actions, dealerSeat);
        });
        const isInGame = players.some(_ => _.PlayerId === authManager.loginId());
        if (!isInGame) {
            this.startDealCards();
        }
    }
    onGameFinished(gameId: number, winners: GameWinnerModel[], rake: number) {
        /// <signature>
        ///     <summary>Start the game.</summary>
        ///     <param name="gameId" type="Number">Id of the player which join the table</param>
        ///     <param name="winners" type="Array" 
        ///             value="[{PlayerId:1,Pot:1,Amount:100,CardsDescription:'Hands 1'}]">
        ///     </param>
        ///     <param name="rake" type="Number">Amount of rake paid.</param>
        /// </signature>
        const self = this;
        this.queue.wait(this.animationSettings.finishGamePrePause);
        const activePlayersCount = this.activePlayersCount();
        if (this.pots().length === 0 && winners.length > 0) {
            this.onMoveMoneyToPot(winners.map(_ => _.Amount));
        }

        if (debugSettings.game.singleSidePots) {
            this.queue.pushCallback(() => {
                this.logGameEvent("Game finished");
                self.gameFinished(true);
                this.actionBlock.expanded(false);
                self.gameStarted(false);
                self.gamePlayers([]);
                const places = self.places();
                self.finishAnimation(places);

                let needHightlightCards = true;
                const activePlayersCount = this.activePlayersCount();
                this.logGameEvent("Active players count", activePlayersCount);
                needHightlightCards = activePlayersCount > 1;
                if (needHightlightCards) {
                    self.tableCards.CardsHightlighted(true);
                }

                const c = this.calculateWinnerAmount(places, winners, needHightlightCards);
                if (self.soundEnabled) {
                    soundManager.playWinChips();
                }

                self.combinations(c);

                self.setDealer(0);
                self.cardsReceived = false;
                self.actionBlock.buttonsEnabled(false);
                self.actionBlock.dealsAllowed(false);
                self.setCurrent(0);
                self.pots([]);
                self.refreshPlaces();
                self.clearTimer();

                self.gameId(null);

                self.handHistory.onGameFinished(gameId, winners, rake);
                self.saveHandHistory();
                this.enableInjectPlayerCards = true;
            });
            this.queue.waitWithInterruption(this.animationSettings.cleanupTableTimeout);
        } else {
            this.queue.pushCallback(() => {
                this.logGameEvent("Game finished");
                self.gameFinished(true);
                this.actionBlock.expanded(false);
                self.gameStarted(false);
                self.gamePlayers([]);
                const places = self.places();
                self.finishAnimation(places);

                const activePlayersCount = this.activePlayersCount();
                this.logGameEvent("Active players count", activePlayersCount);
                let needHightlightCards = activePlayersCount > 1;
                if (needHightlightCards) {
                    self.tableCards.CardsHightlighted(true);
                }

                self.setDealer(0);
                self.actionBlock.buttonsEnabled(false);
                self.actionBlock.dealsAllowed(false);
                self.setCurrent(0);
                self.clearTimer();
                self.gameId(null);
            });
            this.queue.pushCallback(() => {
                const places = self.places();
                const activePlayersCount = this.activePlayersCount();
                let needHightlightCards = activePlayersCount > 1;
                this.logGameEvent("Distribute pots: ", this.pots().slice());
                let potsCount = winners.reduce((prev, current) => Math.max(prev, current.Pot), 0);
                for (let potNumber = 1; potNumber <= potsCount; potNumber++) {
                    // Inject wait first, since next callback will override that.
                    this.queue.injectWaitWithInterruption(2000);
                    this.queue.injectCallback(() => {
                        this.logGameEvent("Distribute pot " + potNumber);

                        // Clear previous win amount for all players so all animation will play correctly. 
                        for (let place of this.places()) {
                            if (place) {
                                place.WinAmount(null);
                                place.CardsHightlighted(false);
                            }
                        }

                        const potWinners = winners.filter(_ => _.Pot === potNumber);
                        const c = this.calculateWinnerAmount(places, potWinners, needHightlightCards);
                        if (this.soundEnabled) {
                            soundManager.playWinChips();
                        }

                        this.combinations(c);
                        this.handHistory.onPotDistributed(this.gameId(), potNumber, winners);
                        this.refreshPlaces();

                        // Remove processed pot.
                        const pots = this.pots();
                        pots.pop();
                        this.pots(pots);
                        this.pots.notifySubscribers();
                        this.logGameEvent("Removing pot", this.pots().slice());
                        this.refreshPlaces();
                    });
                }
            });
            this.queue.pushCallback(() => {
                console.log("Finishing the game");
                self.cardsReceived = false;
                self.pots([]);

                self.handHistory.onGameFinished(gameId, winners, rake);
                self.saveHandHistory();
                this.enableInjectPlayerCards = true;
            });
            // this.queue.wait(this.animationSettings.cleanupTableTimeout - 8000);
        }

        this.queue.pushCallback(() => {
            this.enableInjectPlayerCards = false;
            self.cleanTableAfterGameFinish();
            self.proposeRebuyOrAddon();
            self.displayRebuyOrAddonTime();
        });
    }
    calculateWinnerAmount(places: TablePlaceModel[], winners: GameWinnerModel[], needHightlightCards: boolean) {
        const c: string[] = [];
        for (let w in winners) {
            if (!winners.hasOwnProperty(w)) {
                continue;
            }

            const currentWinner = winners[w];
            if (c.indexOf(currentWinner.CardsDescription) === -1) {
                c.push(currentWinner.CardsDescription);
            }

            for (let p in places) {
                if (!places.hasOwnProperty(p)) {
                    continue;
                }

                const currentPlayer = places[p];
                if (needHightlightCards) {
                    currentPlayer.CardsHightlighted(true);
                }

                if (currentPlayer.PlayerId() === currentWinner.PlayerId) {
                    let winnerCards = <number[]>[];
                    const tableCards = this.tableCards.tableCardsData();
                    const winnerCombination = currentPlayer.getCombination(tableCards);
                    currentPlayer.WinnerCombination(winnerCombination);
                    if (tableCards != null) {
                        winnerCards = winnerCards.concat(tableCards);
                    }

                    winnerCards = winnerCards.concat(currentPlayer.RawCards());
                    const handRepresentation = {
                        Cards: [],
                        Suits: []
                    };
                    winnerCards.forEach(function (card) {
                        handRepresentation.Cards.push((card % 13) + 2);
                        handRepresentation.Suits.push(1 << (card / 13));
                    });
                    if (winnerCards.length === 7 && needHightlightCards) {
                        const rank = HoldemHand.getCardRank(handRepresentation);
                        rank.WinnerCardsSet.forEach((cardIndex) => {
                            if (cardIndex === 5) {
                                currentPlayer.Card1Hightlighted(true);
                            }

                            if (cardIndex === 6) {
                                currentPlayer.Card2Hightlighted(true);
                            }

                            if (cardIndex === 0) {
                                this.tableCards.Card1Hightlighted(true);
                            }

                            if (cardIndex === 1) {
                                this.tableCards.Card2Hightlighted(true);
                            }

                            if (cardIndex === 2) {
                                this.tableCards.Card3Hightlighted(true);
                            }

                            if (cardIndex === 3) {
                                this.tableCards.Card4Hightlighted(true);
                            }

                            if (cardIndex === 4) {
                                this.tableCards.Card5Hightlighted(true);
                            }
                        });
                    }

                    currentPlayer.Money(currentPlayer.Money() + currentWinner.Amount);
                    if (currentPlayer.WinAmount() === null) {
                        currentPlayer.WinAmount(currentWinner.Amount);
                    } else {
                        currentPlayer.WinAmount(currentPlayer.WinAmount() + currentWinner.Amount);
                    }
                }
            }
        }

        return c;
    }
    cleanTableAfterGameFinish() {
        if (this.gameFinished()) {
            this.prizesDistributed(true);
            this.tableCards.CardsHightlighted(false);
            this.setCards([]);
            this.pots([]);
            const places = this.places();
            places.forEach(function (item) {
                item.prepareForNewGame();
            });
        }
    }
    onPlayerStatusCore(playerId: number, status: number) {
        this.logGameEvent("onPlayerStatus", playerId, status);
        const self = this;
        const places = this.places();
        places.forEach((p) => {
            if (p.PlayerId() === playerId) {
                const saveMask = 16;
                p.Status(status | (p.Status() & saveMask));
                if (playerId === authManager.loginId()) {
                    if (p.IsSitoutStatus()) {
                        self.actionBlock.processing(false);
                    }
                }
            }
        });
        this.refreshPlaces();
        this.actionBlock.updateNeedBB();
        this.actionBlock.updateBlocks();
    }
    onPlayerStatus(playerId: number, status: number) {
        this.queue.pushCallback(() => {
            this.onPlayerStatusCore(playerId, status);
        });
    }
    onPlayerCardsCore(playerId: number, cards: number[]) {
        const self = this;
        const oldCardsReceived = this.cardsReceived;
        this.cardsReceived = true;
        const myPlayer = this.myPlayer();
        let isHoleCards = false;
        if (myPlayer != null) {
            // If this is first cards received then this is our cards
            // Allow deals only when your cards is recived.
            if (!oldCardsReceived) {
                this.actionBlock.dealsAllowed(true);
                this.gameStarted(true);
                isHoleCards = true;
                this.handHistory.onPlayerHoleCards(playerId, cards);
                this.logGameEvent("Received hole cards");
                this.updateCurrentCombination();
            }

            if (myPlayer.IsCurrent()) {
                this.currentRaise(this.actionBlock.tableSlider.minimum());
                this.actionBlock.buttonsEnabled(true);
                this.actionBlock.updateAdditionalButtons();
                this.actionBlock.performAutomaticActions();
                this.actionBlock.resetAutomaticAction();
                this.logGameEvent("Player turn on the beginning of the game.");
                this.onMyTurn.dispatch(this.tableId);
            }
        }

        this.logGameEvent("onPlayerCards", playerId, convertToCards(cards));
        const places = this.places();
        places.forEach((p) => {
            if (p.PlayerId() === playerId) {
                const myself = self.currentLogin() === p.PlayerName();
                let couldDisplayOtherCards = myself || self.combinations().length > 0;
                couldDisplayOtherCards = true;
                if (couldDisplayOtherCards) {
                    p.setCards(cards);
                    if (!isHoleCards) {
                        p.markCardsOpened();
                    }
                }
            }
        });
        this.refreshPlaces();
        if (!isHoleCards) {
            this.handHistory.onPlayerCards(playerId, cards);
        }
    }
    onPlayerCards(playerId: number, cards: number[]) {
        const self = this;
        if (this.enableInjectPlayerCards) {
            this.queue.injectCallback(() => {
                this.onPlayerCardsCore(playerId, cards);
                this.ensureCardsOpened(playerId);
            });
        } else {
            this.queue.pushCallback(() => {
                if (!self.cardsReceived) {
                    if (playerId === authManager.loginId()) {
                        self.startDealCards();
                        this.queue.pushCallback(() => {
                            self.onPlayerCardsCore(playerId, cards);
                        });
                    } else {
                        self.onPlayerCardsCore(playerId, cards);
                    }
                } else {
                    self.onPlayerCardsCore(playerId, cards);
                }
            });
        }
    }
    onPlayerCardOpened(playerId: number, cardPosition: number, cardValue: number) {
        const self = this;
        if (this.enableInjectPlayerCards) {
            this.queue.injectCallback(() => {
                this.onPlayerCardOpenedCore(playerId, cardPosition, cardValue);
            });
        } else {
            this.queue.pushCallback(() => {
                self.onPlayerCardOpenedCore(playerId, cardPosition, cardValue);
            });
        }
    }
    private onPlayerCardOpenedCore(playerId: number, cardPosition: number, cardValue: number) {
        this.logGameEvent("onPlayerCardOpenedCore", playerId, cardPosition, cardValue);
        const places = this.places();
        places.forEach((p) => {
            if (p.PlayerId() === playerId) {
                p.openCard(cardPosition, cardValue);
            }
        });
        this.refreshPlaces();
    }
    onPlayerCardsMucked(playerId: number) {
        this.queue.pushCallback(() => {
            const currentPlayer = this.tablePlaces.getPlaceByPlayerId(playerId);
            this.foldCardsForPlayer(currentPlayer, true, this.animationSettings.foldAnimationTimeout / 2);
        });
    }
    private ensureCardsOpened(playerId: number) {
        const places = this.places();
        places.forEach((p) => {
            if (p.PlayerId() === playerId) {
                p.markCardsOpened();
                p.cardsOverlayVisible(false);
            }
        });
        this.refreshPlaces();
    }
    updateBetsAndMoney(currentPlayer: TablePlaceModel, type: number, amount: number) {
        const playerId = currentPlayer.PlayerId();
        const myself = this.myPlayer();
        const totalBet = (currentPlayer.TotalBet() === null ? 0 : currentPlayer.TotalBet());
        const currentBet = currentPlayer.Bet();
        const maximumBet = this.maximumBet();
        const amountPlaced = amount - currentBet;
        if (type === 6) {
            currentPlayer.Money(currentPlayer.Money() + amount);
            this.handHistory.onReturnMoney(playerId, amount);
            return;
        }

        const newMoney = currentPlayer.Money() - amountPlaced;
        currentPlayer.Money(newMoney);

        // If player raise then update last raise amount.
        // We have to do that before current bet for the player is changed,
        // Since calculation depends on the amount of last bet.
        if (type === 3) {
            const raiseAmount = amount;

            // Since we have raise in this round, then we no longer could
            // do bets.
            this.actionBlock.isRaise(true);

            // The raise amount could be actually smaller then the last raise amount
            // because player goes all-in, other players should be forced to pay more
            // to do the raise.
            if (raiseAmount > this.lastRaise()) {
                this.lastRaise(raiseAmount);
            }
        }

        if (type === 4) {
            this.foldCardsForPlayer(currentPlayer, false, this.animationSettings.foldAnimationTimeout);
            // Mark player as not in game.
            // During the new game this flag should be set automatically.
            currentPlayer.IsInGameStatus(false);
        }

        if (type !== 4) {
            // If player folds then current bet amount should not be changed.
            currentPlayer.Bet(amount);
            if (type === 0 || type === 1 || type === 5) {
                currentPlayer.IsBetAnimationLocked(true);
            } else {
                // Lock animation place after timeout.
                this.queue.wait(this.animationSettings.betAnimationTimeout);
                this.queue.pushCallback(() => {
                    currentPlayer.IsBetAnimationLocked(true);
                });
            }
        }

        // Display action which current player executes.
        if (type === 4) {
            // Display fold action
            currentPlayer.startAction("table.actiontext.fold");
            this.handHistory.onFold(playerId);
            if (this.soundEnabled) {
                soundManager.playFold();
            }
        } else if (type === 2) {
            // Display check/call action
            if (currentPlayer.Money() === 0) {
                currentPlayer.startAction("table.actiontext.allin");
                this.handHistory.onAllIn(playerId, amount);
                if (this.soundEnabled) {
                    soundManager.playAllIn();
                }
            } else {
                if (amountPlaced === 0) {
                    currentPlayer.startAction("table.actiontext.check");
                    this.handHistory.onCheck(playerId, amount);
                    if (this.soundEnabled) {
                        soundManager.playCheck();
                    }
                } else {
                    currentPlayer.startAction("table.actiontext.call");
                    this.handHistory.onCall(playerId, amount);
                    if (this.soundEnabled) {
                        soundManager.playCall();
                    }
                }
            }
        } else if (type === 3) {
            // Display bet/raise action
            if (currentPlayer.Money() === 0) {
                currentPlayer.startAction("table.actiontext.allin");
                this.handHistory.onAllIn(playerId, amount);
                if (this.soundEnabled) {
                    soundManager.playAllIn();
                }
            } else {
                if (maximumBet === 0) {
                    currentPlayer.startAction("table.actiontext.bet");
                    this.handHistory.onBet2(playerId, amount);
                    if (this.soundEnabled) {
                        soundManager.playBet();
                    }
                } else {
                    currentPlayer.startAction("table.actiontext.raise");
                    this.handHistory.onRaise(playerId, amount);
                    if (this.soundEnabled) {
                        soundManager.playRaise();
                    }
                }
            }
        }
    }
    foldCardsForPlayer(currentPlayer: TablePlaceModel, forceAnimation: boolean, duration: number) {
        if (currentPlayer === null) {
            console.warn("Attempt to fold cards for the player");
            return;
        }

        const myself = this.myPlayer();

        // If player folds then cards should be hidden.
        const currentCards = currentPlayer.Cards();
        currentPlayer.startFoldAnimation();
        // Current player is not active, but it not yet folded cards.
        const activePlayersCount = this.activePlayersCount() - 1;
        const displayFoldedCards = myself !== null
            && currentPlayer.PlayerId() === myself.PlayerId()
            // && activePlayersCount > 1
            && !forceAnimation;
        const modeSupportShowingFoldedCards = appConfig.game.seatMode;
        if (displayFoldedCards || modeSupportShowingFoldedCards) {
            currentPlayer.FoldedCards(currentCards);
            currentPlayer.IsCardsFolded(true);
        }

        if (appConfig.game.tablePreviewMode) {
            currentPlayer.IsCardsFolded(true);
        }

        // Inject tasks in the reverse order.
        this.queue.injectCallback(() => {
            currentPlayer.finishFoldAnimation();
        });
        this.queue.injectWait(duration);
    }
    finishFoldAnimation() {
        // Do nothing.
    }
    onBetCore(playerId: number, type: number, amount: number, nextPlayerId: number) {
        this.logGameEvent("Doing bet of type " + type);
        const places = this.places();
        const myself = this.myPlayer();
        const currentPlayer = this.tablePlaces.getPlaceByPlayerId(playerId);
        if (currentPlayer === null) {
            this.logGameEvent("No player sitting on the table.");
            return;
        }

        this.updateBetsAndMoney(currentPlayer, type, amount);

        const isMyTurn = myself !== null && nextPlayerId === myself.PlayerId();
        // Don's enable buttons until cards would be recived for players.
        if (this.cardsReceived) {
            this.actionBlock.buttonsEnabled(true);
            if (isMyTurn) {
                this.onMyTurn.dispatch(this.tableId);
            }
        }

        const forcedBets = type === 1 || type === 5;
        if (!(forcedBets && nextPlayerId === 0)) {
            this.setCurrent(nextPlayerId);

            if (isMyTurn) {
                // This will trigger reevaluation of the minimumRaiseAmount
                this.currentRaise(this.minimumRaiseAmount());
            } else {
                this.currentRaise(null);
            }
        }

        // this.refreshPlaces();

        const userActions = type === 3 || type === 4 || type === 2;
        if (userActions) {
            this.actionsCount(this.actionsCount() + 1);
        }

        const allBetsRounded = this.allBetsRounded();
        this.logGameEvent("All bets rounded", allBetsRounded);
        if (allBetsRounded) {
            this.actionBlock.buttonsEnabled(false);
            this.actionBlock.dealsAllowed(false);
        }

        if (myself !== null) {
            const requiredBet = this.maximumBet() - this.myBet();
            this.actionBlock.updateSupportDirectAmountStatus(requiredBet);
            if (nextPlayerId === myself.PlayerId()) {
                if (!allBetsRounded && userActions) {
                    this.actionBlock.performAutomaticActions();
                    this.actionBlock.resetAutomaticAction();
                }
            }

            this.actionBlock.updateAutomaticActionsText(myself.Money(), requiredBet);
            this.actionBlock.updateAdditionalButtons();
        }

        if (nextPlayerId === authManager.loginId()) {
            this.logGameEvent("Player turn approached");
            this.tablePlaces.placesRefreshTrigger();
        }

        this.logGameEvent("Action block status: MMB:.", this.actionBlock.mainButtonsBlockVisible(),
            " BEn:", this.actionBlock.buttonsEnabled(),
            " TurnEn:", this.actionBlock.turnEnabled(),
            " TTurnEn:", this.turnEnabled(),
            " CP:", this.currentPlayer(),
            " DA:", this.actionBlock.dealsAllowed(),
            " InGame:", this.actionBlock.myPlayerInGame());
        this.clearTimer();
        this.startTimer();
    }
    onBet(playerId: number, type: number, amount: number, nextPlayerId: number) {
        /// <signature>
        ///     <summary>Do bet.</summary>
        ///     <param name="playerId" type="Number">Id of the player which join the table</param>
        ///     <param name="type" type="Number">
        ///     Type of the bet.<br/>
        ///     0 - Blind
        ///     1 - Ante
        ///     2 - Check/Call
        ///     3 - Bet/Raise
        ///     4 - Fold
        ///     5 - ForcedBet
        ///     6 - ReturnMoney
        ///     </param>
        ///     <param name="amount" type="Number">Amount of money which player put in the bet</param>
        ///     <param name="nextPlayerId" type="Number">Id of the player which join the table</param>
        /// </signature>
        this.enableInjectPlayerCards = false;
        this.queue.pushCallback(() => {
            this.onBetCore(playerId, type, amount, nextPlayerId);
            this.handHistory.onBet(playerId, type, amount, nextPlayerId);
        });
    }
    startMovingChipsToPotAnimation() {
        this.logGameEvent("Moving chips to center");
        const places = this.places();
        this.places().forEach(function (value) {
            value.IsBetAnimationLocked(false);
            value.IsMovingBetToPot(true);
        });
        // this.refreshPlaces();
    }
    onMoveMoneyToPot(amount: number[]) {
        // Trigger animation.
        const self = this;
        this.actionBlock.buttonsEnabled(false);
        this.queue.wait(this.animationSettings.movingMoneyToPotPrePause);
        this.queue.pushCallback(() => {
            self.startMovingChipsToPotAnimation();
        });
        this.queue.wait(this.animationSettings.movingMoneyToPotAnimationTimeout);
        this.queue.pushCallback(() => {
            self.logGameEvent("Updating pots");
            self.setPots(amount);

            self.logGameEvent("Clearing bets");
            const places = self.places();
            self.places().forEach(function (value) {
                value.collectBet();
            });
            self.refreshPlaces();

            self.lastRaise(0);
            self.currentRaise(self.minimumRaiseAmount());
            self.actionBlock.isRaise(false);
            self.actionBlock.buttonsEnabled(true);
        });
    }
    onMoneyAdded(playerId: number, amount: number) {
        const self = this;
        const places = this.places();
        places.forEach(function (value) {
            if (value.PlayerId() === playerId) {
                // Add money only if player not currently eligible to be in game.
                // And when no game on the table.
                if (!value.IsInGameStatus() || self.gameId() === null) {
                    value.Money(value.Money() + amount);
                }
            }
        });
        this.refreshPlaces();
    }
    onMoneyRemoved(playerId: number, amount: number) {
        const self = this;
        const places = this.places();
        places.forEach(function (value) {
            if (value.PlayerId() === playerId) {
                // Add money only if player not currently eligible to be in game.
                // And when no game on the table.
                if (!value.IsInGameStatus() || self.gameId() === null) {
                    value.Money(value.Money() - amount);
                }
            }
        });
        this.refreshPlaces();
    }
    setPots(amount: number[]) {
        // Add first number to the last pot.
        const currentPots = this.pots();
        const skipCollectingPot = (currentPots.length === amount.length
            && currentPots[currentPots.length - 1] === amount[currentPots.length - 1]);
        if (!skipCollectingPot) {
            this.handHistory.onMoveMoneyToPot(amount);
        }

        let main = amount[0];
        if (this.pots().length === 0) {
            // First pot created.
            this.handHistory.onPotCreated(1, main);
        } else {
            // Update last pot
            main = amount[this.pots().length - 1];
            if (currentPots[this.pots().length - 1] !== main) {
                this.handHistory.onPotUpdated(currentPots.length, main);
            }
        }

        // Append other amounts to the end of stack.
        // and generate split pots
        for (let i = Math.max(1, currentPots.length); i < amount.length; i++) {
            if (currentPots[i] !== amount[i]) {
                this.handHistory.onPotCreated(i + 1, amount[i]);
            }
        }

        this.pots(amount);
    }

    setCards(cards: number[]) {
        /// <signature>
        ///     <summary>Set cards on the table.</summary>
        ///     <param name="cards" type="Array">Array of table cards to display</param>
        /// </signature>
        this.tableCards.setCards(cards);
    }

    /**
   * Gets current seat number for offline table
   */
    getCurrentOfflineTableSeat(): number {
        const self = this;
        let seatNumber = 0;
        app.requireAuthentication().then(function (authenticated) {
            if (authenticated) {
                const currentPlayer = self.currentLogin();
                seatNumber = parseInt(currentPlayer.replace("Игрок", ""));
                console.log("seat number " + seatNumber);
            }
        });
        return seatNumber;
    }

    showSitPrompt(seat: number) {
        if (this.sitting) {
            return;
        }

        this.sitting = true;
        const self = this;
        app.requireAuthentication().then(function (authenticated) {
            if (authenticated) {
                const currentPlayer = self.myPlayer();
                if (currentPlayer === null) {
                    app.joinTablePopup.tableView(self);
                    app.joinTablePopup.seatNumber(seat);
                    app.executeCommand("popup.joinTable");
                }
            }
        }).always(() => {
            self.sitting = false;
        });
    }
    rebuy() {
        const self = this;
        const tournamentView = this.tournament();
        const tapi = new OnlinePoker.Commanding.API.Tournament(apiHost);
        tapi.Rebuy(tournamentView.tournamentId, false).then((data) => {
            if (data.Status === "Ok") {
                self.hasPendingMoney(true);
                if (!self.hasPlayersWithoutMoney()) {
                    // self.clearNotification();
                }

                SimplePopup.display(_("tableMenu.rebuy"), _("tableMenu.rebuySuccess"));
            } else {
                SimplePopup.display(_("tableMenu.rebuy"), _("errors." + data.Status));
            }
        }, function () {
            SimplePopup.display(_("tableMenu.rebuy"), _("tableMenu.rebuyError"));
        });
    }
    doubleRebuy() {
        const self = this;
        const tournamentView = this.tournament();
        const tapi = new OnlinePoker.Commanding.API.Tournament(apiHost);
        tapi.Rebuy(tournamentView.tournamentId, true).then((data) => {
            if (data.Status === "Ok") {
                self.hasPendingMoney(true);
                if (!self.hasPlayersWithoutMoney()) {
                    // self.clearNotification();
                }

                SimplePopup.display(_("tableMenu.doublerebuy"), _("tableMenu.doublerebuySuccess"));
            } else {
                SimplePopup.display(_("tableMenu.doublerebuy"), _("errors." + data.Status));
            }
        }, function () {
            SimplePopup.display(_("tableMenu.doublerebuy"), _("tableMenu.doublerebuyError"));
        });
    }
    addon() {
        const self = this;
        const tournamentView = this.tournament();
        const tapi = new OnlinePoker.Commanding.API.Tournament(apiHost);
        tapi.Addon(tournamentView.tournamentId).then((data) => {
            if (data.Status === "Ok") {
                self.hasPendingMoney(true);
                if (!self.hasPlayersWithoutMoney()) {
                    // self.clearNotification();
                }

                // self.tournament().addonCount(self.tournament().addonCount() + 1);
                SimplePopup.display(_("tableMenu.addon"), _("tableMenu.addonSuccess"));
            } else {
                SimplePopup.display(_("tableMenu.addon"), _("errors." + data.Status));
            }
        }, function () {
            SimplePopup.display(_("tableMenu.addon"), _("tableMenu.addonError"));
        });
    }
    showRebuyPrompt() {
        const self = this;
        const tdata = this.tournament().tournamentData();
        const prompt = [_("table.rebuyPrompt", { price: tdata.RebuyFee + tdata.RebuyPrice })];
        app.prompt(_("table.rebuyPromptCaption"), prompt).then(function () {
            self.rebuy();
        });
    }
    showDoubleRebuyPrompt() {
        const self = this;
        const tdata = this.tournament().tournamentData();
        const prompt = [_("table.doubleRebuyPrompt", { price: 2 * (tdata.RebuyFee + tdata.RebuyPrice) })];
        app.prompt(_("table.doubleRebuyPromptCaption"), prompt).then(function () {
            self.doubleRebuy();
        });
    }
    showAddonPrompt() {
        const self = this;
        const tdata = this.tournament().tournamentData();
        const prompt = [_("table.addonPrompt", { price: tdata.AddonFee + tdata.AddonPrice })];
        app.prompt(_("table.addonPromptCaption"), prompt).then(function () {
            self.addon();
        });
    }
    async sit(seat: number, amount: number, ticketCode: string) {
        const self = this;
        const gameApi = new OnlinePoker.Commanding.API.Game(apiHost);
        try {
            const data = await gameApi.Sit(self.tableId, seat, amount, ticketCode);
            // report on successfull seating.
            if (data.Status === "OperationNotValidAtThisTime") {
                return {
                    success: false,
                    status: data.Status,
                    minimalAmount: undefined,
                };
            }

            if (data.Status !== "Ok") {
                return {
                    success: false,
                    status: data.Status,
                    minimalAmount: data.MinimalAmount,
                };
            } else {
                return {
                    success: true,
                    status: data.Status,
                    minimalAmount: data.MinimalAmount,
                };
            }
        } catch (e) {
            return {
                success: false,
                status: "NotSufficiendFunds",
                minimalAmount: undefined
            };
        }
    }

    showStandupPrompt(): JQueryDeferred<void> {
        /// <signature>
        ///     <summary>Shows stand up prompt.</summary>
        ///     <param name="seat" type="Number">Seat where player willing to join</param>
        ///     <param name="tableView" type="TableView">Table view where to join</param>
        /// </signature>
        const self = this;
        const result = $.Deferred<void>();
        if (self.myPlayer() != null) {
            const tournament = this.tournament();
            let messages: string[];
            let caption: string;
            if (tournament == null) {
                const hasWin = self.myPlayer().Money() > 0 || self.myPlayerInGame();
                const promptMesssage = hasWin ? "table.standupPrompt" : "table.standupPromptWithoutWin";
                caption = hasWin ? "table.standupPromptCaption" : "table.leave";
                messages = [_(promptMesssage)];
            } else {
                if (tournament.finishedPlaying()) {
                    result.resolve();
                    return result;
                }
                caption = "table.leave";
                messages = [_("table.standupTournamentPrompt")];
            }

            app.promptAsync(_(caption), messages).then(function () {
                if (self.tournament() == null) {
                    self.standup();
                }

                result.resolve();
            }, function () {
                result.reject();
            });
        } else {
            result.resolve();
        }

        return result;
    }
    showStandupConfirm() {
        let messages: string[];
        messages = [_("table.standupSuccessMessage")];
        const title = _("table.standupSuccessTitle");
        SimplePopup.display(title, messages);
    }
    async standup() {
        const self = this;
        const gameApi = new OnlinePoker.Commanding.API.Game(apiHost);
        const data = await gameApi.Standup(this.tableId);
        // report on successfull seating.
        if (data.Status === "AuthorizationError") {
            self.reportApiError("Ошибка авторизации");
        } else if (data.Status === "Ok" && appConfig.game.seatMode) {
            self.showStandupConfirm();
        }
    }

    showAddBalancePrompt(seat: number, ticketCode: string) {
        /// <signature>
        ///     <summary>Shows add balance prompt.</summary>
        ///     <param name="seat" type="Number">Seat where player willing to join</param>
        ///     <param name="tableView" type="TableView">Table view where to join</param>
        /// </signature>
        const self = this;
        const targetPlayer = this.tablePlaces.getPlaceBySeat(seat);
        const playerId = targetPlayer.PlayerId();

        const amount = prompt("Укажите сумму для пополнения счета?", "1000");
        if (amount) {
            this.addBalance(Number(amount), ticketCode);
        }
    }

    async addBalance(amount: number, ticketCode: string) {
        const self = this;
        const places = this.places();
        const targetPlayer = this.myPlayer();
        const gameApi = new OnlinePoker.Commanding.API.Game(apiHost);
        const result = $.Deferred();
        try {
            const data = await gameApi.AddBalance(this.tableId, amount, ticketCode);
            // report on successfull seating.
            if (data.Status !== "Ok") {
                throw new Error(data.Status);
            }

            if (data.Status === "Ok") {
                if (self.myPlayerInGame()) {
                    self.hasPendingMoney(true);
                }
            }

            return amount;
        } catch (e) {
            throw new Error("OperationNotAllowed");
        }
    }

    addMessage(messageId: number, sender: string, message: string) {
        const messageExists = this.messages().filter(_ => _.messageId === messageId).length > 0;
        if (!messageExists) {
            const m = new PlayerMessage(messageId, sender, message);
            this.messages.unshift(m);
            while (this.messages().length > 100) {
                this.messages.pop();
            }

            const messages = this.messages();
            this.messages([]);
            this.messages(messages);
        }

        if (this.lastMessageId >= messageId) {
            return;
        }

        const player = this.getPlayerByLogin(sender);
        if (player != null) {
            player.displayChatMessage(message);
        }
    }

    addSystemMessage(messageId: number, message: string) {
        if (this.lastMessageId >= messageId && messageId !== 0) {
            return;
        }

        const m = new SystemMessage(messageId, message);
        this.systemMessages.unshift(m);
        while (this.systemMessages().length > 100) {
            this.systemMessages.pop();
        }
    }

    updateMessage(messageId: number, sender: string, message: string) {
        // TODO: Implement updating messages.
    }

    updateSystemMessage(messageId: number, message: string) {
        // TODO: Implement updating messages.
    }

    /**
     * Sends mesage to the table chat.
     */
    async sendMessage() {
        const chatApi = new OnlinePoker.Commanding.API.Chat(apiHost);
        const data = await chatApi.SendAsync(this.tableId, this.chatMessage());
        this.chatMessage("");
    }

    async fold() {
        const self = this;
        this.actionBlock.buttonsEnabled(false);
        const gameApi = new OnlinePoker.Commanding.API.Game(apiHost);
        if (appConfig.game.useSignalR) {
            // TODO: We should provide notification, which will return any error from the server.
            connectionService.currentConnection.connection.Game.server.fold(this.tableId);
        } else {
            try {
                const data = await gameApi.Fold(this.tableId);
                if (data.Status === "OperationNotValidAtThisTime") {
                    return;
                }

                if (data.Status !== "Ok") {
                    self.reportApiError(data.Status);
                }
            } catch (e) {
                self.turnRecovery();
            }
        }
    }

    async checkOrCall() {
        const self = this;
        this.actionBlock.buttonsEnabled(false);
        const gameApi = new OnlinePoker.Commanding.API.Game(apiHost);
        if (appConfig.game.useSignalR) {
            // TODO: We should provide notification, which will return any error from the server.
            connectionService.currentConnection.connection.Game.server.checkOrCall(this.tableId);
        } else {
            try {
                const data = await gameApi.CheckOrCall(this.tableId);
                if (data.Status === "OperationNotValidAtThisTime") {
                    return;
                }

                if (data.Status !== "Ok") {
                    self.reportApiError(data.Status);
                }
            } catch (e) {
                self.turnRecovery();
            }
        }
    }

    async betOrRaise() {
        const self = this;
        this.actionBlock.buttonsEnabled(false);
        const gameApi = new OnlinePoker.Commanding.API.Game(apiHost);
        const amount: number = this.currentRaise() - this.currentBet();
        if (appConfig.game.useSignalR) {
            // TODO: We should provide notification, which will return any error from the server.
            connectionService.currentConnection.connection.Game.server.betOrRaise(this.tableId, amount);
        } else {
            try {
                const data = await gameApi.BetOrRaise(this.tableId, amount);
                if (data.Status === "OperationNotValidAtThisTime") {
                    return;
                }

                if (data.Status !== "Ok") {
                    self.reportApiError(data.Status);
                }
            } catch (e) {
                self.turnRecovery();
            }
        }
    }

    /**
     * Show cards for the current player.
     */
    async showCards() {
        this.actionBlock.showCardsEnabled(false);
        const gameApi = new OnlinePoker.Commanding.API.Game(apiHost);
        try {
            const data = await gameApi.ShowCards(this.tableId);
            if (data.Status !== "Ok") {
                this.reportApiError(data.Status);
            }
        } catch (e) {
            if (app.currentPopup !== SlowInternetService.popupName) {
                SimplePopup.display(_("table.turn"), _("table.connectionError", { tableName: this.tableName() }));
            }

            this.actionBlock.showCardsEnabled(true);
        }
    }

    /**
     * Muck cards for the current player.
     */
    async muckCards() {
        this.actionBlock.showCardsEnabled(false);
        const gameApi = new OnlinePoker.Commanding.API.Game(apiHost);
        try {
            const data = await gameApi.Muck(this.tableId);
            if (data.Status !== "Ok") {
                this.reportApiError(data.Status);
            }
        } catch (e) {
            this.actionBlock.showCardsEnabled(true);
        }
    }

    toggleCards() {
        const my = this.myPlayer();
        if (my.IsCardsOpened()) {
            this.muckCards();
        } else {
            this.showCards();
        }
    }

    showFirstCard() {
        return this.showCard(0);
    }

    showSecondCard() {
        return this.showCard(1);
    }

    /**
     * Show cards for the current player.
     */
    async showCard(cardPosition: number) {
        const showCardVariable = cardPosition === 0 ? this.actionBlock.showHoleCard1Enabled : this.actionBlock.showHoleCard2Enabled;
        showCardVariable(false);
        const gameApi = new OnlinePoker.Commanding.API.Game(apiHost);
        try {
            const data = await gameApi.ShowHoleCards(this.tableId, cardPosition);
            if (data.Status !== "Ok") {
                this.reportApiError(data.Status);
            }
        } catch (e) {
            if (app.currentPopup !== SlowInternetService.popupName) {
                SimplePopup.display(_("table.turn"), _("table.connectionError", { tableName: this.tableName() }));
            }

            showCardVariable(true);
        }
    }

    /**
     * Cards opening on the table.
     * @param cards Cards which was opened on the table.
     */
    onOpenCards(cards: number[]) {
        const self = this;
        this.queue.pushCallback(() => {
            self.actionsCount(0);
            const currentCardsOpened = self.tableCards.tableCards().length;
            const myPlayer = this.myPlayer();
            if (myPlayer) {
                myPlayer.cardsOverlayVisible(true);
            }

            self.tableCards.openCards(cards);
            self.handHistory.onOpenCards(cards);
            if (currentCardsOpened === 0 && cards.length === 3) {
                self.handHistory.onFlop(cards[0], cards[1], cards[2]);
                self.actionBlock.dealsAllowed(true);
                soundManager.playFlopCards();
            }
            if (currentCardsOpened === 3 && cards.length === 4) {
                self.handHistory.onTurn(cards[3]);
                self.actionBlock.dealsAllowed(true);
                soundManager.playTurn();
            }
            if (currentCardsOpened === 4 && cards.length === 5) {
                self.handHistory.onRiver(cards[4]);
                self.actionBlock.dealsAllowed(true);
                soundManager.playRiver();
            }
            if (currentCardsOpened === 3 && cards.length === 5) {
                self.handHistory.onTurn(cards[3]);
                self.handHistory.onRiver(cards[4]);
                // soundManager.playAllIn();
            }
            if (currentCardsOpened === 0 && cards.length === 5) {
                self.handHistory.onFlop(cards[0], cards[1], cards[2]);
                self.handHistory.onTurn(cards[3]);
                self.handHistory.onRiver(cards[4]);
                // soundManager.playAllIn();
            }
            self.actionBlock.resetAutomaticAction();
            self.actionBlock.updateAdditionalButtons();
        });
        if (self.soundEnabled) {
            soundManager.playFlop();
        }

        this.queue.wait(this.animationSettings.showCardsTimeout);
        this.queue.pushCallback(() => {
            self.updateCurrentCombination();
            self.tableCards.clearAnimation();
        });
    }

    async comeBack() {
        const self = this;
        const gameApi = new OnlinePoker.Commanding.API.Game(apiHost);
        const data = await gameApi.ComeBack(this.tableId);
        if (data.Status === "OperationNotValidAtThisTime") {
            return;
        }

        if (data.Status !== "Ok") {
            self.reportApiError(data.Status);
        }
    }

    async sitOut() {
        const self = this;
        const gameApi = new OnlinePoker.Commanding.API.Game(apiHost);
        const data = await gameApi.SitOut(this.tableId);
        if (data.Status === "OperationNotValidAtThisTime") {
            return;
        }

        if (data.Status !== "Ok") {
            self.reportApiError(data.Status);
        }
    }
    showPlayerParameters() {
        // tablePlayerParameterSelector.showPlayerParameters(this);
    }

    /**
    * Displays last hand in the history
    */
    showPreviousHand() {
        app.handHistoryPopup.tableView(this);
        app.showPopup("handHistory");
    }
    rotate(offset: number) {
        const myself = this.myPlayer();
        if (myself == null) {
            return;
        }

        const currentOffset = this.tablePlaces.getRealOffset(myself.Seat());
        if (currentOffset === offset) {
            return;
        }

        const self = this;
        app.prompt(_("table.changeplace"),
            [_("table.doyouwantchangeplace")]).then(function () {
                self.tablePlaces.rotate(offset - currentOffset);
            });
    }

    hasPlayersWithoutMoney() {
        return this.places().some(_ => _.Money() === 0);
    }

    /*
    * Display counter which indicates how much time left to buy addon or rebuy
    * if player lose game.
    */
    displayRebuyOrAddonTime() {
        const self = this;
        const tournamentView = this.tournament();

        // Display notification about rebuy or addon prompt
        // only for tournament games.
        if (tournamentView === null || tournamentView === undefined) {
            return;
        }

        // Display notification about rebuy or addon prompt
        // only if rebuy or addon allowed.
        if (!tournamentView.rebuyAllowed() && !tournamentView.addonAllowed()) {
            return;
        }

        if (this.hasPlayersWithoutMoney()) {
            // This time should be 500ms bigger then the actual time specified 
            // on the server, to accomodate for the 500ms update period.
            this.displayingRebuyAddonNotification = true;
            const totalDuration = 10.5;
            let i = 0;
            let messageTemplate: string;
            let popupCaption: string;
            if (tournamentView.rebuyAllowed()) {
                messageTemplate = "table.waitingForOtherPlayersRebuy";
                popupCaption = "table.tournamentGameFinishedRebuyCaption";
            } else if (tournamentView.addonAllowed()) {
                messageTemplate = "table.waitingForOtherPlayersAddon";
                popupCaption = "table.tournamentGameFinishedAddonCaption";
            } else {
                console.error("Unknown state during display rebuy of addon time");
            }

            this.notificationHandleInterval = timeService.setInterval(() => {
                const secondsLeft = Math.floor(totalDuration - (i / 2));
                self.showNotification(_(messageTemplate, { time: secondsLeft }));
                app.customPopup.title(_(popupCaption, { time: secondsLeft }));
                i++;
                if (i >= totalDuration * 2) {
                    self.clearNotification();
                    if (app.currentPopup === "custom") {
                        app.closePopup();
                    }
                }
            }, 500);
        }
    }

    proposeRebuyOrAddon() {
        const tournamentView = this.tournament();
        if (tournamentView !== null && this.myPlayer() !== null && this.myPlayer().Money() === 0 && !this.hasPendingMoney()) {
            if (tournamentView.rebuyAllowed()) {
                this.proposeBuyRebuy();
            }

            if (tournamentView.addonAllowed() && tournamentView.addonCount() === 0) {
                this.proposeBuyAddon();
            }
        }
    }

    /**
    * Propose buying rebuy or double rebuy
    */
    proposeBuyRebuy() {
        const self = this;
        const player = this.myPlayer();
        if (player === null) {
            return;
        }

        if (player.Money() === 0 && !this.hasPendingMoney()) {
            // Display popup with three buttons.
            const result = $.Deferred<void>();
            app.promptEx(
                _("table.tournamentGameFinishedCaption"),
                [_("table.tournamentGameFinishedRebuy")],
                [_("table.rebuy"), _("table.doubleRebuy"), _("common.cancel")],
                [() => 1, () => 2, () => { /* nothing */ }])
                .then(function (value: number) {
                    if (value === 1) {
                        self.showRebuyPrompt();
                    }

                    if (value === 2) {
                        self.showDoubleRebuyPrompt();
                    }

                    result.resolve();
                }, function () {
                    result.reject();
                });
        }
    }

    /**
    * Propose buying addon
    */
    proposeBuyAddon() {
        const self = this;
        const player = this.myPlayer();
        if (player == null) {
            console.warn("Proposing but addon when no active player");
            return;
        }

        if (player.Money() === 0 && !this.hasPendingMoney() && this.tournament().addonCount() === 0) {
            // Display popup with two buttons.
            const result = $.Deferred<void>();
            app.promptEx(
                _("table.tournamentGameFinishedCaption"),
                [_("table.tournamentGameFinishedAddon")],
                [_("table.addon"), _("common.cancel")],
                [() => 1, () => { /* nothing */ }])
                .then(function (value: number) {
                    self.showAddonPrompt();
                    result.resolve();
                }, function () {
                    result.reject();
                });
        }
    }

    /**
    * Show table notification
    */
    public showNotification(message: string) {
        this.notification(message);
        this.hasNotification(true);
    }

    /**
    * Show table notification for specific period of time
    */
    public showNotificationWithDelay(message: string, duration: number) {
        this.clearNotification();
        this.showNotification(message);
        this.notificationHandleTimeout = timeService.setTimeout(() => {
            this.clearNotification();
        }, duration);
    }

    public pushCallback(callback: Function) {
        this.queue.pushCallback(callback);
    }

    private clearNotification() {
        this.hasNotification(false);
        this.displayingRebuyAddonNotification = false;
        if (this.notificationHandleTimeout != null) {
            timeService.clearTimeout(this.notificationHandleTimeout);
            this.notificationHandleTimeout = null;
        }

        if (this.notificationHandleInterval != null) {
            timeService.clearInterval(this.notificationHandleInterval);
            this.notificationHandleInterval = null;
        }
    }

    private reportApiError(status: string) {
        if (debugSettings.tableView.reportApiError) {
            alert(status);
        }
    }

    private updatePauseDescription() {
        if (this.pauseDescriptionHandle != null) {
            timeService.clearInterval(this.pauseDescriptionHandle);
            this.pauseDescriptionHandle = null;
        }

        if (this.pauseDate() != null) {
            const updateDescription = () => {
                const tournament = this.tournament();
                if (tournament) {
                    const pauseEnds = moment(this.pauseDate()).add(tournament.tournamentData().PauseTimeout, "minutes");
                    const currentMoment = moment().add(timeService.timeDiff, "ms");
                    const diff = pauseEnds.diff(currentMoment);
                    if (diff < 0) {
                        this.clearPauseMessage();
                        return;
                    }

                    const duration = moment.duration(diff);
                    this.pauseDescription(_("table.gameContinue", { startTime: duration.humanize(true) }));
                } else {
                    this.pauseDescription(_("table.waitingForSeat"));
                }
            };
            this.pauseDescriptionHandle = timeService.setInterval(updateDescription, 500);
        }
    }

    private clearPauseMessage() {
        this.paused(false);
        this.pauseDate(null);
        this.updatePauseDescription();
    }

    /**
    * Finish animation on the table
    */
    private finishAnimation(places: TablePlaceModel[]) {
        for (let p in places) {
            if (!places.hasOwnProperty(p)) {
                continue;
            }

            const currentPlayer = places[p];
            currentPlayer.Bet(null);
            if (currentPlayer.IsFoldCards()) {
                currentPlayer.finishFoldAnimation();
            }
        }
    }

    /**
    * Updates current combination based on table status.
    */
    private updateCurrentCombination() {
        this.currentCombination(this.getCurrentCombination());
    }

    /**
     * Saves last hand history
     */
    private saveHandHistory() {
        this.lastHandHistory(null);
        if (this.handHistory != null && this.handHistory.valid) {
            this.lastHandHistory(this.handHistory);
            this.handHistory = new HandHistory(this);
        }
    }

    /**
    * Initializes the hand history
    */
    private initHandHistory() {
        const self = this;
        this.handHistory = new HandHistory(this);
        this.lastHandHistory = ko.observable<HandHistory>();
        this.hasPreviousHand = ko.computed(function () {
            const lastHand = self.lastHandHistory();
            return lastHand != null
                && lastHand.id != null;
        }, this);
        this.currentHandCaption = ko.computed(function () {
            let currentGame = self.gameId();
            if (currentGame == null) {
                currentGame = self.currentGameId();
                if (currentGame == null) {
                    return _("table.currentHandEmpty");
                }

                return _("table.currentHand", { id: currentGame });
            }

            return _("table.currentHand", { id: currentGame });
        }, this);
        this.previousHandCaption = ko.computed(function () {
            const lastHand = self.lastHandHistory();
            if (lastHand == null) {
                return "";
            }

            return _("table.lastHand", { id: lastHand.id });
        }, this);
    }

    /*
    * Prompt to refresh places information.
    */
    private refreshPlaces() {
        this.logGameEvent("Refreshing places");
        this.tablePlaces.refreshPlaces();
    }

    /**
    * Get player place by login
    */
    private getPlayerByLogin(login: string) {
        const filteredPlaces = this.places().filter(_ => _.PlayerName() === login);
        if (filteredPlaces.length === 0) {
            return null;
        }

        return filteredPlaces[0];
    }

    /**
    * Performs recovery from the network error during making turns
    */
    private turnRecovery() {
        if (app.currentPopup !== SlowInternetService.popupName) {
            SimplePopup.display(_("table.turn"), _("table.connectionError", { tableName: this.tableName() }));
        }

        this.actionBlock.buttonsEnabled(true);
    }

    /**
    * Record log message
    */
    private log(message: string, ...params: any[]) {
        const settings = debugSettings.tableView;
        if (!this.isLogEnabled()) {
            return;
        }

        console.log("Table " + this.tableId + ": " + message, params);
    }

    /**
    * Record log message
    */
    private logGameEvent(message: string, ...params: any[]) {
        const settings = debugSettings.tableView;
        if (!settings.traceGameEvents) {
            return;
        }

        this.log(message, params);
    }

    /**
    * Checks whether logging on this table is enabled.
    */
    private isLogEnabled() {
        const settings = debugSettings.tableView;
        if (!settings.trace) {
            if (settings.traceTables == null) {
                return false;
            }

            if (settings.traceTables.indexOf(this.tableId) < 0) {
                return false;
            }
        }

        return true;
    }
}
