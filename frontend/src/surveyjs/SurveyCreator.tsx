'use client'

import { SurveyCreatorComponent, SurveyCreator } from "survey-creator-react";
import "survey-core/survey-core.css";
import "survey-creator-core/survey-creator-core.css";
import "survey-core/survey.i18n";
import "survey-creator-core/survey-creator-core.i18n";

// Enable Ace Editor in the JSON Editor tab
// import "ace-builds/src-noconflict/ace";
// import "ace-builds/src-noconflict/ext-searchbox";

import {ComponentCollection, CustomWidgetCollection, ElementFactory, Serializer} from "survey-core";

import React, {useEffect, useMemo, useState} from 'react'
import "survey-creator-core/i18n/persian";
import { DefaultFonts } from "survey-creator-core";
import { yekanTheme } from "./yekan_theme";
import {useParams} from "react-router-dom";
import {useDataProvider, useUpdate} from "react-admin";
import {makeFarsi} from "../forms/farsi";
// import {addFormQuestion} from "./formquestiontype/FormQuestion";
import {addFormFieldQuestion} from "./formquestiontype/FormField";
import {registerPersianDatePicker} from "./datepicker/PersianDateQuestion";
import {addFormQuestion} from "./formquestiontype/FormQuestion";
import {ReactQuestionFactory} from "survey-react-ui";
import {AutocompleteQuestion, registerFormAutocomplete} from "./formquestiontype/AutocompleteQuestion"

const SurveyCreatorWidget = (): React.ReactElement => {
    const dataProvider = useDataProvider();
    const [form, setForm] = useState<{id:string}>();
    const { id } = useParams();
    const [update, { isLoading }] = useUpdate();
    const creator = useMemo(() => {
        const options = {
            showLogicTab: false,
            showThemeTab: false,
            showTranslationTab: false,
            showPreviewTab:true,
            showJSONEditorTab:false,
            questionTypes: [
                "text"
                ,
                "checkbox"
                , "radiogroup"
                , "dropdown"
                , "boolean"
                , "file"
                , "image"
                , "slider"
                , "multipletext"
                // , "matrix"
                // , "html"
                , "panel"
                , "paneldynamic"
                , "persian-date-picker"
                , "form-autocomplete"
            ]
        };
        return new SurveyCreator(options);
    }, []);

    const text = creator.toolbox.getItemByName("text");
    text.removeSubitem("month")
    text.removeSubitem("week")
    text.removeSubitem("color")
    text.removeSubitem("date")
    text.removeSubitem("datetime-local")

    DefaultFonts.push('Yekan');
    creator.isAutoSave = true;
    creator.applyCreatorTheme(yekanTheme)
    creator.locale = 'fa';
    makeFarsi(creator);
    creator.propertyGridNavigationMode='accordion'
    // creator.collapseAllPropertyGridCategories();
    // creator.expandPropertyGridCategory("general");
    registerPersianDatePicker();
    registerFormAutocomplete();

    creator.saveSurveyFunc = (saveNo: number, callback: (no: string, success: boolean) => void) => {
        update('forms', {
            id: id? id : form?.id,
            data: {id:id,designer:true, json: creator.JSON}
        }, {
            onSuccess: () => {
                callback(id as string, true);
            },
        });
    }

    useEffect(() => {
        dataProvider.getOne("forms", {id:id? id : 0})
            .then(({ data }) => {
                setForm(data);
                creator.JSON = data?.json;
            })
            .catch((error) => console.error(error));
    }, []);

    return (<>
        <SurveyCreatorComponent creator={creator}/>
    </>)
}

export default SurveyCreatorWidget