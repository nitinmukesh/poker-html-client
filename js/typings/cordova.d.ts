﻿/// <reference types="cordova-plugin-camera" />
/// <reference types="cordova-plugin-device" />
/// <reference types="cordova-plugin-keyboard" />
/// <reference types="cordova-plugin-media" />
/// <reference types="cordova-plugin-network-information" />
/// <reference types="cordova-plugin-statusbar" />
/// <reference types="cordova-plugin-splashscreen" />

interface Device {
    available: boolean;
}

interface Window {
    device: Device;
}

interface PhoneGapApplication {
    exitApp(): void;
}

interface Navigator {
    app: PhoneGapApplication;
}

interface CordovaMenuItem {
    id: number;
    order: number;
    name: string;
}

interface CordovaMenu {
    initialize(items: CordovaMenuItem[]): void;
    optionItemClick: (optionId: number) => void;
}

interface CordovaScreenOrientation {
    setOrientation(orientation: string): void;
    lock(): void;
    unlock(): void;
    shouldRotateToOrientation(orientation: any): boolean;
}

interface IScreenOrientation {
    lock(orientation: string): Promise<void>;
}

interface IScreen {
    orientation: IScreenOrientation;
}

interface Screen extends IScreen {

}

declare var menu: CordovaMenu;
declare var ScreenOrientation: CordovaScreenOrientation;

declare module WindowsAzure {
    export module Messaging {
        interface RegistrationInformation {
            registrationId: string;
        }

        interface Promise {
            then(success: (result: RegistrationInformation) => void, failure: (error: string) => void): void;
        }

        interface NotificationHubInterface {
            new (hub: string, connectionString: string, options: any): this;
            registerApplicationAsync: () => Promise;
            onPushNotificationReceived: (message: any) => void;
        }

        var NotificationHub: NotificationHubInterface;
    }
}
