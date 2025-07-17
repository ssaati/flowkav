import {SurveyQuestionElementBase} from "survey-react-ui";
import React, {CSSProperties} from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

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
                        inputClass="sd-input sd-text"
                        format="YYYY/MM/DD"
                        style={{width: "100%"}}
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
                        inputClass="sd-input sd-text"
                        format="YYYY/MM/DD"
                        style={{width: "100%"}}
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
                        inputClass="sd-input sd-text"
                        format="YYYY/MM/DD"
                        style={{width: "100%"}}
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
