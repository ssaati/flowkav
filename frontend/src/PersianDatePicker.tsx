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

// ...

export class PersianDatePicker extends SurveyQuestionElementBase {
    title: "تقویم"
    constructor(props) {
        super(props);
        this.state = { value: this.question.value };
    }
    get question() {
        return this.questionBase;
    }
    get value() {
        return this.question.value;
    }
    get type() {
        return this.question.datePickerType;
    }
    handleDateChange = (data) => {
        this.question.value = data;
    };

    // Support the read-only and design modes
    get style(): CSSProperties {
        return this.question.getPropertyValue("readOnly")
        || this.question.isDesignMode ? { pointerEvents: "none" } : {};
    }

    renderPersianDatePicker(type) {
        switch (type) {
            case "date": {
                return (
                    <DatePicker
                        value={this.value}
                        onChange={(date: any) => this.handleDateChange(date?.format('YYYY-MM-DD') || '')}
                        calendar={persian}
                        locale={persian_fa}
                        calendarPosition="bottom-right"
                        inputClass="form-control"
                        format="YYYY/MM/DD"
                    />
                );
            }
            case "time": {
                return (
                    <DatePicker
                        value={this.value}
                        onChange={(date: any) => this.handleDateChange(date?.format('YYYY-MM-DD HH:mm:ss') || '')}
                        calendar={persian}
                        locale={persian_fa}
                        calendarPosition="bottom-right"
                        inputClass="form-control"

                        format="YYYY/MM/DD"
                    />
                );
            }
            default:
                return (
                    <DatePicker
                        value={this.value}
                        onChange={(date: any) => this.handleDateChange(date?.format('YYYY-MM-DD HH:mm:ss') || '')}
                        calendar={persian}
                        locale={persian_fa}
                        calendarPosition="bottom-right"
                        inputClass="form-control"
                        format="YYYY/MM/DD"
                    />
                );
        }
    }

    renderElement() {
        return (
            <div style={this.style}>
                {this.renderPersianDatePicker(this.type)}
            </div>
        );
    }
}

const CUSTOM_TYPE = "persian-date-picker";
let widgetsRegistered = false;

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
        displayName: "تقویم شمسی",

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
    });
}
