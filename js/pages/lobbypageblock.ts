﻿import { TournamentDefinition } from "@poker/api-server";
import { App } from "../app";
import { PageBlock } from "../pageblock";
import { LobbyPage } from "./lobbypage";
import { TablesListPage } from "./tableslistpage";
import { TournamentLobbyPage } from "./tournamentlobbypage";
import { TournamentsListPage } from "./tournamentslistpage";

declare var app: App;

export class LobbyPageBlock extends PageBlock {
    public sngListPage: TournamentsListPage;
    public tournamentsListPage: TournamentsListPage;
    public lobbyPage: LobbyPage;
    public tournamentLobbyPage: TournamentLobbyPage;
    public tablesListPage: TablesListPage;

    constructor() {
        const lobbyPage = new LobbyPage();
        super("lobby", "filter", lobbyPage);

        this.lobbyPage = lobbyPage;
        this.tablesListPage = new TablesListPage();
        this.addSecondary("tablesList", this.tablesListPage);
        this.tournamentLobbyPage = new TournamentLobbyPage();
        App.addTabBarItemMapping("lobby", "tournamentLobby");
        this.addSecondary("tournamentLobby", this.tournamentLobbyPage);
        this.tournamentsListPage = new TournamentsListPage();
        App.addTabBarItemMapping("lobby", "tournamentsList");
        this.addSecondary("tournamentsList", this.tournamentsListPage);
        this.sngListPage = new TournamentsListPage();
        App.addTabBarItemMapping("lobby", "sngList");
        this.addSecondary("sngList", this.sngListPage);

        this.addSecondary("lobby", this.lobbyPage, true);
        this.currentPage = "lobby";
    }
    public showLobby() {
        app.executeCommand("pageblock.lobby");
        app.lobbyPageBlock.showSecondary("lobby");
    }
    public selectTournament(tournament: TournamentDefinition) {
        this.tournamentLobbyPage.setTournament(tournament.TournamentId, this.currentPage);
        this.showSecondary("tournamentLobby");
    }
}
