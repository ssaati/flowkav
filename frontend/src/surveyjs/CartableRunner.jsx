import React, { useEffect, useState } from 'react';
import { useDataProvider } from 'react-admin';
import {useParams} from "react-router-dom";
import {Model, Survey, SurveyModel} from "survey-react-ui";

const CartableRunner = () => {
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
    const handleComplete = (survey) => {
        dataProvider.create('results/cartable', {
            data: {
                cartableId: id,
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

export default CartableRunner;
