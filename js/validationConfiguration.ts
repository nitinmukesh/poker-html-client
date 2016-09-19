import * as kov from "knockout.validation";
import * as ko from "knockout";

export function updateDefaultMessages() {
    kov;
    ko.validation.rules.required.message = 'Это поле обязательно';
    ko.validation.rules.email.message = 'Укажите правильный email';
    ko.validation.rules.equal.message = 'Значения должны совпадать';
    ko.validation.rules.minLength.message = 'Логин должен быть не менее {0} символов';
    ko.validation.rules.maxLength.message = 'Логин должен быть не более {0} символов';
}