import {ComponentCollection, Question, Serializer} from "survey-core";
import dataProvider, {API_BASE_URL} from "../../providers/dataProvider";
import {allQuestionNames} from "../SurveyJsUtils";

function setUp(FORM_QUESTIOPN: string) {
    Serializer.addProperty(FORM_QUESTIOPN, {
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

    Serializer.addProperty(FORM_QUESTIOPN, {
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

export const addFormQuestion= () => {
    const FORM_QUESTIOPN = "question-type-form";
    if (ComponentCollection.Instance.getCustomQuestionByName(FORM_QUESTIOPN))
        return
    ComponentCollection.Instance.add({
        name: FORM_QUESTIOPN,
        title: "فرم",
        defaultQuestionTitle: {
            "default": "فرم",
        },
        questionJSON: {
            "type": "dropdown",
            "placeholder": {
                "default": "نام فیلد را انتخاب کنید",
            },
            "choicesByUrl": {
                "url": "https://surveyjs.io/api/CountriesExample",
            }
        },
        onPropertyChanged(question: Question, propertyName: string, newValue: any) {
            if (["form", "field"].indexOf(propertyName) > -1) {
                console.log(question.title + ":" + propertyName + ":" + newValue);
                console.log(question.form, question.field);
                question.customQuestion.json.questionJSON.choicesByUrl = {url:API_BASE_URL + "/results/" + this.form + "/" + this.field, clearCache:true};
                this.questionJSON.choicesByUrl = {url:API_BASE_URL + "/results/" + question.form + "/" + question.field, clearCache:true};
                    // this.questionJSON = {
                    // "type": "dropdown",
                    // "placeholder": {
                    //     "default": "نام فیلد را انتخاب کنید",
                    // },
                    // "choicesByUrl": {
                    //     "url": API_BASE_URL + "/results/" + question.form + "/" + question.field,
                    // }
                // };
            }
        },
        inheritBaseProps: true,
        onInit() {
            setUp(FORM_QUESTIOPN);
        }

    });

}
