import React, { useEffect, useState } from 'react';
import { useDataProvider } from 'react-admin';
import {useParams} from "react-router-dom";
import {Model, Survey, SurveyModel} from "survey-react-ui";

const FormViewer = () => {
    const dataProvider = useDataProvider();
    const {id} = useParams();
    const [model, setModel] = useState(null);

    useEffect(() => {
        // loadSurveyAndResult();
        dataProvider.getOne('cartable', { id: id })
            .then(({data}) => {
                let model= new Model(data.form.json);
                model.data= data.result.data;
                model.locale = 'fa';
                model.mode= 'display';
                setModel(model);
            })
            .catch(err => console.error('خطا در دریافت فرم:', err));
    }, [dataProvider]);

    // async function loadSurveyAndResult(){
    //     const [formPromise, resultPromise] = Promise.all([
    //         dataProvider.getOne('forms', { id: id }),
    //         dataProvider.getOne('results', { id: id })
    //     ]);
    //     const form = await formPromise.json();
    //     const result = await resultPromise.json();
    //     form.json.data = result;
    //     setSurveyJson(form.json);
    //
    // }

    return (
        <div>
            {model ? (
                <Survey
                    model={model}
                />
            ): <h2>صبر کنید تا فرم نمایش داده شود</h2>}
        </div>
    );
};

export default FormViewer;
