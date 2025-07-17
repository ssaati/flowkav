// SelectForm.tsx

import {CustomWidgetCollection, Question} from "survey-core";
import { ElementFactory } from "survey-core";
import { Serializer } from "survey-core";

import React, {createElement} from 'react';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';

import { CSSProperties } from "react";
import {ReactQuestionFactory, SurveyQuestionElementBase} from "survey-react-ui";
import { getLocaleStrings } from "survey-creator-core";
import {PersianDatePicker} from "./PersianDateComponent";



const CUSTOM_TYPE = "persian-date-picker";
let widgetsRegistered = false;
const locale = getLocaleStrings("fa");
locale.qt[CUSTOM_TYPE] = "تقویم شمسی";

export class QuestionPersianPickerModel extends Question {
    getType() {
        return CUSTOM_TYPE;
    }
    get datePickerType() {
        return this.getPropertyValue("datePickerType");
    }
    set datePickerType(val) {
        this.setPropertyValue("datePickerType", val);
    }

}
export function registerPersianDatePicker() {
    if (widgetsRegistered)
        return;
    widgetsRegistered = true;

    ReactQuestionFactory.Instance.registerQuestion(CUSTOM_TYPE, (props) => {
        return createElement(PersianDatePicker, props);
    });

    ElementFactory.Instance.registerElement(
        CUSTOM_TYPE,
        (name) => {
            return new QuestionPersianPickerModel(name);
        }
    );
    Serializer.addClass(
        CUSTOM_TYPE,
        [{
            name: "datePickerType",
            displayName:"نوع تقویم",
            default: "time",
            choices: [{value: "date", text: "تاریخ"}, {value: "time", text: "زمان"}],
            category: "general",
            visibleIndex: 2 // Place after the Name and Title
            // onSetValue: (survey, value) => {
            // }
        }],
        function () {
            return new QuestionPersianPickerModel("");
        },
        "question"
    );

    CustomWidgetCollection.Instance.addCustomWidget({
        name: CUSTOM_TYPE,
        title: "تقویم شمسی",
        getTitle(){
            return "تقویم شمسی";
        },
        isFit: (question) => question.getType() === 'text' && question.inputType === 'date',
        widget: (question) => {
            return (
                <PersianDatePicker
                    value={question.value}
                    onChange={(newValue) => {
                        question.value = newValue;
                    }}
                />
            );
        },
        category: "text"
    });
}
