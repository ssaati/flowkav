// Enhanced AutocompleteQuestion.jsx
import React, {useState, useEffect, createElement} from 'react';
import {
    Autocomplete,
    TextField,
    CircularProgress,
    Alert
} from '@mui/material';
import {ReactQuestionFactory} from "survey-react-ui";
import {ElementFactory, Question, Serializer} from "survey-core";
import dataProvider from "../../providers/dataProvider";
import {allQuestionNames} from "../SurveyJsUtils";
import {getLocaleStrings} from "survey-creator-core";

export function AutocompleteQuestion({ question }) {
    const [state, setState] = useState({
        inputValue: '',
        options: [],
        loading: false,
        error: null
    });

    useEffect(() => {
        const controller = new AbortController();

        const search = async () => {
            if (!state.inputValue) return;

            try {

                setState(prev => ({ ...prev, loading: true, error: null }));
                const data = await dataProvider.resultItems(question?.form, question?.field, state.inputValue);
                setState(prev => ({
                    ...prev,
                    options: data,
                    loading: false
                }));
            } catch (error) {
                if (error.name !== 'AbortError') {
                    setState(prev => ({
                        ...prev,
                        error: error.message,
                        loading: false
                    }));
                }
            }
        };

        const timer = setTimeout(search, 500);
        return () => {
            controller.abort();
            clearTimeout(timer);
        };
    }, [state.inputValue]);

    return (
        <div className="autocomplete-question">
            <Autocomplete
                options={state.options}
                loading={state.loading}
                disabled={question.isReadOnly}
                value={state.options.find((o:any) => o.id === question.value) || null}
                onChange={(_, newValue: any) => {
                    question.value = newValue?.id || null;
                }}
                inputValue={state.inputValue}
                onInputChange={(_, newInputValue) => {
                    setState(prev => ({ ...prev, inputValue: newInputValue }));
                }}
                getOptionLabel={(option) => option.label || ''}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={question.title}
                        variant="outlined"
                        fullWidth
                        error={!!state.error}
                        helperText={state.error}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {state.loading ? (
                                        <CircularProgress color="inherit" size={20} />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
            />
        </div>
    );
}


const CUSTOM_TYPE = "form-autocomplete";
const locale = getLocaleStrings("fa");
locale.qt[CUSTOM_TYPE] = "انتخاب از فرم";

export class FormAutocompleteModel extends Question {
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
export function registerFormAutocomplete() {
    ReactQuestionFactory.Instance.registerQuestion(CUSTOM_TYPE, (props: any) => {
        return createElement(AutocompleteQuestion, props);
    });
    Serializer.addClass(
        CUSTOM_TYPE,
        [{
            name: "datePickerType",
            displayName:"اتصال به فرم",
            default: "time",
            choices: [{value: "date", text: "تاریخ"}, {value: "time", text: "زمان"}],
            category: "general",
            visibleIndex: 2 // Place after the Name and Title
        }],
        function () {
            return new FormAutocompleteModel("");
        },
        "question"
    );

    ElementFactory.Instance.registerElement(
        CUSTOM_TYPE,
        (name) => {
            return new FormAutocompleteModel(name);
        }
    );
    Serializer.addProperty(CUSTOM_TYPE, {
        name: "form",
        category: "تنظیمات فرم",
        categoryIndex: 1,
        type:"dropdown",
        choices: function (obj, choicesCallback) {
            if (!choicesCallback)
                return;
            dataProvider.getList("forms", { pagination: { page: 1, perPage: 100 }, sort: { field: "name", order: "ASC" } })
                .then(({ data }) => {
                    const result: any[] = [];
                    result.push({ value: null });
                    for (let i = 0; i < data.length; i++) {
                        const item = data[i];
                        result.push({ value: item.id, text: item.name });
                    }
                    choicesCallback(result);

                })
                .catch((error) => console.error(error));
        }
    });

    Serializer.addProperty(CUSTOM_TYPE, {
        name: "field",
        category: "تنظیمات فرم",
        dependsOn: [ "form" ],
        type:"dropdown",
        choices: function (obj, choicesCallback) {
            if (!choicesCallback || !obj.form)
                return;
            dataProvider.getOne("forms", {id:obj.form})
                .then(({ data }) => {
                    let allQuestions = allQuestionNames(data.json) || [];
                    const result: any[] = [];
                    result.push({ value: null });
                    for (let i = 0; i < allQuestions.length; i++) {
                        const item = allQuestions[i];
                        result.push({ value: item, text: item });
                    }
                    choicesCallback(result);
                })
                .catch((error) => console.error(error));
        }
    });
}
