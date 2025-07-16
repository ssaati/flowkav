import {
    ChoicesRestful,
    ComponentCollection,
    Question,
    QuestionDropdownModel,
    Serializer,
    SurveyModel
} from "survey-core";
import dataProvider, {API_BASE_URL} from "../../providers/dataProvider";
import {allQuestionNames} from "../SurveyJsUtils";

type DynamicDropdownQuestion = QuestionDropdownModel  & {
    dataUrl: string;
    valueField: string;
    titleField: string;
    jsonObj: any;
    updateChoicesConfig?: () => void;
};
ChoicesRestful.onBeforeSendRequest = (sender, options) => {
    console.log(sender);
    console.log(options);
}
const FORM_QUESTIOPN = "dynamicdropdown";
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

export const addDynamicDropdownModel = ()=> {
    if (ComponentCollection.Instance.getCustomQuestionByName(FORM_QUESTIOPN))
        return
    ComponentCollection.Instance.add({
        name: FORM_QUESTIOPN,
        title: "اتصال به فرم دیگر",
        questionJSON: {
            type: "dropdown",
            choicesByUrl: {url: "https://surveyjs.io/api/CountriesExample"}
        },
        onInit() {
            const question = this as DynamicDropdownQuestion;
            question.updateChoicesConfig = () => {
                if (!question.form)
                    return;
                question.choicesByUrl = new ChoicesRestful();
                // question.choicesByUrl.url = API_BASE_URL + "/results/" + question.jsonObj.form + "/" + question.jsonObj.field
                question.choicesByUrl.url = "https://surveyjs.io/api/CountriesExample"
                if (question.choicesByUrl) {
                    setTimeout(() => question.choicesByUrl?.run(), 100);
                }
            };
            question.updateChoicesConfig();
        },
        onLoaded(question: DynamicDropdownQuestion) {
            question.updateChoicesConfig = () => {
                if (!question.jsonObj.form)
                    return;
                let url =  new ChoicesRestful();
                url.setData({url:"https://surveyjs.io/api/CountriesExample"})
                question.choicesByUrl = url;
                url.setPropertyValue("url", "https://surveyjs.io/api/CountriesExample")
                // question.choicesByUrl.url = API_BASE_URL + "/results/" + question.jsonObj.form + "/" + question.jsonObj.field
                // question.choicesByUrl.url = "https://surveyjs.io/api/CountriesExample"
                if (question.choicesByUrl) {
                    setTimeout(() => question.choicesByUrl?.run(), 100);
                }
            };
            question.updateChoicesConfig();
        },
        onPropertyChanged(question, propertyName) {
            if (["dataUrl", "valueField", "titleField", "path"].includes(propertyName)) {
                if (question.updateChoicesConfig) {
                    question.updateChoicesConfig();
                }
            }
        }
    });
}