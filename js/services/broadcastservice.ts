﻿import { SimplePopup } from "../popups/simplepopup";
import { _ } from "../languagemanager";

/**
 * Manages broadcast services
 */
class BroadcastService {
    /**
     * Displays broadcast messages
     * @message String Broadcast message to be displayed.
     */
    public displayMessage(message: string) {
        SimplePopup.display(_("broadcast.caption"), message);
    }
}

const broadcastService = new BroadcastService();
export = broadcastService;
