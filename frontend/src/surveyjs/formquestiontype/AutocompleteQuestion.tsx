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
            if (!state.inputValue || !question.searchUrl) return;

            try {
                setState(prev => ({ ...prev, loading: true, error: null }));

                const url = new URL(question.searchUrl);
                url.searchParams.set('query', state.inputValue);

                // Add survey context as params
                if (question.contextParams) {
                    question.contextParams.split(',').forEach(param => {
                        // const value = survey.getValue(param.trim());
                        // if (value) url.searchParams.set(param.trim(), value);
                    });
                }

                const response = await fetch(url, {
                    signal: controller.signal
                });

                if (!response.ok) throw new Error(response.statusText);

                const data = await response.json();
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
    }, [state.inputValue, question.searchUrl]);

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
}
