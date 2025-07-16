import React, { useEffect, useState } from 'react';
import { useDataProvider } from 'react-admin';
// import {Survey} from 'survey-react';
// import 'survey-react/survey.css';
import {useParams} from "react-router-dom";
import {yekanTheme} from "./yekan_theme.js";
import {Model, SurveyModel} from 'survey-core'
import {Survey} from "survey-react-ui";

const FormRunner = () => {
    const dataProvider = useDataProvider();
    const [surveyJson, setSurveyJson] = useState(null);
    const {id} = useParams();
    const [model, setModel] = useState<SurveyModel | null>(null);

    function formLoaded(json) {

        setSurveyJson(json)
        let model= new Model(json);
        model.locale = 'fa';
        model.applyTheme(yekanTheme);
        let allQuestions = model.getAllQuestions();
        // addDynamicDropdownModel();

        setModel(model);
    }

    useEffect(() => {
        dataProvider.myForm(id)
            .then((data) => formLoaded(data.json))
            .catch(err => console.error('خطا در دریافت فرم:', err));
    }, [dataProvider]);

    const handleComplete = (survey) => {
        dataProvider.create('results', {
            data: {
                formId: id,
                data: survey.data,
                formResultText: JSON.stringify(survey.data)
            },
        })
        .then(() => alert('فرم ارسال شد!'))
        .catch(err => console.error('خطا در ارسال:', err));
    };

    return (
        <div>
            {model ? (
                <Survey
                    model={model}
                    // json={surveyJson}
                    onComplete={handleComplete}
                />
            ): <h2>صبر کنید تا فرم نمایش داده شود</h2>}
        </div>
    );
};

export default FormRunner;
