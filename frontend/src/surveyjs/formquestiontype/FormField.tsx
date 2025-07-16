import {Serializer} from "survey-core";
import dataProvider from "../../providers/dataProvider";
import {allQuestionNames} from "../SurveyJsUtils";
import {PropertyGridEditorCollection} from "survey-creator-core";

export const addFormFieldQuestion= (creator: any) => {

    PropertyGridEditorCollection.register({
        fit: (prop) => {
            console.log(prop);
            return prop.type === "form";
        },
        getJSON: (obj, prop, options) => {
            return { type: "dropdown", choicesByUrl: 'choicesByUrlValue' };
        }
    });
    Serializer.addProperty("form", {
        name: "form",
        category: "تنظیمات فرم",
        categoryIndex: 1,
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

    Serializer.addProperty("form", {
        name: "field",
        category: "تنظیمات فرم",
        dependsOn: [ "form" ],
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
